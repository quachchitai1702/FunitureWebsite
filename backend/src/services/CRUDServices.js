import bcrypt from 'bcryptjs';
import db from '../models/index';



const salt = bcrypt.genSaltSync(10);


let createNewAccount = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.password) {
                throw new Error("Password is required in createNewAccount");
            }
            let hashPasswordFromBcrypt = await hashPassword(data.password);

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
            console.log("Data received in createNewCustomer:", data);  // Log dữ liệu nhận được

            // Kiểm tra các trường cần thiết
            if (!data || !data.name || !data.email || !data.phone || !data.password) {
                console.error('Missing fields:', {
                    name: !data.name,
                    email: !data.email,
                    phone: !data.phone,
                    password: !data.password,
                });
                throw new Error("Missing required fields in createNewCustomer");
            }

            const newAccount = await createNewAccount({
                username: data.email,
                password: data.password,
                role: 'customer',
            });

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




let hashPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!password) {
                throw new Error("Password is required");
            }
            let hashPassword = await bcrypt.hash(password, salt);
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