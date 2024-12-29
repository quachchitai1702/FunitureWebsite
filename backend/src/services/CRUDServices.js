import bcrypt from 'bcryptjs';
import db from '../models/index';
import account from '../models/account';



const salt = bcrypt.genSaltSync(10);



let createNewAccount = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashCustomerPassword(data.password);

            const newAccount = await db.Account.create({
                username: data.username,
                password: hashPasswordFromBcrypt,
                status: 'active',
                role: data.role,
            });

            resolve(newAccount);
        } catch (e) {
            console.error('Error create new account:', e);
            reject(e);
        }
    });
};


let createNewCustomer = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tạo tài khoản trước khi tạo customer
            const newAccount = await createNewAccount({
                username: data.email,
                password: data.password,
                role: 'customer',
            });

            // Tạo customer mới với accountId là accountId vừa lấy
            await db.Customer.create({
                name: data.name,
                email: data.email,
                password: data.password,
                phone: data.phone,
                address: data.address,
                status: data.status,
                imageUrl: data.imageUrl,
                accountId: newAccount.id,
            });
            resolve('Create a new customer success');

        } catch (e) {
            console.error('Error create new customer:', e);
            reject(e);
        }
    })

}



let hashCustomerPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hash(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    createNewCustomer: createNewCustomer,
    createNewAccount: createNewAccount,
}