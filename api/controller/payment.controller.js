const { response } = require("express");
const paymentService = require("../../services/payment.service");

const createCheckoutController = async(req, res = response) => {
    const token = req.headers['auth-token'];
    const { payload } = req.body;
    
    if(token != undefined){
        try{
        const {uid} = await paymentService.decodeToken(token);
        if(uid != '' && uid != undefined && uid != null){
        const mercadoPagoCheckout = await paymentService.createCheckout(uid, payload);
        let response;
        if(mercadoPagoCheckout.isSuccess){
            response = res.status(200).json({
                isSuccess: mercadoPagoCheckout.isSuccess,
                mercado_pago_data: mercadoPagoCheckout.data,
                message: mercadoPagoCheckout.message
            });
        }else{
            response = res.status(200).json({
                isSuccess: mercadoPagoCheckout.isSuccess,
                mercado_pago_data: mercadoPagoCheckout.data,
                message: mercadoPagoCheckout.message
            });
        }
    }else{
        console.log('No se pudo autenticar la identidad por que el token es incorrecto ');
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
    } catch(error){
        console.log('No se pudo autenticar la identidad: ', error);
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }

    }else{
        return res.status(400).json({
            message: 'Error request by bad token'
        });
    } 
}


const checkoutPaymentDataController = async(req, res = response) => {
    const { resource } = req.body;
    try{
        const paymentData = await paymentService.verifyPaymentData(resource);
        if(paymentData.isSuccess){
            res.status(200).json({
                isSuccess: paymentData.isSuccess,
                data: paymentData.data,
                message: paymentData.message
            });
        }else{
            res.status(200).json({
                isSuccess: paymentData.isSuccess,
                data: paymentData.data,
                message: paymentData.message``
            });
        }
    } catch(error){
        console.log('No se pudo autenticar la identidad: ', error);
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
}



module.exports = {
    createCheckoutController,
    checkoutPaymentDataController
}