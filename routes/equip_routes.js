const express = require('express');
const router = express.Router();
const equip_controller = require('../controllers/equip_controller');

router.post('/', equip_controller.InsertEquip);
router.get('/', equip_controller.GetAllEquip);
router.get('/:numero_serie', equip_controller.GetEquipBySerial);
router.put('/:numero_serie', equip_controller.UpdateEquip);
router.delete('/:numero_serie', equip_controller.DeleteEquip);

module.exports = router;