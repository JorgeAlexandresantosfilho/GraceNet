const express = require('express');
const router = express.Router();
const Dashboard_controller = require('../controllers/Dashboard_controller');

router.get('/', Dashboard_controller.getDashboardStats);

module.exports = router;
