// /routes/departmentFolderRoutes.js
const express = require('express');
const router = express.Router();

const dbName = "file_metadata";

// Get all department Folders
router.get("/department-folders", async (req, res) => {
    try {
        const rows = await req.db.query(`SELECT id AS deptid, deptname FROM ${dbName}.departments ORDER BY deptname`);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching departments:", err);
        res.status(500).json({ error: "Failed to fetch departments" });
    }
});

// Get categories by department Folder
router.get("/categories/:deptId", async (req, res) => {
    try {
        const rows = await req.db.query(`SELECT id AS catid, department_id, catname FROM ${dbName}.categories where department_id = ? ORDER BY catname`,
            [req.params.deptId]
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

module.exports = router;