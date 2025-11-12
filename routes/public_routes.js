const express = require('express');
const router = express.Router();
const public_controller = require('../controllers/public_controller');


router.post('/ticket', public_controller.OpenPublicTicket);

module.exports = router;