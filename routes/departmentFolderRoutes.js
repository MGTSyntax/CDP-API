// /routes/departmentFolderRoutes.js
const express = require('express');
const router = express.Router();

// Get all department Folders
router.get("/department-folders", async (req, res) => {
    try {
        const rows = await req.mainDb.query(`SELECT id AS deptid, deptname FROM departments ORDER BY deptname`);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching departments:", err);
        res.status(500).json({ error: "Failed to fetch departments" });
    }
});

// Get categories by department Folder
router.get("/categories/:deptId", async (req, res) => {
    try {
        const rows = await req.mainDb.query(`SELECT id AS catid, department_id, catname FROM categories where department_id = ? ORDER BY catname`,
            [req.params.deptId]
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

module.exports = router;