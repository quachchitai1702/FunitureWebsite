import bcrypt from 'bcryptjs';
import db from '../models/index';
import { raw } from 'body-parser';
import multer from 'multer';
const { Op } = require('sequelize');

const salt = bcrypt.genSaltSync(10);

const createCategory = (data) => {
    return new Promise((resolve, reject) => {
        if (!data.name || !data.description) {
            return resolve({
                errCode: 1,
                errMessage: "Missing required fields!"
            });
        }

        // Kiểm tra xem danh mục đã tồn tại chưa
        db.Category.findOne({
            where: { name: data.name }
        })
            .then((existingCategory) => {
                if (existingCategory) {
                    return resolve({
                        errCode: 2,
                        errMessage: "Category name already exists!"
                    });
                }

                // Tạo danh mục mới nếu không bị trùng
                return db.Category.create({
                    name: data.name,
                    description: data.description,
                    imageUrl: data.imageUrl
                });
            })
            .then((category) => {
                resolve({
                    errCode: 0,
                    errMessage: "Category created successfully!",
                    category
                });
            })
            .catch((error) => {
                console.error("Error creating category:", error);
                reject({
                    errCode: 3,
                    errMessage: "Error creating category!"
                });
            });
    });
};


const getAllCategories = () => {
    return new Promise((resolve, reject) => {
        db.Category.findAll()
            .then((categories) => {
                resolve({
                    errCode: 0,
                    errMessage: "Success",
                    categories
                });
            })
            .catch(() => {
                reject({
                    errCode: 2,
                    errMessage: "Error fetching categories!"
                });
            });
    });
};

const getCategoriesBySearch = (searchQuery) => {
    return new Promise((resolve, reject) => {
        db.Category.findAll({
            where: {
                name: {
                    [Op.like]: `%${searchQuery}%`
                }
            }
        })
            .then((categories) => {
                if (categories.length === 0) {
                    return resolve({
                        errCode: 1,
                        errMessage: "No categories found!",
                        categories: []
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: "Success",
                    categories
                });
            })
            .catch((error) => {
                console.error("Error in service:", error);
                reject({
                    errCode: 2,
                    errMessage: "Error fetching categories!"
                });
            });
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
        console.log("Attempting to delete category with id:", id);

        // Tìm danh mục cần xóa
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
                    errMessage: "Error deleting category!"
                });
            });
    });
};


module.exports = {
    createCategory,
    getAllCategories,
    getCategoriesBySearch,
    updateCategory,
    deleteCategory
};
