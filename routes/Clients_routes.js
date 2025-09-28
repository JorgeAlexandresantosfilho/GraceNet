const express = require('express');
const router = express.Router();
const Clients_controller = require('../controllers/Clients_controller');

router.post('/', Clients_controller.CreateCustomer);
router.get('/', Clients_controller.GetCustomers);
router.get('/:id', Clients_controller.SearchCustomerById);
router.put('/:id', Clients_controller.UpdateCustomer);
router.delete('/:id', Clients_controller.DeleteCustomer);

module.exports = router;
