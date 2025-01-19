import bcrypt from 'bcryptjs';
import db from '../models/index';
import { raw } from 'body-parser';
import multer from 'multer';
const { Op } = require('sequelize');


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
                    attributes: ['id', 'email', 'role', 'password'],
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
                            id: customer.id,
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

const getAllCustomer = (id, status, searchQuery) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customers = '';
            let whereCondition = {};

            // Kiểm tra giá trị searchQuery
            // console.log("searchQuery in backend:", searchQuery);

            if (searchQuery) {
                whereCondition = {
                    [Op.or]: [
                        { name: { [Op.like]: `%${searchQuery}%` } },  // Tìm kiếm theo tên
                        { phone: { [Op.like]: `%${searchQuery}%` } }  // Tìm kiếm theo số điện thoại
                    ]
                };
                // console.log("whereCondition in backend:", whereCondition);
            }

            // Kiểm tra nếu có điều kiện tìm kiếm, nó sẽ áp dụng vào query
            if (id === 'ALL') {
                customers = await db.Customer.findAll({
                    where: {
                        ...whereCondition,  // Điều kiện tìm kiếm
                        ...(status && { status: status })  // Lọc theo trạng thái nếu có
                    },
                    include: {
                        model: db.Account,
                        as: 'account',
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    raw: true,
                });
            } else {
                customers = await db.Customer.findOne({
                    where: { id: id },
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
                    errMessage: 'Password must be at least 8 characters long!'
                });
            }

            //check phone number

            if (!isValidPhoneNumber(data.phone)) {
                return resolve({
                    errCode: 4,
                    errMessage: 'Phone number must start with 0 and have 10 digits!'
                });
            }
            //check email
            let check = await checkCustomerEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'This email is already used!'

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
                errMessage: 'Customer created successfully!',
            });

        } catch (e) {
            reject(e);
        }
    })
}

let deleteCustomer = (customerid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let foundCustomer = await db.Customer.findOne({
                where: { id: customerid },
                include: [{
                    model: db.Account,
                    as: 'account'
                }]
            });

            if (!foundCustomer) {
                resolve({
                    errCode: 2,
                    errMessage: 'Customer does not exist'
                });
                return;
            }

            if (foundCustomer.account) {
                foundCustomer.account.status = 'inactive';
                await foundCustomer.account.save();
            }

            foundCustomer.status = 'inactive';
            await foundCustomer.save();

            resolve({
                errCode: 0,
                errMessage: 'Customer status updated to inactive'
            });


        } catch (e) {
            console.log('Error deleting customer:', e);
            reject({
                errCode: 1,
                errMessage: 'An error occurred while updating the customer'
            });
        }
    });
}



let updateCustomer = (data) => {
    return new Promise(async (resolve, reject) => {
        const transaction = await db.sequelize.transaction();
        try {

            // console.log('data id:', data.id)

            if (!data.id) {
                console.log('Missing customer ID:', data);
                return resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters',
                });
            }

            if (!isValidPhoneNumber(data.phone)) {
                return resolve({
                    errCode: 4,
                    errMessage: 'Phone number must start with 0 and have 10 digits!',
                });
            }

            let customer = await db.Customer.findOne({
                where: { id: data.id },
                raw: false,
            });

            // console.log('customer: ', customer)


            if (!customer) {
                await transaction.rollback();  // Rollback transaction
                return resolve({
                    errCode: 1,
                    errMessage: 'Customer not found!',
                });
            }

            // Tìm Account liên kết với Customer
            let account = await db.Account.findOne({
                where: { id: customer.accountId },
                raw: false,
            });

            // console.log('account: ', account)


            if (!account) {
                await transaction.rollback();  // Rollback transaction
                return resolve({
                    errCode: 3,
                    errMessage: 'Account not found!',
                });
            }

            // Cập nhật thông tin Customer
            customer.name = data.name;
            customer.phone = data.phone;
            customer.address = data.address;
            customer.status = data.status;

            // Cập nhật trạng thái trong Account
            account.status = data.status;

            // Cập nhật ảnh nếu có
            if (data.imageUrl) {
                customer.imageUrl = data.imageUrl;  // Chỉ cập nhật giá trị imageUrl từ dữ liệu nhận được
            }

            // Lưu cả Customer và Account
            await customer.save({ transaction });
            await account.save({ transaction });

            // Hoàn thành transaction
            await transaction.commit();

            return resolve({
                errCode: 0,
                errMessage: 'Update succeeds',
            });
        } catch (e) {
            await transaction.rollback();  // Rollback transaction
            console.error('Error during customer update:', e);
            reject(e);
        }
    });
};







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


}
