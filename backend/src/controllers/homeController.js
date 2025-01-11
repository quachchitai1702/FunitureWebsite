import { col } from 'sequelize';
import db from '../models/index';
import CRUDServices from '../services/CRUDServices';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { raw } from 'body-parser';

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer để lưu file vào thư mục 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  // Lưu vào thư mục uploads
    },
    filename: (req, file, cb) => {
        // Đổi tên tệp tin với timestamp
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


let getHomePage = async (req, res) => {
    try {
        let data = await db.Customer.findAll({
            include: [
                {
                    model: db.Account,
                    as: 'account',
                    attributes: ['email', 'password', 'role', 'status']
                }
            ]
        });
        console.log('..................');
        console.log(data);
        console.log('..................');


        console.log('Data received in createNewCustomer:', data);

        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }

}

let getAboutPage = (req, res) => {
    return res.render('about.ejs');

}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}


let postCRUD = async (req, res) => {
    // Sử dụng middleware upload để xử lý file upload từ form
    upload.single('imageUrl')(req, res, async (err) => {
        if (err) {
            console.error("Error in file upload:", err);
            return res.status(500).send('Something went wrong with file upload');
        }

        // Log dữ liệu gửi từ form (bao gồm file)
        console.log("Data received in postCRUD:", req.body);
        console.log("File uploaded:", req.file);

        try {
            let message = await CRUDServices.createNewCustomer(req.body);
            console.log(message);
            return res.send('Post CRUD from server');
        } catch (error) {
            console.error("Error in postCRUD:", error);
            return res.status(500).send('Something went wrong!');
        }
    });
};

let displayGetCRUD = async (req, res) => {
    let data = await CRUDServices.getAllCustomer({
        raw: true,
    });

    return res.render('displayCRUD.ejs', {
        dataTable: data,
    });

}


let getEditCRUD = async (req, res) => {
    let customerId = req.query.id;
    if (customerId) {
        let customerData = await CRUDServices.getCustomerInfoById(customerId);

        return res.render('editCRUD.ejs', {
            customer: customerData,
        });
    }
    else {
        return res.send('Customer ID is not found');
    }
}

let putCRUD = async (req, res) => {
    upload.single('imageUrl')(req, res, async (err) => {
        if (err) {
            console.error("Upload images error:", err);
            return res.status(500).send('Upload images errorn');
        }

        try {
            let data = {
                id: req.body.id, // Giả sử bạn gửi ID của khách hàng từ form
                name: req.body.name,
                address: req.body.address,
                phone: req.body.phone,
                imageUrl: req.file ? req.file.filename : null, // Lưu tên tệp tin đã tải lên
            };

            // Gọi hàm dịch vụ để cập nhật thông tin
            let allCustomers = await CRUDServices.updateCustomerInfo(data);

            return res.render('displayCRUD.ejs', {
                dataTable: allCustomers,
            });

        } catch (error) {
            console.error("Error putCRUD:", error);
            return res.status(500).send('Error!');
        }
    });
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDServices.deleteCustomerById(id);
        return res.send('Delete customer successfully!');
    }
    else {
        return res.send('Customer ID is not found');
    }
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}