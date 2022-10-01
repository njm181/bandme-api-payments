const { Router } = require('express');
const { check } = require('express-validator');
const { createCheckoutController } = require('../controller/payment.controller');
const logger = require('heroku-logger')


const router = Router();


router.post('/checkout', createCheckoutController);

router.post('/prueba', function(req, res) {
    logger.info('LOG PROPIOOOOOOOOOooooooooooooooooooooooo')
    res.send('Ruta de prueba: ');
})


module.exports = router;