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

module.exports = {
    handleLogin: handleLogin,
}