const express = require('express');
const router = express.Router();
const os_controller = require('../controllers/os_controllers');

router.post('/', os_controller.OsAdd);
router.get('/:codigo_os', os_controller.GetOS); 
router.get('/', os_controller.GetAllOS);
router.put('/', os_controller.UpdateOS);

module.exports = router;
