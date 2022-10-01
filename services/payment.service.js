const axios = require('axios').default;
// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

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

    
    async createCheckout(userId, payload){
        console.log("USER ID OBTENIDO --> " + userId);
        //genero la transaccion
        //si es exitosa busco en la base de datos el user id y actualizo su estado a isPremium=true
        //genero un nuevo documento que asocie el id del usuario a la transaccion con fecha, hora, monto y fecha de vencimiento que es un año despues de la fecha de compra, tambien que tenga el status vigente o expirado
        //entonces cada vez que se inicie sesion se comprueba la fecha de vencimiento, si ya expiro entonces el estado se cambia a isPremium=false cuando se hace el login
        //cuando se hace una nueva compra se genera un nuevo documento con un status nuevo vigente
        //se asocia al id del usuario al id del ultimo documento de compra generado, entonces si el usuario hizo una compra y ya tenia otras previas cuando se busque en ese documento de compras el id de usuario va a traer todos los registros de compra, ahi filtramos por status vigente o distinto de expirado y obtenemos el ultimo creado
        //obtengo respuesta, si es exitosa mando ini_point al front

        let mercadoPagoResponse = {
            isSuccess: false,
            data: null,
            message: ''
        }

        // Agrega credenciales
        mercadopago.configure({
        access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN //--> Quien es el vendedor, a que cuenta va la tarazca
        });
        console.log("DATOS DE LA COMPRA ----> " + JSON.stringify(payload));
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
        
        await mercadopago.preferences.create(preference)
        .then(function(response){
            //respuesta de nuestro servidor
            //respuesta al front init_point
            //id de la preferencia creada
            console.log('RESPUESTA DE MERCADO PAGO: '+ JSON.stringify(response.body, null, "  ")); 
            mercadoPagoResponse = {
                isSuccess: true,
                data: response.body,
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
        return mercadoPagoResponse;
    }

}

module.exports = new PaymentService();