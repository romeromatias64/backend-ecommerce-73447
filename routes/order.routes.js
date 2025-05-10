const router = require('express').Router();
const orderController = require('../controllers/order.controller');
const { isAuth } = require('../middlewares/isAuth');

router.post('/orders', [ isAuth ], orderController.createOrder); // Crear una nueva orden

router.get('/orders', [ isAuth ], orderController.getOrders); // Obtener las ordenes

module.exports = router;