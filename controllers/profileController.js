// /controllers/profileController.js
const { getEmployeeProfile } = require('../services/profileService');

const fetchEmployeeProfile = async (req, res) => {
    const { db: database, empNo } = req.query;

    if (!database || !empNo) return res.status(400).json({ error: 'Database and employee number are required.' });
    if (!req.branchDb) return res.status(400).json({ error: `No branch database connection for ${database}` });

    try {
        const profile = await getEmployeeProfile(req.branchDb, empNo);
        if (!profile || Object.keys(profile).length === 0) return res.status(400).json({ error: 'No profile found'});
        res.json(profile);

    } catch (err) {
        console.error('Error in fetchEmployeeProfile:', err.message);
        res.status(500).json({ error: 'Failed to fetch employee profile.'});
    }
};

module.exports = { fetchEmployeeProfile };