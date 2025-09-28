<<<<<<< HEAD
const express =  require('express');
const router = express.Router();
const { ExportClients } = require('../controllers/exports_controller');


router.get("/export/clients", ExportClients);


=======
const express =  require('express');
const router = express.Router();
const { ExportClients } = require('../controllers/exports_controller');


router.get("/export/clients", ExportClients);


>>>>>>> eb502bf00be535d061ae0d80bd7706d57f4f4bb4
module.exports = router;