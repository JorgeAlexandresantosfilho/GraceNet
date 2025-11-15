const express = require('express');
const router = express.Router();
const perfil_controller = require('../controllers/perfil_controller');

router.get('/', perfil_controller.GetAllPerfis);

module.exports = router;