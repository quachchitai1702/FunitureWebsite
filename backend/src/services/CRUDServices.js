import bcrypt from 'bcryptjs';
import db from '../models/index';
import { promises } from 'dns';
import { raw } from 'body-parser';

const salt = bcrypt.genSaltSync(10);

let createNewAccount = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await hashAccountPassword(data.password);

            let newAccount = await db.Account.create({
                username: data.email,
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

// create new customer
let createNewCustomer = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Create a new account first
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

            resolve('Create a new customer success');
        } catch (e) {
            console.error('Error create new customer:', e);
            reject(e);
        }
    });
};



// Hash password
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

let getAllCustomer = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let customer = db.Customer.findAll({
                raw: true,
            });
            resolve(customer);

        } catch (e) {
            reject(e);
        }
    })
}

let getCustomerInfoById = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customer = await db.Customer.findOne({
                where: { id: customerId },
                raw: true,
            });

            if (customer) {
                resolve(customer);
            } else {
                resolve({});
            }

        } catch (e) {
            reject(e);
        }
    })

}

let updateCustomerInfo = (data) => {
    return new Promise(async (resolve, reject) => {
        console.log('data from services:');
        console.log(data);

        try {
            // Tìm khách hàng theo ID
            let customer = await db.Customer.findOne({
                where: { id: data.id },
            });

            if (customer) {
                // Cập nhật thông tin khách hàng
                customer.name = data.name || customer.name;
                customer.address = data.address || customer.address;
                customer.phone = data.phone || customer.phone;
                customer.imageUrl = data.imageUrl || customer.imageUrl;

                await customer.save();
                let allCustomers = await db.Customer.findAll({
                    raw: true,
                });
                resolve(allCustomers);
            } else {
                reject();
            }
        } catch (e) {
            reject(e);
        }
    });
}


module.exports = {
    createNewCustomer: createNewCustomer,
    createNewAccount: createNewAccount,
    hashAccountPassword: hashAccountPassword,
    getAllCustomer: getAllCustomer,
    getCustomerInfoById: getCustomerInfoById,
    updateCustomerInfo: updateCustomerInfo,
}