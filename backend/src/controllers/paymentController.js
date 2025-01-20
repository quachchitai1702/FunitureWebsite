import paymentService from '../services/paymentService';
const { uploadSingleImage } = require('../config/upload.js');


const handleCreatePaymentMethod = async (req, res) => {
    const { customerId, cardNumber, cardholderName, expiryDate } = req.body;

    try {
        const result = await paymentMethodService.createPaymentMethod(customerId, cardNumber, cardholderName, expiryDate);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const handleGetPaymentMethods = async (req, res) => {
    const { paymentMethodId } = req.body;

    try {
        const result = await paymentMethodService.getPaymentMethods(paymentMethodId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const handleDeletePaymentMethod = async (req, res) => {
    const { paymentMethodId } = req.body;

    try {
        const result = await paymentMethodService.deletePaymentMethod(paymentMethodId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = {
    handleCreatePaymentMethod,
    handleGetPaymentMethods,
    handleDeletePaymentMethod,
};