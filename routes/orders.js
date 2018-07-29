//TODO add swagger api docs
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/:id', catchErrors(orderController.getOrderById));

//TODO make order status enum
router.patch('/:id', catchErrors(orderController.updateOrder));

router.delete('/:id', catchErrors(orderController.deleteOrder));

router.get('/', catchErrors(orderController.getOrders));

router.post('/',
  catchErrors(orderController.validateOrder),
  catchErrors(orderController.createOrder)
);

module.exports = router;
