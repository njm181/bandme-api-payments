const { Schema, model, mongoose } = require('mongoose');

const SuscripcionSchema = Schema({
    unit_price: {
        type: String
    },
    quantity: {
        type: String
    },
    title: {
        type: String
    }
});

const Suscripcion = model('Suscripcion', SuscripcionSchema);

module.exports = Suscripcion;