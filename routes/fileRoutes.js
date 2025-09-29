// /routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const { checkPermission } = require('../middleware/checkPermission');
const path = require('path');
const fs = require("fs");
const fileDb = require('../models/fileMetadataDb');

// POST /upload
router.post('/upload', checkPermission("upload"), (req, res) => {
    upload.single('document')(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: err.message || 'Upload error' });
        }

        const file = req.file;
        const department = req.query.department || req.body.department  || 'general';
        const dbName = req.body.dbName || "file_metadata";
        const uploadedBy = req.body.uploadedBy || "system";

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            await fileDb.query(
                `INSERT INTO uploaded_files (filename, path, department, uploaded_by, database_name)
                VALUES (?, ?, ?, ?, ?)`,
                [file.filename, `/uploads/${department}/${file.filename}`, department, uploadedBy, dbName]
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
});

// GET /documents/:department
router.get("/documents/:department", async (req, res) => {
    const { department } = req.params;

    try {
        const results = await fileDb.query(
            `SELECT id, filename, path, department, uploaded_by, database_name, upload_date 
            FROM file_metadata.uploaded_files 
            WHERE department = ? 
            ORDER BY upload_date DESC`,
            [department]
        );

        res.json(results);
    } catch(err) {
        console.error("DB fetch error:", err);
        res.status(500).json({ error: "Failed to fetch documents" });
    }
});

// DELETE /uploads/:department/:filename
router.delete("/uploads/:department/:filename", checkPermission("delete"), async (req, res) => {
    const { department, filename } = req.params;
    const filePath = path.join(__dirname, "../uploads", department, filename);

    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await fileDb.query(
            `DELETE FROM file_metadata.uploaded_files 
            WHERE filename = ? AND department = ?`,
            [filename, department]
        );

        res.json({ message: "File deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Failed to delete file" });
    }
});

module.exports = router;