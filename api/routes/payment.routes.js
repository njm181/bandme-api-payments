const { Router } = require('express');
const { check } = require('express-validator');
const { createCheckoutController } = require('../controller/payment.controller');
const logger = require('heroku-logger')


const router = Router();


router.post('/checkout', createCheckoutController);

router.post('/checkout-payment-data', function(req, res) {
    logger.info('LOG PROPIOOOOOOOOOooooooooooooooooooooooo: '+ JSON.stringify(req.body.resource));
    logger.info('LOG PROPIOOOOOOOOO 22222222: '+ req.body.resource);
    res.send('Ruta de prueba: ');
})


module.exports = router;