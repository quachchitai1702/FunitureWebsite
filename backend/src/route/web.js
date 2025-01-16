import express from "express";
import homeController from "../controllers/homeController";
import customerController from "../controllers/customerController.js";
import staffController from "../controllers/staffController.js";
import categoryController from "../controllers/categoryController.js";
import productController from "../controllers/productController.js";



let router = express.Router();

let initWebRoute = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);


    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);

    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    //customer 

    router.post('/api/login', customerController.handleLogin);
    router.get('/api/get-all-customers', customerController.handleGetAllCustomer);

    router.post('/api/create-new-customer', customerController.handleCreateNewCustomer);
    router.put('/api/edit-customer', customerController.handleEditCustomer);
    router.delete('/api/delete-customer', customerController.handleDeleteCustomer);

    //staff

    router.post('/api/staff-login', staffController.handleStaffLogin);
    router.get('/api/get-all-staffs', staffController.handleGetAllStaff);
    router.post('/api/create-new-staff', staffController.handleCreateNewStaff);
    router.put('/api/edit-staff', staffController.handleEditStaff);
    router.delete('/api/delete-staff', staffController.handleDeleteStaff);

    //category
    router.post("/api/create-new-categories", categoryController.handleCreateCategory);
    router.get("/api/get-all-categories", categoryController.handleGetAllCategories);
    router.get("/api/get-categories-by-search", categoryController.handleGetCategoriesBySearch);
    router.put("/api/edit-categories", categoryController.handelUpdateCategory);
    router.delete("/api/delete-categories", categoryController.handelDeleteCategory);


    //product
    router.post('/apit/create-products', productController.handleCreateProduct);
    router.get('/api/get-all-products', productController.handleGetAllProducts);
    router.put('/api/update-products', productController.handleUpdateProduct);
    router.delete('/api/delete-products', productController.handleDeleteProduct);

    //rest API
    return app.use('/', router);
}

module.exports = initWebRoute;