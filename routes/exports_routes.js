const express =  require('express');
const router = express.Router();
const { 
    ExportClients,
    ExportFinancials,       
    ExportNetworkPerformance, 
    ExportBusinessGrowth    
} = require('../controllers/exports_controller');


router.get("/export/clients", ExportClients);
router.get("/export/financials", ExportFinancials);         
router.get("/export/network", ExportNetworkPerformance);   
router.get("/export/growth", ExportBusinessGrowth);      

module.exports = router;