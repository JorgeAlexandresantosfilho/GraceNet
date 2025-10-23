const express = require('express');
const router = express.Router();
const pop_controller = require('../controllers/pop_controller');

router.post('/', pop_controller.InsertPop);
router.get('/:serial', pop_controller.GetPopBySerial);
router.put('/:serial', pop_controller.UpdatePop);
router.get('/', pop_controller.GetAllPop);
//retirada rota delete

module.exports = router;