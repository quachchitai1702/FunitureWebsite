import productService from '../services/productService';
const { uploadSingleImage } = require('../config/upload.js');


const handleCreateProduct = async (req, res) => {
    try {
        const response = await productService.createProduct(req.body);
        if (response.errCode !== 0) {
            return res.status(400).json(response);
        }
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: 5,
            errMessage: 'Internal server error',
        });
    }
};

const handleGetAllProducts = async (req, res) => {
    try {
        const { id, status, searchQuery } = req.query; // Lấy từ query params
        const response = await productService.getAllProducts(id, status, searchQuery);

        if (response.errCode !== 0) {
            return res.status(500).json(response); // Trả lỗi nếu không thành công
        }
        return res.status(200).json(response); // Trả kết quả nếu thành công
    } catch (error) {
        return res.status(500).json({
            errCode: 5,
            errMessage: 'Internal server error',
        });
    }
};


const handleUpdateProduct = async (req, res) => {
    try {
        console.log('Received update request from frontend:', req.body);

        const response = await productService.updateProduct(req.body);

        if (response.errCode !== 0) {
            console.error('Error response from service:', response);
            return res.status(400).json(response);
        }

        console.log("Response to frontend:", response);
        return res.status(200).json(response);

    } catch (error) {
        console.error('Error in handleUpdateProduct:', error);
        return res.status(500).json({
            errCode: 5,
            errMessage: `Internal server error: ${error.message}`
        });
    }
};




const handleDeleteProduct = async (req, res) => {
    try {
        let data = req.body;
        const response = await productService.deleteProduct(data);
        if (response.errCode !== 0) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: 5,
            errMessage: 'Internal server error',
        });
    }
};

module.exports = {
    handleCreateProduct,
    handleGetAllProducts,
    handleUpdateProduct,
    handleDeleteProduct,
};
