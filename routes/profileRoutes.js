// /routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { fetchEmployeeProfile } = require('../controllers/profileController');

router.get('/employee-profile', fetchEmployeeProfile);

module.exports = router;