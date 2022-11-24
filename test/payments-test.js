//const expect = require ('chai');
const expect = require('chai').expect
const {connectDB} = require('../loaders/db');
const Server = require('../loaders/Server');
const paymentService = require("../services/payment.service");


describe('getSuscriptionData success', () => {
    it("get Suscription Data success", async () => {
        const server = new Server();
        server.listen();
        const result = await paymentService.getSuscriptionData()
        expect(result.isExist).to.equal(true)
    })
});

describe('createCheckout success', () => {
    it("create Checkout success", async () => {
        const payload = {
            title: "titulo de test unitario",
            unit_price: 1,
            quantity: 1,
            email: "bandme.testunitario@gmail.com"
        }
        const result = await paymentService.createCheckout("637bd50e94e9403ab5a0d6b6", payload)
        expect(result.data).to.not.equal(null)
    })
});

describe('create Checkout error', () => {
    it("create Checkout error", async () => {
        const payload = {
            title: "titulo de test unitario",
            unit_price: 1,
            quantity: 1,
            email: "bandme.testunitario@gmail.com"
        }
        const result = await paymentService.createCheckout("637bd50e94e9403ab5a0d6b6")
        expect(result.isSuccess).to.equal(false)
    })
});


describe('getPaymentOrder success', () => {
    it("getPaymentOrder success", async () => {
        const result = await paymentService.getPaymentOrder("6574735609")
        expect(result.preference_id).to.not.equal(null)
    })
});


describe('getPaymentOrder error', () => {
    it("getPaymentOrder error", async () => {
        const result = await paymentService.getPaymentOrder("")
        expect(result).to.equal(null)
    })
});
