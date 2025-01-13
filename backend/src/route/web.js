import express from "express";
import homeController from "../controllers/homeController";
import customerController from "../controllers/customerController.js";


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

    router.post('/api/login', customerController.handleLogin);
    router.get('/api/get-all-customers', customerController.handleGetAllCustomer);

    router.post('/api/create-new-customer', customerController.handleCreateNewCustomer);
    router.put('/api/edit-customer', customerController.handleEditCustomer);
    router.delete('/api/delete-customer', customerController.handleDeleteCustomer);


    //rest API
    return app.use('/', router);
}

module.exports = initWebRoute;