const express = require('express');
const router = express.Router();
const tecnicos_controller = require('../controllers/tecnicos_controller');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, checkRole([1]), tecnicos_controller.InsertTecnico);
router.get('/', verifyToken, checkRole([1]), tecnicos_controller.GetAllTecnicos);
router.get('/:id', verifyToken, checkRole([1]), tecnicos_controller.GetTecnicoById);
router.put('/:id', verifyToken, checkRole([1]), tecnicos_controller.UpdateTecnico);
router.delete('/:id', verifyToken, checkRole([1]), tecnicos_controller.DeleteTecnico);

module.exports = router;
