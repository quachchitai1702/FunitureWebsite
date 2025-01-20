
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads"); // Thư mục lưu ảnh
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file theo timestamp
    }
});

const uploadSingleImage = multer({ storage }).single("image");

module.exports = { uploadSingleImage };
