const express =  require('express');
const router = express.Router();
const { ExportClients } = require('../controllers/exports_controller');


router.get("/export/clients", ExportClients);


module.exports = router;