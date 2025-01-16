import staffService from '../services/staffService';
const { uploadSingleImage } = require('../config/multerConfig');


let handleStaffLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    // Kiểm tra email và password có tồn tại trong body không
    if (!email || !password) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Email and password are required',
        });
    }

    try {
        // Gọi service xử lý đăng nhập
        let staffData = await staffService.handleStaffLogin(email, password);

        // Trả về kết quả đăng nhập
        return res.status(200).json({
            errCode: staffData.errCode,
            errMessage: staffData.errMessage,
            staff: staffData.staff || {},
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            errCode: 2,
            errMessage: 'Internal server error',
        });
    }
};



let handleGetAllStaff = async (req, res) => {
    let { id, status, searchQuery } = req.query;

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters (id)',
            staffs: []
        });
    }

    try {
        let staffs = await staffService.getAllStaff(id, status, searchQuery);

        if (!staffs || (Array.isArray(staffs) && staffs.length === 0)) {
            return res.status(404).json({
                errCode: 1,
                errMessage: 'Staff not found!',
                staffs: []
            });
        }

        return res.status(200).json({
            errCode: 0,
            errMessage: 'Staff found',
            staffs: staffs,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: 2,
            errMessage: 'Internal server error',
            staffs: []
        });
    }
};



let handleCreateNewStaff = async (req, res) => {
    try {
        let errMessage = await staffService.createNewStaff(req.body);
        return res.status(200).json(errMessage);
    } catch (error) {

        console.error('Error creating new staff:', error);
        return res.status(500).json({
            errCode: 2,
            errMessage: 'Internal server error',
        });
    }
};


let handleEditStaff = async (req, res) => {
    try {
        let data = req.body;  // Get data from the request body
        console.log('staff id:', data.id);

        // Kiểm tra ID của staff
        if (!data.id) {
            return res.status(400).json({
                errCode: 2,
                errMessage: 'Staff ID is missing!',
            });
        }

        // Gọi service để cập nhật staff
        let errMessage = await staffService.updateStaff(data);

        // Kiểm tra lỗi từ service trả về
        if (errMessage.errCode !== 0) {
            return res.status(400).json(errMessage);  // Trả về mã lỗi phù hợp từ service
        }

        // Nếu thành công, trả về thông báo
        return res.status(200).json(errMessage);
    } catch (error) {
        console.error('Error during staff update:', error);

        // Trả về lỗi server
        return res.status(500).json({
            errCode: 3,
            errMessage: 'Internal server error',
        });
    }
};






let handleDeleteStaff = async (req, res) => {
    // Kiểm tra id trong body
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!'
        });
    }

    // Gọi service xóa staff
    let errMessage = await staffService.deleteStaff(req.body.id);

    // Trả về kết quả
    return res.status(200).json(errMessage);
};


module.exports = {
    handleStaffLogin: handleStaffLogin,
    handleGetAllStaff: handleGetAllStaff,

    handleCreateNewStaff: handleCreateNewStaff,
    handleEditStaff: handleEditStaff,
    handleDeleteStaff: handleDeleteStaff,
}