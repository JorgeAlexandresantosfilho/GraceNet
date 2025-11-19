const express = require('express');
const router = express.Router();
const tecnicos_controller = require('../controllers/tecnicos_controller');

router.post('/', tecnicos_controller.InsertTecnico);
router.get('/', tecnicos_controller.GetAllTecnicos);
router.get('/:id', tecnicos_controller.GetTecnicoById);
router.put('/:id', tecnicos_controller.UpdateTecnico);
router.delete('/:id', tecnicos_controller.DeleteTecnico);

module.exports = router;
