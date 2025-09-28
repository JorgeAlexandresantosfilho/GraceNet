<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const plans_controller = require('../controllers/plans_controller');

router.post('/', plans_controller.planInsert);
router.get('/', plans_controller.getAllPlan);
router.get('/name/:nome_plano', plans_controller.GetPlanName);
router.put('/:id', plans_controller.UpdtPlan);
router.delete('/:id', plans_controller.DeletePlan);

=======
const express = require('express');
const router = express.Router();
const plans_controller = require('../controllers/plans_controller');

router.post('/', plans_controller.planInsert);
router.get('/', plans_controller.getAllPlan);
router.get('/name/:nome_plano', plans_controller.GetPlanName);
router.put('/:id', plans_controller.UpdtPlan);
router.delete('/:id', plans_controller.DeletePlan);

>>>>>>> eb502bf00be535d061ae0d80bd7706d57f4f4bb4
module.exports = router;