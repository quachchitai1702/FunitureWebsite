import bcrypt from 'bcryptjs';
import db from '../models/index';
import { raw } from 'body-parser';
import multer from 'multer';
const { Op, where } = require('sequelize');

const salt = bcrypt.genSaltSync(10);


const createOrder = (customerId, paymentMethod) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy giỏ hàng của khách hàng từ bảng Cart
            const cart = await db.Cart.findOne({ where: { customerId } });
            if (!cart) {
                return reject({
                    errCode: 3,
                    errMessage: "Cart not found!",
                });
            }

            // Lấy địa chỉ giao hàng từ bảng Customer
            const customer = await db.Customer.findOne({ where: { id: customerId } });
            if (!customer) {
                return reject({
                    errCode: 2,
                    errMessage: "Customer not found!",
                });
            }
            const shippingAddress = customer.address;

            // Lấy danh sách sản phẩm trong giỏ hàng (CartDetail)
            const cartDetails = await db.CartDetail.findAll({
                where: { cartId: cart.id }, // Lấy theo cartId thay vì customerId
                include: [{
                    model: db.Product,
                    as: 'product',
                }]
            });

            if (!cartDetails || cartDetails.length === 0) {
                return reject({
                    errCode: 4,
                    errMessage: "Cart is empty!",
                });
            }

            // Tính tổng tiền đơn hàng từ CartDetail
            let totalAmount = cartDetails.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);

            // Tạo đơn hàng mới
            const order = await db.Order.create({
                customerId,
                totalAmount,
                status: 'pending',
                paymentMethod,
                shippingAddress,
                orderDate: new Date(),
            });

            // Tạo danh sách OrderDetail từ CartDetail
            const orderDetails = cartDetails.map(item => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
            }));

            // Lưu vào bảng OrderDetail
            await db.OrderDetail.bulkCreate(orderDetails);

            // Xóa giỏ hàng sau khi đặt hàng
            await db.CartDetail.destroy({ where: { cartId: cart.id } });

            await db.Cart.update({ total: 0 }, { where: { id: cart.id } });


            resolve({
                errCode: 0,
                errMessage: "Order created successfully!",
                order,
                orderDetails,
            });
        } catch (error) {
            reject({
                errCode: 1,
                errMessage: error.message,
            });
        }
    });
};

const getOrderByCustomerIdStatus = (customerId, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('customerId:', customerId, 'status:', status);

            // Loại bỏ khoảng trắng thừa
            const trimmedStatus = status.trim();

            const whereConditions = {};

            // Nếu customerId là 'ALL', không lọc theo customerId
            if (customerId && customerId !== 'ALL') {
                whereConditions.customerId = customerId;
            }

            // Nếu status là 'ALL', không lọc theo status
            if (trimmedStatus && trimmedStatus !== 'ALL') {
                whereConditions.status = trimmedStatus;
            }

            console.log('Where conditions:', whereConditions);  // Log điều kiện truy vấn

            const orders = await db.Order.findAll({
                where: whereConditions,
                include: [{
                    model: db.OrderDetail,
                    as: 'orderDetails',
                    include: [{
                        model: db.Product,
                        as: 'product',
                    }],
                }],
            });

            if (!orders || orders.length === 0) {
                return resolve({
                    errCode: 2,
                    errMessage: "No orders found with the given conditions!",
                });
            }

            resolve({ errCode: 0, orders });
        } catch (error) {
            reject({
                errCode: 1,
                errMessage: error.message,
            });
        }
    });
};




const updateOrderStatus = (orderId, newStatus) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('data from FE: ', orderId, newStatus);

            if (!orderId || !newStatus) {
                return reject({
                    errCode: 2,
                    errMessage: "Order ID and new status are required!",
                });
            }

            const order = await db.Order.findByPk(orderId);
            if (!order) {
                return resolve({
                    errCode: 2,
                    errMessage: "Order not found!",
                });
            }

            order.status = newStatus;
            console.log('new status: ', order.status);

            await order.save();

            resolve({
                errCode: 0,
                errMessage: "Order status updated successfully!",
                order,  // Trả về thông tin đơn hàng đã cập nhật
            });
        } catch (error) {
            reject({
                errCode: 1,
                errMessage: error.message,
            });
        }
    });
};


const deleteOrder = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra nếu orderId không hợp lệ
            if (!orderId) {
                return reject({
                    errCode: 2,
                    errMessage: "Invalid orderId!",
                });
            }

            const order = await db.Order.findOne({
                where: { id: orderId }
            });
            if (!order) {
                return resolve({
                    errCode: 2,
                    errMessage: "Order not found!",
                });
            }

            // Cập nhật trạng thái của đơn hàng thành 'cancelled'
            order.status = 'cancelled';
            await order.save();

            resolve({
                errCode: 0,
                errMessage: "Order status updated to 'cancelled' successfully!",
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
    createOrder,
    getOrderByCustomerIdStatus,
    updateOrderStatus,
    deleteOrder,
};


