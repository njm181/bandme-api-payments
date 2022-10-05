const { Router } = require('express');
const { check } = require('express-validator');
const { createCheckoutController, checkoutPaymentDataController } = require('../controller/payment.controller');
const logger = require('heroku-logger')


const router = Router();

router.get('/', function(req, res){
    console.log(new Date().toLocaleString())
    res.send('date')
})

router.post('/checkout', createCheckoutController);

router.post('/checkout-payment-data', checkoutPaymentDataController)


module.exports = router;