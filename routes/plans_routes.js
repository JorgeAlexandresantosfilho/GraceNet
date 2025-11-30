const express = require('express');
const router = express.Router();
const plans_controller = require('../controllers/plans_controller');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, checkRole([1]), plans_controller.planInsert);
router.get('/', verifyToken, checkRole([1]), plans_controller.getAllPlan);
router.get('/name/:nome_plano', verifyToken, checkRole([1]), plans_controller.GetPlanName);
router.put('/:id', verifyToken, checkRole([1]), plans_controller.UpdtPlan);
router.delete('/:id', verifyToken, checkRole([1]), plans_controller.DeletePlan);

module.exports = router;