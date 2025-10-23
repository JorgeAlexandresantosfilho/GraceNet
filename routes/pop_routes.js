const express = require('express');
const router = express.Router();
const pop_controller = require('../controllers/pop_controller');


router.post('/', pop_controller.InsertPop);
router.get('/', pop_controller.GetAllPop);
router.get('/:id_torre', pop_controller.GetPopById);
router.put('/:id_torre', pop_controller.UpdatePop);

module.exports = router;
