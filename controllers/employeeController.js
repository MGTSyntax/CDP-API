const employeeService = require('../services/employeeService');

exports.getUserInfo = async (req, res) => {
    const { db, empNo } = req.query;

    if (!db || !empNo) {
        return res.status(400).json({ error: 'Database and employee number are required.' });
    }

    try {
        const userInfo = await employeeService.getUserInfo(req.db, db, empNo);

        if (userInfo) {
            res.json(userInfo);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (err) {
        console.error('Error in getUserInfo:', err.message);
        res.status(500).json({ error: err.message });
    } finally {
        await req.db.close();
    }
};

exports.getEmployees = async (req, res) => {
    const dbName = req.query.db;

    if (!dbName) {
        return res.status(400).json({ error: 'Database name is required.' });
    }

    try {
        const employees = await employeeService.getEmployees(req.db, dbName);
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await req.db.close();
    }
};