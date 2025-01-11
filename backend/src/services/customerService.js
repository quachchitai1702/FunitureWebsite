import bcrypt from 'bcryptjs';
import db from '../models/index';

let handleCustomerLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customerData = {};

            let isExist = await checkCustomerEmail(email);
            if (isExist) {
                let account = await db.Account.findOne({
                    attributes: ['email', 'role', 'password'],
                    where: { email: email },
                });

                if (account) {
                    if (!account.password) {
                        customerData.errCode = 2;
                        customerData.errMessage = 'Password is not available';
                        resolve(customerData);
                    }
                    let check = await bcrypt.compare(password, account.password);
                    if (check) {
                        let customer = await db.Customer.findOne({
                            where: { email: email },
                            raw: true,

                        });
                        customerData.errCode = 0;
                        customerData.errMessage = '';
                        // Trả về thông tin khách hàng cần thiết
                        customerData.customer = {
                            email: account.email,
                            role: account.role,
                            email: customer.email,
                            name: customer.name,  // Nếu có trường name trong bảng Customer
                            // Thêm các trường khác từ bảng Customer nếu cần
                        };
                    } else {
                        customerData.errCode = 3;
                        customerData.errMessage = 'Wrong password';
                    }
                } else {
                    customerData.errCode = 2;
                    customerData.errMessage = 'Account is not found!';
                }
            } else {
                customerData.errCode = 1;
                customerData.errMessage = 'Your email isn’t exist in system. Please try another email';
            }

            resolve(customerData);
        } catch (e) {
            console.log("Error during login: ", e);
            reject(e);
        }
    });
}

let checkCustomerEmail = (customerEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customer = await db.Customer.findOne({
                where: { email: customerEmail }
            })
            if (customer) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    handleCustomerLogin: handleCustomerLogin,
    checkCustomerEmail: checkCustomerEmail,
}
