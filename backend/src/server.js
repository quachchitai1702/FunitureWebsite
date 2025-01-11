import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import multer from "multer";
import cors from 'cors';
require('dotenv').config();

let app = express();
app.use(cors({ credentials: true, origin: true }));

// Cấu hình multer để xử lý tệp upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../uploads'); // Thư mục lưu trữ tệp tin
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Đổi tên tệp để không trùng
    }
});
const upload = multer({ storage: storage });

// Cho phép truy cập file tĩnh từ thư mục src/uploads
app.use('/uploads', express.static('src/uploads'));



//config app

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

viewEngine(app);
initWebRoutes(app);

connectDB();



let port = process.env.PORT || 8080;
//Port == underfined => prot = 8080

app.listen(port, () => {
    //callback
    console.log("Backend Nodejs is running on the port : " + port)
})

