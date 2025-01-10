import customerService from '../services/customerService';

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameter!',
        })
    }

    let customerData = await customerService.handleCustomerLogin(email, password);

    // //check email
    // //compare password
    // //return customerInfor
    // //access_token:JWT Json Web Token
    return res.status(200).json({
        errCode: customerData.errCode,
        message: customerData.errMessage,
        customer: customerData.customer ? customerData.customer : {}
    })
}

module.exports = {
    handleLogin: handleLogin,
}