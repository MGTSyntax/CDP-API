const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/user-info', employeeController.getUserInfo);
router.get('/employees', employeeController.getEmployees);

module.exports = router;