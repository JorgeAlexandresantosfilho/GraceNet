const express = require('express');
const router = express.Router();
const os_controller = require('../controllers/os_controllers');

router.post('/', os_controller.OsAdd);
router.get('/:os_id', os_controller.GetOS); 

module.exports = router;
