import bcrypt from 'bcryptjs';
import db from '../models/index';

let handleCustomerLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customerData = {};

            let isExist = await checkCustomerEmail(email);
            if (isExist) {
                let account = await db.Account.findOne({
                    attributes: ['username', 'role', 'password'],
                    where: { username: email },
                });

                if (account) {
                    if (!account.password) {
                        customerData.errorCode = 2;
                        customerData.errMessage = 'Password is not available';
                        resolve(customerData);
                    }
                    let check = await bcrypt.compare(password, account.password);
                    if (check) {
                        let customer = await db.Customer.findOne({
                            where: { email: email },
                            raw: true,

                        });
                        customerData.errorCode = 0;
                        customerData.errMessage = 'OK';
                        // Trả về thông tin khách hàng cần thiết
                        customerData.customer = {
                            username: account.username,
                            role: account.role,
                            email: customer.email,
                            name: customer.name,  // Nếu có trường name trong bảng Customer
                            // Thêm các trường khác từ bảng Customer nếu cần
                        };
                    } else {
                        customerData.errorCode = 3;
                        customerData.errMessage = 'Wrong password';
                    }
                } else {
                    customerData.errorCode = 2;
                    customerData.errMessage = 'Account is not found!';
                }
            } else {
                customerData.errorCode = 1;
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
