const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');

//POST /auth/register
router.post('/register', user_controller.RegisterUser);

//POST /auth/login
router.post('/login', user_controller.LoginUser);

module.exports = router;