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
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
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

let uploadSingleImage = upload.single('imageUrl'); // Đổi tên trường từ 'selectedFile' thành 'imageUrl'

module.exports = {
    uploadSingleImage,
    uploadPath,
};
