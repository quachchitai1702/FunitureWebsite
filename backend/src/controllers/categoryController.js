import categoryService from '../services/categoryService';
const { uploadSingleImage } = require('../config/multerConfig');


const handleCreateCategory = async (req, res) => {
    const response = await categoryService.createCategory(req.body);
    return res.status(200).json(response);
};

const handleGetAllCategories = async (req, res) => {
    const response = await categoryService.getAllCategories();
    return res.status(200).json(response);
};

const handleGetCategoriesBySearch = async (req, res) => {
    const { searchQuery } = req.body;

    // Log kiểm tra searchQuery
    console.log('data:', searchQuery);

    if (!searchQuery) {
        return res.status(400).json({
            errCode: 1,
            errMessage: "Search query is required!"
        });
    }

    // Gọi service tìm kiếm theo query
    try {
        const response = await categoryService.getCategoriesBySearch(searchQuery);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error in controller:", error);
        return res.status(500).json({
            errCode: 2,
            errMessage: "Error in category search!"
        });
    }
};

const handelUpdateCategory = async (req, res) => {
    try {
        let data = req.body; // Lấy dữ liệu từ body gửi lên

        // Kiểm tra các trường dữ liệu bắt buộc
        if (!data.id || !data.name || !data.description) {
            return res.status(400).json({
                errCode: 2,
                errMessage: 'Missing required fields!',
            });
        }

        console.log('Received data for update:', data); // Log dữ liệu nhận được

        // Kiểm tra lại id có giá trị hợp lệ
        if (!data.id) {
            return res.status(400).json({
                errCode: 2,
                errMessage: 'Category ID is missing!',
            });
        }

        // Gọi service để cập nhật danh mục
        let errMessage = await categoryService.updateCategory(data);
        return res.status(200).json(errMessage);
    } catch (error) {
        console.error('Error during category update:', error); // Log lỗi chi tiết

        return res.status(500).json({
            errCode: 3,
            errMessage: 'Internal server error',
        });
    }
};


const handelDeleteCategory = async (req, res) => {
    // Kiểm tra id trong body
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!'
        });
    }
    try {
        const response = await categoryService.deleteCategory(req.body.id);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error in delete category:", error);
        return res.status(500).json({
            errCode: 2,
            errMessage: "Error occurred while deleting category!"
        });
    }
};

module.exports = {
    handleCreateCategory,
    handleGetAllCategories,
    handleGetCategoriesBySearch,
    handelUpdateCategory,
    handelDeleteCategory,
};
