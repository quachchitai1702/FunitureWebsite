import bcrypt from 'bcryptjs';
import db from '../models/index';
import { raw } from 'body-parser';
import multer from 'multer';
const { Op } = require('sequelize');

const salt = bcrypt.genSaltSync(10);

const createProduct = (data) => {
    // console.log('Data received in service:', data); // Kiểm tra dữ liệu


    return new Promise(async (resolve, reject) => {
        const {
            name,
            price,
            categoryId,
            material,
            stock,
            description,
            status,
            productTypes,
            productImages,
            productColors } = data;

        try {

            const categoryIdInt = parseInt(categoryId, 10);  // Chuyển categoryId sang số
            // Kiểm tra xem categoryId có hợp lệ hay không
            const category = await db.Category.findOne({ where: { id: categoryIdInt } });
            if (!category) {
                return reject({
                    errCode: 2,
                    errMessage: "Category not found!"
                });
            }

            // Tạo mới sản phẩm và lưu categoryId
            const product = await db.Product.create({
                name, price,
                categoryId,
                material, stock, description, status
            });

            // Thêm ProductTypes
            if (productTypes && productTypes.length > 0) {
                const types = productTypes.map(type => ({
                    productId: product.id,
                    type
                }));
                await db.ProductType.bulkCreate(types);
            }

            // Thêm ProductImages
            if (productImages && productImages.length > 0) {
                const images = productImages.map(imageUrl => ({
                    productId: product.id,
                    imageUrl
                }));
                await db.ProductImage.bulkCreate(images);
            }

            // Thêm ProductColors
            if (productColors && productColors.length > 0) {
                const colors = productColors.map(color => ({
                    productId: product.id,
                    color
                }));
                await db.ProductColor.bulkCreate(colors);
            }

            // Trả về sản phẩm cùng với tên category và categoryId
            resolve({
                errCode: 0,
                errMessage: "Product created successfully!",
                product: {
                    ...product.toJSON(),  // Lấy dữ liệu sản phẩm
                    category: category.name,  // Trả về tên category
                    categoryId: category.id  // Trả về categoryId
                }
            });
        } catch (error) {
            reject({
                errCode: 1,
                errMessage: error.message
            });
        }
    });
};




const getAllProducts = (id, status, searchQuery) => {
    return new Promise(async (resolve, reject) => {
        try {
            let whereCondition = {};

            // Kiểm tra nếu có điều kiện tìm kiếm theo tên, chất liệu, danh mục và màu sắc (chỉ thêm điều kiện khi searchQuery không rỗng)
            if (searchQuery && searchQuery.trim()) {
                whereCondition = {
                    [Op.or]: [
                        { name: { [Op.like]: `%${searchQuery}%` } },
                        { material: { [Op.like]: `%${searchQuery}%` } },
                        { category: { [Op.like]: `%${searchQuery}%` } },
                        { '$colors.color$': { [Op.like]: `%${searchQuery}%` } },
                    ]
                };
            }

            // Kiểm tra nếu có trạng thái, lọc theo trạng thái (chỉ thêm điều kiện khi status có giá trị)
            if (status && status.trim()) {
                whereCondition.status = status;
            }

            let products;
            if (id && id !== 'ALL') {
                products = await db.Product.findOne({
                    where: { id: id },
                    include: [
                        {
                            model: db.ProductColor,
                            as: 'colors',
                            required: false,
                        },
                        {
                            model: db.Category,
                            as: 'productCategory',
                            required: false,
                        },
                        {
                            model: db.ProductImage,
                            as: 'images',
                            required: false,
                        }
                    ]
                });
            } else {
                products = await db.Product.findAll({
                    where: whereCondition,
                    include: [
                        {
                            model: db.ProductColor,
                            as: 'colors',
                            required: false,
                        },
                        {
                            model: db.ProductType,
                            as: 'types',
                            required: false,
                        },
                        {
                            model: db.Category,
                            as: 'productCategory',
                            required: false,
                        },
                        {
                            model: db.ProductImage,
                            as: 'images',
                            required: false,
                        }
                    ]
                });
            }

            // Trích xuất imageUrl từ bảng ProductImage nếu có
            const updatedProducts = products.map(product => {
                // Lấy ảnh đầu tiên từ danh sách images (nếu có)
                const imageUrl = product.images && product.images.length > 0 ? product.images[0].imageUrl : null;

                // Thêm trường imageUrl vào sản phẩm
                return {
                    ...product.dataValues,
                    imageUrl,  // Trường imageUrl mới
                };
            });

            resolve({
                errCode: 0,
                errMessage: "Fetched products successfully!",
                products: updatedProducts
            });
        } catch (error) {
            console.error("Error in getAllProducts:", error);
            reject({
                errCode: 2,
                errMessage: "Error fetching products!"
            });
        }
    });
};


const updateProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        console.log('data from frontend: ', data);

        try {

            const product = await db.Product.findOne({
                where: { id: data.id }  // Tìm sản phẩm dựa trên id trong data
            });

            // console.log('product from DB: ', product);  // Kiểm tra sản phẩm lấy từ DB

            // Nếu không tìm thấy sản phẩm
            if (!product) {
                return reject({
                    errCode: 3,
                    errMessage: `Product with ID ${data.id} not found!`
                });
            }

            // Cập nhật thông tin sản phẩm từ dữ liệu truyền vào
            await product.update({
                name: data.name,           // Sử dụng thuộc tính từ data
                price: data.price,
                categoryId: data.categoryId,
                material: data.material,
                stock: data.stock,
                description: data.description,
                status: data.status
            });

            // Cập nhật ProductTypes nếu có
            if (data.productTypes && data.productTypes.length > 0) {
                await db.ProductType.destroy({ where: { productId: data.id } });
                const types = data.productTypes.map(type => ({
                    productId: data.id,
                    type
                }));
                await db.ProductType.bulkCreate(types);
            }

            // Cập nhật ProductImages nếu có
            if (data.productImages && data.productImages.length > 0) {
                await db.ProductImage.destroy({ where: { productId: data.id } });
                const images = data.productImages.map(imageUrl => ({
                    productId: data.id,
                    imageUrl
                }));
                await db.ProductImage.bulkCreate(images);
            }

            // Cập nhật ProductColors nếu có
            if (data.productColors && data.productColors.length > 0) {
                await db.ProductColor.destroy({ where: { productId: data.id } });
                const colors = data.productColors.map(color => ({
                    productId: data.id,
                    color
                }));
                await db.ProductColor.bulkCreate(colors);
            }

            resolve({ errCode: 0, errMessage: "Product updated successfully!" });
        } catch (error) {
            console.error("Error in updateProduct:", error);
            reject({ errCode: 4, errMessage: error.message });
        }
    });
};


const deleteProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await db.Product.findOne({ where: { id: data.id } });

            if (!product) {
                return reject({
                    errCode: 3,
                    errMessage: "Product not found!"
                });
            }

            // Xóa ProductTypes
            await db.ProductType.destroy({ where: { productId: data.id } });

            // Xóa ProductImages
            await db.ProductImage.destroy({ where: { productId: data.id } });

            // Xóa ProductColors
            await db.ProductColor.destroy({ where: { productId: data.id } });

            // Xóa sản phẩm
            await product.destroy();

            resolve({
                errCode: 0,
                errMessage: "Product deleted successfully!"
            });
        } catch (error) {
            reject({
                errCode: 5,
                errMessage: error.message
            });
        }
    });
};

module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
};
