import bcrypt from 'bcryptjs';
import db from '../models/index';
import { raw } from 'body-parser';
import multer from 'multer';
const { Op, where } = require('sequelize');

const salt = bcrypt.genSaltSync(10);


const createCart = async (customerId, total) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cart = await db.Cart.create({
                customerId,
                total
            });
            resolve({
                errCode: 0,
                errMessage: "Cart created successfully!",
                cart
            });
        } catch (error) {
            reject({
                errCode: 1,
                errMessage: error.message
            });
        }
    });
};


const getCartByCustomerId = async (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cart = await db.Cart.findOne({
                where: { customerId },
                include: [{
                    model: db.CartDetail,
                    as: 'cartDetails',
                    include: [{
                        model: db.Product,
                        as: 'product',
                    }]
                }]
            });

            if (!cart) {
                return reject({
                    errCode: 2,
                    errMessage: "Cart not found!"
                });
            }

            resolve({
                errCode: 0,
                cart
            });
        } catch (error) {
            reject({
                errCode: 1,
                errMessage: error.message
            });
        }
    });
};


const deleteCart = async (cartId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cart = await db.Cart.findOne({
                where: { id: cartId }
            });
            if (!cart) return reject({
                errCode: 2,
                errMessage: "Cart not found!"
            });

            await cart.destroy();
            resolve({
                errCode: 0,
                errMessage: "Cart deleted successfully!"
            });
        } catch (error) {
            reject({
                errCode: 1,
                errMessage: error.message
            });
        }
    });
};




const addProductToCart = async (customerId, productId, quantity) => {
    return new Promise(async (resolve, reject) => {
        try {
            let cart = await db.Cart.findOne({
                where: { customerId }
            });

            if (!cart) {
                cart = await db.Cart.create({
                    customerId,
                    total: 0
                });
            }

            const product = await db.Product.findOne({
                where: { id: productId }
            });
            if (!product) {
                return reject({
                    errCode: 2,
                    errMessage: "Product not found!"
                });
            }

            if (product.status !== 'available') {
                return reject({
                    errCode: 3,
                    errMessage: "Product is not available!"
                });
            }

            if (product.stock < quantity) {
                return reject({
                    errCode: 4,
                    errMessage: "Not enough stock available!"
                });
            }

            const price = product.price;

            const cartDetail = await db.CartDetail.create({
                cartId: cart.id,
                productId,
                quantity,
                price
            });

            const updatedTotal = Number(cart.total) + Number(quantity) * Number(price);
            await cart.update({ total: updatedTotal });

            const updatedStock = product.stock - quantity;
            await product.update({ stock: updatedStock });

            resolve({
                errCode: 0,
                errMessage: "Product added to cart successfully!",
                cartDetail
            });
        } catch (error) {
            reject({
                errCode: 1,
                errMessage: error.message
            });
        }
    });
};



const updateCartDetail = async (cartDetailId, newQuantity) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cartDetail = await db.CartDetail.findOne({ where: { id: cartDetailId } });
            if (!cartDetail) {
                return reject({
                    errCode: 2,
                    errMessage: "Cart detail not found!"
                });
            }

            const product = await db.Product.findOne({ where: { id: cartDetail.productId } });
            if (!product) {
                return reject({
                    errCode: 3,
                    errMessage: "Product not found!"
                });
            }

            const cart = await db.Cart.findOne({ where: { id: cartDetail.cartId } });
            if (!cart) {
                return reject({
                    errCode: 4,
                    errMessage: "Cart not found!"
                });
            }

            const oldQuantity = Number(cartDetail.quantity);
            const newQuantityNum = parseInt(newQuantity);

            if (isNaN(oldQuantity) || isNaN(newQuantityNum)) {
                return reject({
                    errCode: 5,
                    errMessage: "Invalid quantity values!"
                });
            }

            const quantityDifference = newQuantityNum - oldQuantity;

            if (quantityDifference > 0 && product.stock < quantityDifference) {
                return reject({
                    errCode: 6,
                    errMessage: "Not enough stock available!"
                });
            }

            const price = product.price;

            const updatedStock = product.stock - quantityDifference;

            await cartDetail.update({ quantity: newQuantityNum });
            await product.update({ stock: updatedStock });

            const cartDetails = await db.CartDetail.findAll({ where: { cartId: cartDetail.cartId } });
            const updatedTotal = cartDetails.reduce((total, detail) => {
                return total + (detail.quantity * detail.price);
            }, 0);

            await cart.update({ total: updatedTotal });

            resolve({
                errCode: 0,
                errMessage: "Cart updated successfully!",
                total: updatedTotal
            });
        } catch (e) {
            reject({
                errCode: 1,
                errMessage: e.message
            });
        }
    });
};



const removeProductFromCart = async (cartDetailId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cartDetail = await db.CartDetail.findOne({
                where: { id: cartDetailId }
            });

            if (!cartDetail) {
                return reject({
                    errCode: 2,
                    errMessage: "Cart detail not found!"
                });
            }

            if (!cartDetail.productId) {
                return reject({
                    errCode: 3,
                    errMessage: "Invalid product ID in cart detail!"
                });
            }

            const product = await db.Product.findOne({
                where: { id: cartDetail.productId }
            });

            if (product) {
                const updatedStock = product.stock + cartDetail.quantity;
                await product.update({ stock: updatedStock });
            }

            const cart = await db.Cart.findByPk(cartDetail.cartId);
            if (cart) {
                const updatedTotal = Number(cart.total) - (Number(cartDetail.quantity) * Number(cartDetail.price));
                await cart.update({ total: updatedTotal });
            }

            await cartDetail.destroy();

            resolve({
                errCode: 0,
                errMessage: "Product removed from cart successfully!"
            });
        } catch (error) {
            reject({
                errCode: 1,
                errMessage: error.message
            });
        }
    });
};


module.exports = {
    createCart,
    getCartByCustomerId,
    deleteCart,
    addProductToCart,
    updateCartDetail,
    removeProductFromCart
};



