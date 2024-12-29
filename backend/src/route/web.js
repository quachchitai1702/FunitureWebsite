import express from "express";
import homeController from "../controllers/homeController";
// import multer from "multer";
// import path from "path";

// // Cấu hình multer để lưu ảnh vào thư mục uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './src/uploads');  // Lưu ảnh vào thư mục src/uploads
//     },
//     filename: (req, file, cb) => {
//         // Tạo tên file ảnh là timestamp + phần mở rộng
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });

// const upload = multer({ storage: storage });  // Khởi tạo multer với cấu hình trên

let router = express.Router();

let initWebRoute = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);

    // router.post('/post-crud', upload.single('imageUrl'), homeController.postCRUD);
    router.post('/post-crud', homeController.postCRUD);

    //rest API
    return app.use('/', router);
}

module.exports = initWebRoute;