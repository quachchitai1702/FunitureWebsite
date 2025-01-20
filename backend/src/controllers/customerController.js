import customerService from '../services/customerService';
const { uploadSingleImage } = require('../config/upload.js');


let handleLogin = async (req, res) => {
    console.log('Request body:', req.body);  // In toàn bộ req.body để kiểm tra
    let email = req.body.email;
    console.log('email:' + email);
    let password = req.body.password;
    console.log('password:' + password);


    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing input parameter!',
        })
    }

    let customerData = await customerService.handleCustomerLogin(email, password);

    return res.status(200).json({
        errCode: customerData.errCode,
        errMessage: customerData.errMessage,
        customer: customerData.customer ? customerData.customer : {}
    })
}

let handleGetAllCustomer = async (req, res) => {
    let { id, status, searchQuery } = req.query;

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters (id)',
            customers: []
        });
    }

    try {
        let customers = await customerService.getAllCustomer(id, status, searchQuery);

        if (!customers || (Array.isArray(customers) && customers.length === 0)) {
            return res.status(404).json({
                errCode: 1,
                errMessage: 'Customer not found!',
                customers: []
            });
        }

        return res.status(200).json({
            errCode: 0,
            errMessage: 'Customer found',
            customers: customers,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: 2,
            errMessage: 'Internal server error',
            customers: []
        });
    }
};



let handleCreateNewCustomer = async (req, res) => {
    let errMessage = await customerService.createNewCustomer(req.body);
    return res.status(200).json(errMessage);
}

let handleEditCustomer = async (req, res) => {
    try {
        let data = req.body;  // Lấy dữ liệu từ body gửi lên

        // Kiểm tra các trường dữ liệu bắt buộc
        if (!data.id || !data.name || !data.phone || !data.address || !data.status) {
            return res.status(400).json({
                errCode: 2,
                errMessage: 'Missing required fields!',
            });
        }

        console.log('Received data for update:', data);  // Log dữ liệu nhận được

        // Kiểm tra lại id có giá trị hợp lệ
        if (!data.id) {
            return res.status(400).json({
                errCode: 2,
                errMessage: 'Customer ID is missing!',
            });
        }

        // Gọi service cập nhật khách hàng

        let errMessage = await customerService.updateCustomer(data);
        return res.status(200).json(errMessage);
    } catch (error) {
        console.error('Error during customer update:', error); // Log lỗi chi tiết

        return res.status(500).json({
            errCode: 3,
            errMessage: 'Internal server error',
        });
    }
};





let handleDeleteCustomer = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required paramaters!'
        })
    }
    let errMessage = await customerService.deleteCustomer(req.body.id);

    return res.status(200).json(errMessage);
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllCustomer: handleGetAllCustomer,

    handleCreateNewCustomer: handleCreateNewCustomer,
    handleEditCustomer: handleEditCustomer,
    handleDeleteCustomer: handleDeleteCustomer,
}