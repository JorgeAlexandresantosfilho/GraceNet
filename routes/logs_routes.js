const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logs_controller');

router.get('/', logsController.GetAllLogs);

module.exports = router;
