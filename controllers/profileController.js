const { getEmployeeProfile } = require('../services/profileService');

const fetchEmployeeProfile = async (req, res) => {
    const { empNo } = req.query;

    if (!empNo) {
        return res.status(400).json({ error: 'Database and employee number are required.' });
    }

    try {
        const profile = await getEmployeeProfile(req.db, empNo);
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await req.db.close();
    }
};

module.exports = { fetchEmployeeProfile };