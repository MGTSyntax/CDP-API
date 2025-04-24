const express = require('express');
const router = express.Router;
const { fetchEmployeeProfile } = require('../controllers/employeeController');

router.get('/employee-profile', fetchEmployeeProfile);

module.exports = router;