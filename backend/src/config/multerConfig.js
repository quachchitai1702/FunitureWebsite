// multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đường dẫn lưu ảnh
const uploadPath = path.join(__dirname, 'uploads');

// Kiểm tra và tạo thư mục nếu chưa có
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// Cấu hình multer để lưu ảnh vào thư mục 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath); // Thư mục lưu ảnh
    },
    filename: function (req, file, cb) {
        // Đặt tên ảnh là timestamp + tên gốc của ảnh
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước ảnh (5MB)
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

let uploadSingleImage = upload.single('imageUrl');  // 'image' là tên trường ảnh trong form

module.exports = {
    uploadSingleImage: uploadSingleImage,
    uploadPath: uploadPath,
};
