// /routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { fetchEmployeeProfile } = require('../controllers/profileController');

router.get('/user-info', employeeController.getUserInfo);
router.get('/employees', employeeController.getEmployees);
router.get('/employee-profile', fetchEmployeeProfile);

module.exports = router;