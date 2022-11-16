const { Router } = require('express');
const { check } = require('express-validator');
const { createCheckoutController, checkoutPaymentDataController, getSuscriptionDataController } = require('../controller/payment.controller');
const logger = require('heroku-logger');

const router = Router();

router.post('/checkout', createCheckoutController);

router.post('/checkout-payment-data', checkoutPaymentDataController);

router.post('/get-suscripcion-data', getSuscriptionDataController);


module.exports = router;