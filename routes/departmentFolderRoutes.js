// /routes/departmentFolderRoutes.js
const express = require('express');
const router = express.Router();

// Get all department Folders
router.get("/department-folders", async (req, res) => {
    try {
        const userRole = Number(req.query.userLevel);

        if  (!userRole) return res.status(400).json({ error: "Missing user role" });

        let rows = [];
        
        // Admin role === 1
        if (userRole === 1) {
            rows = await req.mainDb.query(`
                SELECT id AS deptid, deptname 
                FROM departments 
                ORDER BY deptname
            `);
        } else {
            rows = await req.mainDb.query(`
                SELECT DISTINCT d.id AS deptid, d.deptname
                FROM departments d
                JOIN categories c ON c.department_id = d.id
                JOIN category_permissions cp ON cp.category_id = c.id
                WHERE cp.role_id = ?
                ORDER BY d.deptname
            `, [userRole]);
        }

        res.json(rows);

    } catch (err) {
        console.error("Error fetching departments:", err);
        res.status(500).json({ error: "Failed to fetch departments" });
    }
});

// Get categories by department Folder
router.get("/categories/:deptId", async (req, res) => {
    try {
        const userRole = Number(req.query.userLevel);
        const deptId = Number(req.params.deptId);

        if (!userRole) return res.status(400).json({ error: "Missing user role" });

        let rows = [];

        if (userRole === 1) {
            rows = await req.mainDb.query(`
                SELECT id AS catid, catname
                FROM categories
                WHERE department_id = ?
                ORDER BY catname
            `, [deptId]);
        } else {
            rows = await req.mainDb.query(`
                SELECT DISTINCT c.id AS catid, c.catname
                FROM categories c
                JOIN category_permissions cp ON cp.category_id = c.id
                WHERE c.department_id = ?
                AND cp.role_id = ?
                ORDER BY c.catname
            `, [deptId, userRole]);
        }

        res.json(rows);

    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

module.exports = router;