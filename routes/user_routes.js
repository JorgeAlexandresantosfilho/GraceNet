const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');


router.post('/register', user_controller.RegisterUser);


router.post('/login', user_controller.LoginUser);


router.get('/users', user_controller.GetAllUsers);

module.exports = router;