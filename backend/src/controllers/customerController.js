import customerService from '../services/customerService';

let handleLogin = async (req, res) => {
    console.log('Request body:', req.body);  // In toàn bộ req.body để kiểm tra
    let email = req.body.email;
    console.log('email:' + email);
    let password = req.body.password;
    console.log('password:' + password);


    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameter!',
        })
    }

    let customerData = await customerService.handleCustomerLogin(email, password);

    return res.status(200).json({
        errCode: customerData.errCode,
        message: customerData.errMessage,
        customer: customerData.customer ? customerData.customer : {}
    })
}

let handleGetAllCustomer = async (req, res) => {
    let id = req.body.id; // Nếu không có id, mặc định là 'ALL'

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
            customers: customers,  // Trả về mảng rỗng nếu không tìm thấy
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

module.exports = {
    handleLogin: handleLogin,
    handleGetAllCustomer: handleGetAllCustomer,
}