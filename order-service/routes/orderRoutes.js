const express = require('express');
const orderController = require('../controller/orderController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new order (requires auth)
router.post('/', protect, orderController.placeOrder);


module.exports = router;