// /routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const { checkPermission } = require('../middleware/checkPermission');
const path = require('path');
const fs = require("fs");
const fileDb = require('../models/fileMetadataDb');

const FILE_DB = "file_metadata";

/* ============================
   UPLOAD FILE
============================ */
router.post('/upload', upload.single('document'), checkPermission("upload"), async (req, res) => {
    const file = req.file;
    const department = req.query.department || req.body.department || 'general';
    const dbName = req.body.dbName;
    const uploadedBy = req.body.uploadedBy || "system";
    const category = req.body.category || req.query.category || null;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        await fileDb.query(
            `INSERT INTO ${FILE_DB}.uploaded_files (filename, path, department, category, uploaded_by, database_name)
                VALUES (?, ?, ?, ?, ?, ?)`,
            [file.filename, `/uploads/${department}/${file.filename}`, department, category, uploadedBy, dbName]
        );

        res.status(200).json({
            message: 'File uploaded successfully',
            filename: file.filename,
            path: `/uploads/${department}/${file.filename}`
        });
    } catch (dbErr) {
        console.error("DB insert error:", dbErr);
        res.status(500).json({ error: "Failed to save metadata" });
    }
});

/* ============================
   FETCH DOCUMENTS BY DEPT/CAT
============================ */
router.get("/documents/:department", async (req, res) => {
    const { department } = req.params;
    const { category } = req.query;

    try {
        let query = 
            `SELECT id, filename, path, department, uploaded_by, database_name, upload_date 
            FROM ${FILE_DB}.uploaded_files 
            WHERE department = ?`
        ;
        const params = [department];

        if (category) {
            query += " AND category = ?";
            params.push(category);
        }

        query += " ORDER BY upload_date DESC";

        const results = await fileDb.query(query, params);
        res.json(results);
    } catch (err) {
        console.error("DB fetch error:", err);
        res.status(500).json({ error: "Failed to fetch documents" });
    }
});

/* ============================
   DELETE FILE
============================ */
router.delete("/uploads/:department/:filename", express.json(), async (req, res) => {
    try {
        await checkPermission("delete")(req, res, async () => {
            const { department, filename } = req.params;
            const filePath = path.join(__dirname, "../uploads", department, filename);

            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, err => {
                    if (err) console.error("File unlink failed:", err);
                });
            }

            await fileDb.query(
                `DELETE FROM ${FILE_DB}.uploaded_files 
                WHERE filename = ? AND department = ?`,
                [filename, department]
            );

            res.json({ message: "File deleted successfully" });
        });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Failed to delete file" });
    }
});

module.exports = router;