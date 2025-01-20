import categoryService from '../services/categoryService';
import upload from '../config/upload';


const handleCreateCategory = async (req, res) => {
    try {
        let data = req.body;

        // Nếu có ảnh, gán đường dẫn ảnh
        if (req.file) {
            data.imageUrl = `/uploads/${req.file.filename}`;
        }

        console.log('data to Api: ', data);

        const response = await categoryService.createCategory(data);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Error in createCategory controller:", error);
        return res.status(500).json({
            errCode: 3,
            errMessage: "Error creating category!"
        });
    }
};


// const handleCreateCategory = async (req, res) => {
//     try {
//         const data = req.body;
//         console.log('data from react: ', data)
//         const response = await categoryService.createCategory(data);
//         return res.status(response.errCode === 0 ? 200 : 400).json(response);
//     } catch (error) {
//         console.error("Error in createCategory controller:", error);
//         return res.status(500).json({
//             errCode: 3,
//             errMessage: "Error creating category!"
//         });
//     }
// };



const handleGetAllCategories = async (req, res) => {
    try {
        const { searchQuery, id } = req.query;

        const response = await categoryService.getAllCategories(searchQuery, id);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Error in getAllCategories controller:", error);
        return res.status(500).json({
            errCode: 2,
            errMessage: "Error fetching categories!"
        });
    }
};


const handelUpdateCategory = async (req, res) => {
    try {
        const data = req.body;
        const response = await categoryService.updateCategory(data);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Error in updateCategory controller:", error);
        return res.status(500).json({
            errCode: 3,
            errMessage: "Error updating category!"
        });
    }
};

const handelDeleteCategory = async (req, res) => {
    try {
        let { id } = req.body;  // Lấy trực tiếp 'id' từ body request
        const response = await categoryService.deleteCategory(id);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Error in deleteCategory controller:", error);
        return res.status(500).json({
            errCode: 3,
            errMessage: "Error deleting category: " + (error.errMessage || error)
        });
    }
};




module.exports = {
    handleCreateCategory,
    handleGetAllCategories,
    handelUpdateCategory,
    handelDeleteCategory,
};
