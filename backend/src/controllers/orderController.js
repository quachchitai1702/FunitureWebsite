import orderService from '../services/orderService';
const { uploadSingleImage } = require('../config/multerConfig');


const handleCreateOrder = async (req, res) => {
    const { customerId, paymentMethod } = req.body;
    // console.log("Request received:", req.body);

    try {
        const result = await orderService.createOrder(customerId, paymentMethod);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            errCode: error.errCode || 1,
            errMessage: error.errMessage || "An error occurred!",
        });
    }
};

const handleGetOrderByCustomerIdStatus = async (req, res) => {
    const { customerId, status } = req.query;

    try {
        const result = await orderService.getOrderByCustomerIdStatus(customerId, status);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const handleUpdateOrderStatus = async (req, res) => {
    const { orderId, newStatus } = req.body;

    if (!orderId || !newStatus) {
        return res.status(400).json({
            errCode: 2,
            errMessage: "Order ID and new status are required!",
        });
    }

    try {
        const result = await orderService.updateOrderStatus(orderId, newStatus);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            errCode: error.errCode || 1,
            errMessage: error.errMessage || "An error occurred!",
        });
    }
};



//customer
const handleDeleteOrder = async (req, res) => {
    const { orderId } = req.query;

    try {
        const result = await orderService.deleteOrder(orderId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json(error);
    }
};

module.exports = {
    handleCreateOrder,
    handleGetOrderByCustomerIdStatus,
    handleUpdateOrderStatus,
    handleDeleteOrder,
};