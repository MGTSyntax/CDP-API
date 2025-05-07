const authService = require('../services/authService');

exports.login = async (req, res) => {
    const { database, username, password } = req.body;

    if (!database || !username || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const user = await authService.login(req.db, database, username, password);

        if (user) {
            res.json({
                success: true,
                message: 'Login successful',
                empNo: user.cdpempno,
                userLevel: user.cdpuserlevel
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid cerdentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error during login' });
    } finally {
        await req.db.close();
    }
};