import customerService from '../services/customerService';
const { uploadSingleImage } = require('../config/multerConfig');


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
    let id = req.query.id;

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing reuired parameters',
            customers: []
        })
    }

    try {
        let customers = await customerService.getAllCustomer(id);

        // Kiểm tra nếu không tìm thấy khách hàng
        if (!customers || (Array.isArray(customers) && customers.length === 0)) {
            return res.status(404).json({
                errCode: 1,
                errMessage: 'Customer not found!',
                customers: []
            });
        }

        return res.status(200).json({
            errCode: 0,
            errMessage: 'Customer is found',
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
}

let handleCreateNewCustomer = async (req, res) => {
    let errMessage = await customerService.createNewCustomer(req.body);
    return res.status(200).json(errMessage);
}

let handleEditCustomer = async (req, res) => {
    uploadSingleImage(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                errCode: 1,
                errMessage: 'Image upload failed',
            });
        }

        try {
            let data = req.body;
            let file = req.file;

            // Kiểm tra xem có file ảnh hay không
            if (file) {
                data.imageUrl = file.filename;
            }

            let errMessage = await customerService.updateCustomer(data);
            return res.status(200).json(errMessage);
        } catch (error) {
            return res.status(500).json({
                errCode: 2,
                errMessage: 'Internal server error',
            });
        }
    });
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