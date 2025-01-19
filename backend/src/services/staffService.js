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




let handleStaffLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let staffData = {};

            // Kiểm tra sự tồn tại của email
            let isExist = await checkStaffEmail(email);
            if (isExist) {
                let account = await db.Account.findOne({
                    attributes: ['id', 'email', 'role', 'password'],
                    where: { email: email },
                });

                if (account) {
                    // Kiểm tra nếu không có password
                    if (!account.password) {
                        staffData.errCode = 2;
                        staffData.errMessage = 'Password is not available';
                        resolve(staffData);
                    }

                    // So sánh mật khẩu người dùng nhập với mật khẩu mã hóa trong DB
                    let check = await bcrypt.compare(password, account.password);
                    if (check) {
                        let staff = await db.Staff.findOne({
                            where: { email: email },
                            raw: true,
                        });

                        // Kiểm tra trạng thái nhân viên
                        if (staff.status !== 'active') {
                            staffData.errCode = 4;
                            staffData.errMessage = 'Your account has been deactivated. Please contact support.';
                            resolve(staffData);
                        }

                        // Đăng nhập thành công, tạo dữ liệu trả về
                        staffData.errCode = 0;
                        staffData.errMessage = '';
                        staffData.staff = {
                            id: staff.id,
                            email: account.email,
                            role: account.role,
                            name: staff.name,
                        };

                        // Nếu cần thiết, bạn có thể tạo thêm một JWT token ở đây
                        // const token = generateJWTToken(staffData.staff);

                        resolve(staffData);  // Trả về dữ liệu sau khi đăng nhập thành công
                    } else {
                        staffData.errCode = 3;
                        staffData.errMessage = 'Wrong password';
                        resolve(staffData);  // Trả về lỗi mật khẩu sai
                    }
                } else {
                    staffData.errCode = 2;
                    staffData.errMessage = 'Account is not found!';
                    resolve(staffData);  // Trả về lỗi nếu không tìm thấy tài khoản
                }
            } else {
                staffData.errCode = 1;
                staffData.errMessage = 'Your email isn’t in the system. Please try another email';
                resolve(staffData);  // Trả về lỗi nếu email không tồn tại
            }
        } catch (error) {
            console.error('Error during login:', error);
            reject(error);  // Trả về lỗi nếu có sự cố
        }
    });
};



let checkStaffEmail = (staffEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let staff = await db.Staff.findOne({
                where: { email: staffEmail }
            })
            if (staff) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
}

let getAllStaff = (id, status, searchQuery) => {
    return new Promise(async (resolve, reject) => {
        try {
            let staffs = '';
            let whereCondition = {};

            if (searchQuery) {
                whereCondition = {
                    [Op.or]: [
                        { name: { [Op.like]: `%${searchQuery}%` } },
                        { phone: { [Op.like]: `%${searchQuery}%` } },  // Cho phép tìm kiếm theo phone
                    ]
                };
            }

            if (id === 'ALL') {
                staffs = await db.Staff.findAll({
                    where: {
                        ...whereCondition,
                        ...(status && { status: status })
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
                staffs = await db.Staff.findOne({
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
            resolve(staffs);
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
                role: data.role || 'staff',
            });

            resolve(newAccount);
        } catch (e) {
            reject(e);
        }
    });
};

let createNewStaff = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra password
            if (!isValidPassword(data.password)) {
                return resolve({
                    errCode: 3,
                    errMessage: 'Password must be at least 8 characters long!'
                });
            }

            // Kiểm tra email
            let check = await checkStaffEmail(data.email);
            if (check === true) {
                return resolve({
                    errCode: 1,
                    errMessage: 'This email is already used!'
                });
            }

            // Kiểm tra số điện thoại
            if (!isValidPhoneNumber(data.phone)) {
                return resolve({
                    errCode: 4,
                    errMessage: 'Invalid phone number format! Phone must start with 0 and be 10 digits long.'
                });
            }

            // Tạo tài khoản mới
            let newAccount = await createNewAccount(data);

            // Tạo thông tin staff mới
            await db.Staff.create({
                name: data.name,
                email: data.email,
                phone: data.phone,  // Thêm trường phone
                role: data.role || 'staff',
                status: data.status || 'active',
                imageUrl: data.imageUrl || null,
                accountId: newAccount.id,  // Liên kết tài khoản với nhân viên
            });

            resolve({
                errCode: 0,
                errMessage: 'Staff created successfully!',
            });

        } catch (e) {
            console.error('Error creating new staff:', e);
            reject(e);
        }
    });
};


let deleteStaff = (staffId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tìm staff theo ID
            let foundStaff = await db.Staff.findOne({
                where: { id: staffId },
                include: [{
                    model: db.Account,
                    as: 'account'
                }]
            });

            // Nếu không tìm thấy staff
            if (!foundStaff) {
                resolve({
                    errCode: 2,
                    errMessage: 'Staff does not exist'
                });
                return;
            }

            // Nếu staff có tài khoản (Account), đổi trạng thái tài khoản thành 'inactive'
            if (foundStaff.account) {
                foundStaff.account.status = 'inactive';
                await foundStaff.account.save();
            }

            // Cập nhật trạng thái staff thành 'inactive'
            foundStaff.status = 'inactive';
            await foundStaff.save();

            resolve({
                errCode: 0,
                errMessage: 'Staff status updated to inactive'
            });

        } catch (e) {
            console.log('Error deleting staff:', e);
            reject({
                errCode: 1,
                errMessage: 'An error occurred while updating the staff'
            });
        }
    });
};


let updateStaff = (data) => {
    return new Promise(async (resolve, reject) => {
        const transaction = await db.sequelize.transaction();
        try {
            if (!data.id) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters',
                });
            }

            let staff = await db.Staff.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (!staff) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Staff not found!',
                });
            }

            let account = await db.Account.findOne({
                where: { id: staff.accountId },
                raw: false,
            });

            if (!account) {
                return resolve({
                    errCode: 3,
                    errMessage: 'Account not found!',
                });
            }

            // Kiểm tra số điện thoại hợp lệ trước khi cập nhật
            if (data.phone && !isValidPhoneNumber(data.phone)) {
                return resolve({
                    errCode: 4,
                    errMessage: 'Invalid phone number format! Phone must start with 0 and be 10 digits long.'
                });
            }

            staff.name = data.name || staff.name;
            staff.phone = data.phone || staff.phone;  // Cập nhật phone
            staff.status = data.status || staff.status;
            staff.imageUrl = data.imageUrl || staff.imageUrl;

            account.status = data.status || account.status;

            await staff.save({ transaction });
            await account.save({ transaction });

            await transaction.commit();

            return resolve({
                errCode: 0,
                errMessage: 'Update successful',
            });
        } catch (e) {
            await transaction.rollback();
            console.error('Error during staff update:', e);
            reject({
                errCode: 4,
                errMessage: 'Failed to update staff',
            });
        }
    });
};











module.exports = {
    handleStaffLogin: handleStaffLogin,
    checkStaffEmail: checkStaffEmail,
    getAllStaff: getAllStaff,

    //Hash password
    hashAccountPassword: hashAccountPassword,

    //Staff CRUD
    createNewStaff: createNewStaff,
    createNewAccount: createNewAccount,
    deleteStaff: deleteStaff,
    updateStaff: updateStaff,


}
