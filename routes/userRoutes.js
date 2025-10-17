// /routes/userRoutes.js
const express = require('express');
const router = express.Router();
const dbMiddleware = require('../middleware/dbmiddleware');
const { getUserRoleAndPermissions } = require('../services/userRoleService');

// GET /user/permissions/:username
router.get('/permissions/:username', dbMiddleware, async (req, res) => {
    const { username } = req.params;
    const db = req.db;

    try {
        const data = await getUserRoleAndPermissions(db, username);
        if (!data) return res.status(404).json({ message: 'User not found' });

        res.json(data);
    } catch (err) {
        console.error('Error fetching permissions:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;