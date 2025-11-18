// /routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const { checkPermission } = require('../middleware/checkPermission');
const path = require('path');
const fs = require("fs");

/* ============================
   UPLOAD FILE
============================ */
router.post('/upload', upload.single('document'), checkPermission("upload"), async (req, res) => {
    const file = req.file;
    const department = (req.query.department || req.body.department || 'GENERAL').toUpperCase();
    const dbName = req.body.dbName;
    const uploadedBy = req.body.uploadedBy || "system";
    const category = req.body.category || req.query.category || null;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const [existingFile] = await req.mainDb.query(
            `SELECT id FROM uploaded_files WHERE filename = ? AND department = ? LIMIT 1`,
            [file.filename, department]
        );

        if (existingFile) {
            return res.status(409).json({
                error: `A file named "${file.filename}" already exists in the ${department} department.`,
            });
        }

        await req.mainDb.query(
            `INSERT INTO uploaded_files (filename, path, department, category, uploaded_by, database_name)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                file.filename,
                category
                    ? `/uploads/${department}/${category}/${file.filename}`
                    : `/uploads/${department}/${file.filename}`,
                department,
                category,
                uploadedBy,
                dbName
            ]
        );

        res.status(200).json({
            message: 'File uploaded successfully',
            filename: file.filename,
            path: category
                ? `/uploads/${department}/${category}/${file.filename}`
                : `/uploads/${department}/${file.filename}`
        });
    } catch (dbErr) {
        console.error("DB insert error:", dbErr);
        res.status(500).json({ error: "Failed to save metadata" });
    }
});

/* ============================
   FETCH DOCUMENTS BY DEPT/CAT (WITH PERMISSIONS)
============================ */
router.get("/documents/:department", async (req, res) => {
    const department = req.params.department.toUpperCase();
    const category = req.query.category || null;

    try {
        let query = 
            `SELECT id, filename, path, department, uploaded_by, database_name, upload_date 
            FROM uploaded_files 
            WHERE department = ?`
        ;
        const params = [department];

        if (category) {
            query += " AND category = ?";
            params.push(category);
        }

        query += " ORDER BY upload_date DESC";

        const documents = await req.mainDb.query(query, params);
        res.json(documents);
    } catch (err) {
        console.error("DB fetch error:", err);
        res.status(500).json({ error: "Failed to fetch documents" });
    }
});

/* ============================
   DELETE FILE
============================ */
router.delete(
    "/uploads/:department/:filename",
    express.json(),
    checkPermission("delete"),
    async (req, res) => {
        const { department, filename } = req.params;
        const category = req.query.category || null;

        const filePath = category 
            ? path.join(__dirname, "../uploads", department, category, filename)
            : path.join(__dirname, "../uploads", department, filename);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            await req.mainDb.query(
                `DELETE FROM uploaded_files 
                WHERE filename = ? AND department = ? ${category ? "AND category = ?" : ""}`,
                category ? [filename, department, category] : [filename, department]
            );

            res.json({ message: "File deleted successfully" });
        } catch (err) {
            console.error("Delete error:", err);
            res.status(500).json({ error: "Failed to delete file" });
        }
    }
);

module.exports = router;