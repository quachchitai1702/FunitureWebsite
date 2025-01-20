import bcrypt from 'bcryptjs';
import db from '../models/index';
import { raw } from 'body-parser';
import multer from 'multer';
const { Op } = require('sequelize');

const salt = bcrypt.genSaltSync(10);

const createCategory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra dữ liệu bắt buộc
            if (!data.name || !data.description) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required fields!"
                });
            }

            // Kiểm tra xem danh mục đã tồn tại chưa
            const existingCategory = await db.Category.findOne({
                where: { name: data.name }
            });

            if (existingCategory) {
                return resolve({
                    errCode: 2,
                    errMessage: "Category name already exists!"
                });
            }

            // // Kiểm tra và chỉ nhận imageUrl là chuỗi
            // let imageUrl = null;
            // if (typeof data.imageUrl === "string" && data.imageUrl.trim() !== "") {
            //     imageUrl = data.imageUrl.trim();
            // }

            // Tạo danh mục mới
            const category = await db.Category.create({
                name: data.name,
                description: data.description,
                imageUrl: data.imageUrl,
            });

            resolve({
                errCode: 0,
                errMessage: "Category created successfully!",
                category
            });
        } catch (error) {
            console.error("Error creating category:", error);
            reject({
                errCode: 3,
                errMessage: "Error creating category!"
            });
        }
    });
};


const getAllCategories = (searchQuery = "", id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let categories;

            // console.log("Received search query:", searchQuery); // Kiểm tra giá trị searchQuery

            // Nếu có ID, tìm danh mục theo ID
            if (id) {
                categories = await db.Category.findByPk(id);
                if (!categories) {
                    return reject({
                        errCode: 1,
                        errMessage: "Category not found!"
                    });
                }
                return resolve({
                    errCode: 0,
                    errMessage: "Success",
                    categories: [categories] // Trả về mảng chứa 1 phần tử
                });
            } else {
                // Nếu không có ID, kiểm tra nếu có searchQuery
                if (searchQuery.trim()) {
                    categories = await db.Category.findAll({
                        where: {
                            name: { [Op.like]: `%${searchQuery}%` }  // ✅ Đã sửa lỗi cú pháp
                        }
                    });
                } else {
                    // Nếu không có searchQuery, tìm tất cả danh mục
                    categories = await db.Category.findAll();
                }

                if (!categories || categories.length === 0) {
                    return resolve({  // Thay vì reject, dùng resolve để tránh lỗi Promise
                        errCode: 1,
                        errMessage: "No categories found!"
                    });
                }

                return resolve({
                    errCode: 0,
                    errMessage: "Success",
                    categories
                });
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            return reject({
                errCode: 2,
                errMessage: "Error fetching categories!"
            });
        }
    });
};

const updateCategory = (data) => {
    return new Promise((resolve, reject) => {
        console.log("Attempting to update category with id:", data.id);

        // Tìm danh mục theo ID
        db.Category.findOne({
            where: { id: data.id }
        })
            .then(async (category) => {
                if (!category) {
                    console.log("Category not found!");
                    return resolve({
                        errCode: 1,
                        errMessage: "Category not found!"
                    });
                }

                // Kiểm tra xem tên danh mục mới có trùng với danh mục khác không
                const existingCategory = await db.Category.findOne({
                    where: {
                        name: data.name,
                        id: { [Op.ne]: data.id } // Không tính danh mục hiện tại
                    }
                });

                if (existingCategory) {
                    console.log("Category name already exists!");
                    return resolve({
                        errCode: 2,
                        errMessage: "Category name already exists!"
                    });
                }

                // Cập nhật danh mục
                return category.update({
                    name: data.name,
                    description: data.description,
                    imageUrl: data.imageUrl
                });
            })
            .then(() => {
                console.log("Category updated successfully!");
                resolve({
                    errCode: 0,
                    errMessage: "Category updated successfully!"
                });
            })
            .catch((error) => {
                console.error("Error updating category:", error);
                reject({
                    errCode: 3,
                    errMessage: "Error updating category!"
                });
            });
    });
};


const deleteCategory = (id) => {
    return new Promise((resolve, reject) => {
        // console.log("Attempting to delete category with id:", id);

        db.Category.findOne({
            where: { id: id }
        })
            .then(async (category) => {
                if (!category) {
                    console.log("Category not found!");
                    return resolve({
                        errCode: 1,
                        errMessage: "Category not found!"
                    });
                }

                // Kiểm tra xem có sản phẩm nào thuộc danh mục này không
                const productCount = await db.Product.count({
                    where: { categoryId: id }
                });

                if (productCount > 0) {
                    console.log("Cannot delete category because it contains products!");
                    return resolve({
                        errCode: 2,
                        errMessage: "Cannot delete category because it contains products!"
                    });
                }

                // Nếu không có sản phẩm nào, tiến hành xóa danh mục
                return category.destroy();
            })
            .then(() => {
                console.log("Category deleted successfully!");
                resolve({
                    errCode: 0,
                    errMessage: "Category deleted successfully!"
                });
            })
            .catch((error) => {
                console.error("Error deleting category:", error);
                reject({
                    errCode: 3,
                    errMessage: `Error deleting category: ${error.message || error}`
                });
            });
    });
};




module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};
