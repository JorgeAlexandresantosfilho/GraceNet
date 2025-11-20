const express = require('express');
const router = express.Router();
const ClientPortal_controller = require('../controllers/ClientPortal_controller');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'seusecret';


const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Nenhum token fornecido.' });

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Falha ao autenticar token.' });
        req.user = decoded;
        next();
    });
};

router.post('/login', ClientPortal_controller.Login);
router.post('/activate', ClientPortal_controller.ActivateAccount);
router.post('/register', ClientPortal_controller.RegisterNewClient);
router.get('/dashboard', verifyToken, ClientPortal_controller.GetDashboardData);

module.exports = router;
