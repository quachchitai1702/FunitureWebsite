import cartService from '../services/cartService';
const { uploadSingleImage } = require('../config/multerConfig');


const handleCreateCart = async (req, res) => {
    try {
        const { customerId, total } = req.body;
        const response = await cartService.createCart(customerId, total);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: 5,
            errMessage: `Internal error: ${error.message}`
        });
    }
};

const handleGetCartByCustomerId = async (req, res) => {
    try {
        const { customerId } = req.query;
        // console.log('Received customerId:', customerId);  // Log giá trị customerId

        const response = await cartService.getCartByCustomerId(customerId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: 5,
            errMessage: `Internal error: ${error.message}`
        });
    }
};

const handleDeleteCart = async (req, res) => {
    try {
        const { cartId } = req.body;
        const response = await cartService.deleteCart(cartId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: 5,
            errMessage: `Internal error: ${error.message}`
        });
    }
};

const handleAddProductToCart = async (req, res) => {
    try {
        const { customerId, productId, quantity } = req.body;
        const response = await cartService.addProductToCart(customerId, productId, quantity);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: 5,
            errMessage: `Internal error: ${error.message}`
        });
    }
};


const handleUpdateCartDetail = async (req, res) => {
    try {
        const { cartDetailId, newQuantity } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!cartDetailId || !newQuantity || isNaN(newQuantity)) {
            return res.status(400).json({
                errCode: 6,
                errMessage: "Invalid input: cartDetailId and quantity must be provided and valid."
            });
        }

        const response = await cartService.updateCartDetail(cartDetailId, newQuantity);

        if (response.errCode !== 0) {
            return res.status(400).json(response);
        }

        return res.status(200).json(response);

    } catch (error) {
        console.error("Error in handleUpdateCartDetail:", error);
        return res.status(500).json({
            errCode: 5,
            errMessage: `Internal server error: ${error.message}`
        });
    }
};


const handleRemoveProductFromCart = async (req, res) => {
    try {

        const { cartDetailId } = req.query;
        console.log('id to remove', cartDetailId)
        const response = await cartService.removeProductFromCart(cartDetailId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: 5,
            errMessage: `Internal error: ${error.message}`
        });
    }
};

module.exports = {
    handleCreateCart,
    handleGetCartByCustomerId,
    handleDeleteCart,
    handleAddProductToCart,
    handleUpdateCartDetail,
    handleRemoveProductFromCart
};