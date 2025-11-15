const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');

router.post('/register', user_controller.RegisterUser);
router.post('/login', user_controller.LoginUser);

router.post('/change-password', user_controller.ChangePassword);

router.get('/users', user_controller.GetAllUsers);
router.get('/admin/users', user_controller.GetAllUsersForAdmin);
router.get('/users/:id', user_controller.GetUserById);

router.put('/users/:id', user_controller.UpdateUser);

router.delete('/users/:id', user_controller.DeleteUser);

module.exports = router;
