const express = require('express');
const router = express.Router();
const equipmov_controller = require('../controllers/equipmov_controller');

router.post('/', equipmov_controller.AddEquipMov);
router.get('/', equipmov_controller.GetAllEquipMov);
router.get('/:id', equipmov_controller.GetEquipMovById);
router.put('/:id', equipmov_controller.UpdateEquipMov);
router.delete('/:id', equipmov_controller.DeleteEquipMov);

module.exports = router;    