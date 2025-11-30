const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');
const { verifyToken, checkRole, checkSameUserOrRole } = require('../middleware/authMiddleware');

// Public route (Login & Register)
router.post('/login', user_controller.LoginUser);
router.post('/register', user_controller.RegisterUser);
router.post('/change-password', verifyToken, user_controller.ChangePassword); // Any authenticated user

router.get('/users', verifyToken, checkRole([1]), user_controller.GetAllUsers); // Admin only
router.get('/admin/users', verifyToken, checkRole([1]), user_controller.GetAllUsersForAdmin); // Admin only
router.get('/users/:id', verifyToken, checkSameUserOrRole([1]), user_controller.GetUserById); // Admin or Self

router.put('/users/:id', verifyToken, checkSameUserOrRole([1]), user_controller.UpdateUser); // Admin or Self

router.delete('/users/:id', verifyToken, checkRole([1]), user_controller.DeleteUser); // Admin only

module.exports = router;
