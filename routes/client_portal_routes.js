const express = require('express');
const router = express.Router();
const ClientPortal_controller = require('../controllers/ClientPortal_controller');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/login', ClientPortal_controller.Login);
router.post('/activate', ClientPortal_controller.ActivateAccount);
router.post('/register', ClientPortal_controller.RegisterNewClient);
router.get('/dashboard', verifyToken, ClientPortal_controller.GetDashboardData);
router.get('/invoices', verifyToken, ClientPortal_controller.GetClientInvoices);

module.exports = router;
