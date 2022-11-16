const axios = require('axios').default;
const mercadopago = require ('mercadopago');
const Payment = require('../models/payment.model');
const User = require('../models/user.model');
const moment = require('moment');
const Suscripcion = require('../models/suscripcion.model');

class PaymentService {
    constructor(){}

    async decodeToken(userToken){
        try{
            const {data:response} = await axios.post('https://bandme-login-api.herokuapp.com/api/v1/login/validate/user-identity', {
            token:userToken
        });
            return response;
        }catch(error){
            console.log("Error catch: " + error);
        }
    }

    async getSuscriptionData(){
        let responseData = {
            isExist: false,
            suscription: null,
            message: ''
        }
        try{
            const idSuscripcion = '63754d712a5d66ab9dbfe230';
            const suscriptionResult = await Suscripcion.findById(idSuscripcion);
            console.log("datos de la suscripcion ==> ", suscriptionResult);
            responseData = {
                isExist: true,
                suscription: suscriptionResult,
                message: "Datos de la suscripción obtenidos exitosamente"
            }
        }catch(error){
            console.log("Error al buscar los datos de la suscripcion: ", error);
            responseData = {
                isExist: false,
                suscription: null,
                message: 'No pudimos obtener los datos de la suscripción, intente más tarde por favor'
            }
        }
        return responseData;
    }
    
    async createCheckout(userId, payload){
        let mercadoPagoResponse = {
            isSuccess: false,
            data: null,
            message: ''
        }
        let savePreferenceCreated;

        const userProfileDb = await User.findById(userId);
        const { isPremium } = userProfileDb;

        if(!isPremium){
            mercadopago.configure({
                access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN 
                });
                let preference = {
                    items: [
                        {
                            title: payload.data.title,
                            unit_price: payload.data.unit_price,
                            quantity: payload.data.quantity
                        }
                    ],
                    "payer": {
                        "email": payload.user_email
                    }
                };
                const year = moment().get('year');
                const month = moment().get('month') + 1;  // 0 to 11
                const day = moment().get('date');
                const fechaActualParseada = day+"/"+month+"/"+year;
            
                await mercadopago.preferences.create(preference)
                .then(function(response){                    
                    savePreferenceCreated = new Payment({
                        app_email_user: response.body.payer.email,
                        app_user_id: userId,
                        pref_date_created: response.body.date_created,
                        pref_id: response.body.id,
                        fecha_compra: fechaActualParseada
                    });
        
                    mercadoPagoResponse = {
                        isSuccess: true,
                        data: response.body.init_point,
                        message: "Operación exitosa"
                    }
                }).catch(function(error){
                    console.log(error);
                    mercadoPagoResponse = {
                        isSuccess: false,
                        data: "",
                        message: "Operación fallida"
                    }
                });
                const prefCreated = await savePreferenceCreated.save();
        } else {
            mercadoPagoResponse = {
                isSuccess: false,
                data: "",
                message: "El usuario ya es premium"
            }
        }
        
        return mercadoPagoResponse;
    }

    async verifyPaymentData(resource){
        let response = {
            isSuccess: false,
            data: null,
            message: ''
        }
        try{
            const data = await this.getPaymentDone(resource);
            let document = await Payment.findOneAndUpdate({pref_id: data.preference_id}, data);
            document = await Payment.findOne({pref_id:data.preference_id});
            let userToUpdate = await User.findByIdAndUpdate({_id: document.app_user_id},{isPremium: true});
            userToUpdate = await User.findOne({_id:document.app_user_id});

            const paymentUserData = {
                user_updated: userToUpdate,
                payment_data: document
            }

            response = {
                isSuccess: true,
                data: paymentUserData,
                message: 'Registro y actualización del pago exitoso'
            }

        }catch(error){
            console.log("Error al buscar el pago y actulizarlo: " + error);
            response = {
                isSuccess: false,
                data: null,
                message: 'Error al verificar los datos del pago'
            }
        }
        return response;
    }

    async getPaymentDone(resource){
        try{
            const {data:response} = await axios.get(resource, {
                headers: {
                    'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`
                }
            });
            
            const orderData = await this.getPaymentOrder(response.collection.order_id);
            let paymentData = {
                payment_id: response.collection.id,
                date_created: response.collection.date_created,
                date_approved: response.collection.date_approved,
                payer_id: response.collection.payer.id,
                payer_email: response.collection.payer.email,
                transaction_amount: response.collection.transaction_amount,
                status: response.collection.status,
                order_id: response.collection.order_id,
                reason: response.collection.reason,
                preference_id: orderData.preference_id,
                quantity: orderData.quantity,
                unit_price: orderData.unit_price,
                payment_date_created: response.date_created,
                payment_date_approved: response.date_approved
            };
            return paymentData;
        }catch(error){
            console.log("Error al consultar el pago realizado: " + error);
        }
    }

    async getPaymentOrder(orderId){
        try{
            const {data:response} = await axios.get(`https://api.mercadopago.com/merchant_orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`
                }
            });
            const orderData = {
                preference_id: response.preference_id,
                quantity: response.items[0].quantity,
                unit_price: response.items[0].unit_price
            }
            return orderData;
        }catch(error){
            console.log("Error al consultar la orden del pago realizado: " + error);
        }
    }
}

module.exports = new PaymentService();