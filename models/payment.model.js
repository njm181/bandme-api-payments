const { Schema, model, mongoose } = require('mongoose');

const PaymentSchema = Schema({
    app_email_user: {
        type: String
    },
    app_user_id: {
        type: String
    },
    pref_date_created: {
        type: String
    },
    pref_id: {
        type: String
    },
    payment_id: {
        type: Number
    },
    payment_date_created: {
        type: String
    },
    payment_date_approved: {
        type: String
    },
    payer_id: {
        type: Number
    },
    payer_email: {
        type: String
    },
    transaction_amount: {
        type: Number
    },
    status: {
        type: String
    },
    order_id: {
        type: String
    },
    reason: {
        type: String
    },
    unit_price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    fecha_compra: {
        type: String
    }
});

const Payment = model('Payment', PaymentSchema);

module.exports = Payment;