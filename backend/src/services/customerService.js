import bcrypt from 'bcryptjs';
import db from '../models/index';
import { raw } from 'body-parser';
import multer from 'multer';

const { uploadSingleImage } = require('../config/multerConfig');
const fs = require('fs');
const path = require('path');

const salt = bcrypt.genSaltSync(10);

// Helper function to validate phone number format
const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^0\d{9}$/; // Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số
    return phoneRegex.test(phone);
};

// Helper function to validate password length
const isValidPassword = (password) => {
    return password && password.length >= 8;
};




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

                        // Kiểm tra trạng thái của khách hàng
                        if (customer.status !== 'active') {
                            customerData.errCode = 4;
                            customerData.errMessage = 'Your account has been deactivated. Please contact support.';
                            resolve(customerData);
                        }

                        customerData.errCode = 0;
                        customerData.errMessage = '';
                        customerData.customer = {
                            email: account.email,
                            role: account.role,
                            email: customer.email,
                            name: customer.name,
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

let getAllCustomer = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customers = '';
            // console.log('Customer ID received:', customerId);

            if (customerId === 'ALL') {
                // console.log('Fetching all customers...');
                customers = await db.Customer.findAll({
                    include: {
                        model: db.Account,
                        as: 'account',
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    raw: true,
                });
            }
            if (customerId && customerId !== 'ALL') {
                // console.log(`Fetching customer with ID: ${customerId}`);
                customers = await db.Customer.findOne({
                    where: { id: customerId },
                    include: {
                        model: db.Account,
                        as: 'account',
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    raw: true,

                });
            }

            // if (customers) {
            //     console.log('Customers found:', customers);
            // } else {
            //     console.log('No customers found.');
            // }

            resolve(customers);
        } catch (e) {
            reject(e);
        }
    });
};

let hashAccountPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let createNewAccount = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await hashAccountPassword(data.password);

            let newAccount = await db.Account.create({
                email: data.email,
                password: hashPassword,
                status: data.status || 'active',
                role: data.role || 'customer',
            });

            resolve(newAccount);
        } catch (e) {
            reject(e);
        }
    });
};

let createNewCustomer = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check password
            if (!isValidPassword(data.password)) {
                return resolve({
                    errCode: 3,
                    message: 'Password must be at least 8 characters long!'
                });
            }

            //check phone number

            if (!isValidPhoneNumber(data.phone)) {
                return resolve({
                    errCode: 4,
                    message: 'Phone number must start with 0 and have 10 digits!'
                });
            }
            //check email
            let check = await checkCustomerEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: 'This email is already used!'

                })
            }

            // Create a new customer first
            let newAccount = await createNewAccount(data);

            await db.Customer.create({
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address || '',
                status: data.status || 'active',
                imageUrl: data.imageUrl || null,
                accountId: newAccount.id,
            });

            resolve({
                errCode: 0,
                message: 'OK',
            });

        } catch (e) {
            // console.error('Error create new customer:', e);
            reject(e);
        }
    })
}

let deleteCustomer = (customerid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let foundCustomer = await db.Customer.findOne({
                where: { id: customerid },
            })
            if (!foundCustomer) {
                resolve({
                    errCode: 2,
                    errMessage: 'Customer is not exist'
                })
            }

            customer.status = 'inactive';
            customer.account.status = 'inactive';

            await customer.save();
            await customer.account.save();

            resolve({
                errCode: 0,
                errMessage: 'Customer is deleted'
            })

        } catch (e) {
            reject(e);

        }
    })
}

let updateCustomer = (data, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }

            if (!isValidPhoneNumber(data.phone)) {
                return resolve({
                    errCode: 4,
                    message: 'Phone number must start with 0 and have 10 digits!'
                });
            }


            let customer = await db.Customer.findOne({
                where: { id: data.id },
                raw: false
            })
            if (customer) {


                // Cập nhật thông tin khách hàng, bao gồm ảnh mới nếu có
                customer.name = data.name;
                customer.phone = data.phone;
                customer.address = data.address;
                // Kiểm tra nếu có ảnh mới
                if (data.imageUrl) {
                    // Kiểm tra nếu có ảnh cũ, xóa ảnh cũ trong thư mục
                    if (customer.imageUrl) {
                        const oldImagePath = path.join(uploadPath, customer.imageUrl);
                        if (fs.existsSync(oldImagePath)) {
                            fs.unlinkSync(oldImagePath); // Xóa ảnh cũ
                        }
                    }
                    customer.imageUrl = data.imageUrl;
                }
                await customer.save()

                resolve({
                    errCode: 0,
                    errMessage: 'Update succeeds'
                });
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'Customer not found!'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

// let searchAndFilterCustomers = (query, status) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             // Kiểm tra có tìm kiếm không
//             let whereCondition = {};
//             if (query) {
//                 whereCondition = {
//                     [Op.or]: [
//                         { name: { [Op.like]: `%${query}%` } },
//                         { phone: { [Op.like]: `%${query}%` } },
//                     ],
//                 };
//             }

//             // Kiểm tra có lọc theo trạng thái không
//             if (status) {
//                 whereCondition.status = status;
//             }

//             // Tìm kiếm và lọc dữ liệu
//             let customers = await db.Customer.findAll({
//                 where: whereCondition,
//                 include: {
//                     model: db.Account,
//                     as: 'account',
//                 },
//                 attributes: {
//                     exclude: ['password'],
//                 },
//                 raw: true,
//             });

//             resolve(customers);
//         } catch (e) {
//             reject(e);
//         }
//     });
// };



module.exports = {
    handleCustomerLogin: handleCustomerLogin,
    checkCustomerEmail: checkCustomerEmail,
    getAllCustomer: getAllCustomer,

    //Hash password
    hashAccountPassword: hashAccountPassword,

    //Customer CRUD
    createNewCustomer: createNewCustomer,
    createNewAccount: createNewAccount,
    deleteCustomer: deleteCustomer,
    updateCustomer: updateCustomer,

    // searchAndFilterCustomers: searchAndFilterCustomers,

}
