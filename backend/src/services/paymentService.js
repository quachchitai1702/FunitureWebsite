import bcrypt from 'bcryptjs';
import db from '../models/index';
import { raw } from 'body-parser';
import multer from 'multer';
const { Op, where } = require('sequelize');

const salt = bcrypt.genSaltSync(10);


const createPaymentMethod = async (customerId, cardNumber, cardholderName, expiryDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Create payment method entry

            const paymentMethod = await db.PaymentMethod.create({
                customerId,
                cardNumber,
                cardholderName,
                expiryDate
            });

            resolve({
                errCode: 0,
                errMessage: "Payment method created successfully!",
                paymentMethod,
            });
        } catch (error) {
            reject({
                errCode: 1,
                errMessage: error.message,
            });
        }
    });
};

const getPaymentMethods = async (paymentMethodId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentMethods = await db.PaymentMethod.findAll({
                where: { id: paymentMethodId },
            });

            if (!paymentMethods || paymentMethods.length === 0) {
                return reject({
                    errCode: 2,
                    errMessage: "No payment methods found for this customer!",
                });
            }

            resolve({ errCode: 0, paymentMethods });
        } catch (error) {
            reject({
                errCode: 1,
                errMessage: error.message,
            });
        }
    });
};

const deletePaymentMethod = async (paymentMethodId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentMethod = await db.PaymentMethod.findOne({
                where: { id: paymentMethodId }
            });
            if (!paymentMethod) {
                return reject({
                    errCode: 2,
                    errMessage: "Payment method not found!",
                });
            }

            await paymentMethod.destroy();
            resolve({
                errCode: 0,
                errMessage: "Payment method deleted successfully!",
            });
        } catch (error) {
            reject({
                errCode: 1,
                errMessage: error.message,
            });
        }
    });
};

module.exports = {
    createPaymentMethod,
    getPaymentMethods,
    deletePaymentMethod,
};


