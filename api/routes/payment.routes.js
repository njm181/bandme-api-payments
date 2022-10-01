const { Router } = require('express');
const { check } = require('express-validator');
const { createCheckoutController } = require('../controller/payment.controller');

const router = Router();


router.post('/checkout', createCheckoutController);

router.get('/prueba', function(req, res) {
    res.send('Ruta de prueba')
})


module.exports = router;