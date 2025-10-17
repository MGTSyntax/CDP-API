// /controllers.authController.js
const authService = require('../services/authService');
const { getUserRoleAndPermissions } = require('../services/userRoleService');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // mainDb is always connected to file_metadata
        const user = await authService.login(req.mainDb, username, password);

        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const roleData = await getUserRoleAndPermissions(req.mainDb, username);

        res.json({
            success: true,
            message: 'Login successful',
            loginid: user.loginid,
            username: user.username,
            empNo: user.empno,
            userLevel: user.role_id,
            company_id: user.company_id,
            role: roleData?.role || null,
            permissions: roleData?.permissions || []
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};