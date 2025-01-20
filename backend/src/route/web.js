import express from "express";
import homeController from "../controllers/homeController";
import customerController from "../controllers/customerController.js";
import staffController from "../controllers/staffController.js";
import categoryController from "../controllers/categoryController.js";
import productController from "../controllers/productController.js";
import cartController from "../controllers/cartController.js";
import paymentController from "../controllers/paymentController.js";
import orderController from "../controllers/orderController.js";





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
    router.put("/api/edit-categories", categoryController.handelUpdateCategory);
    router.delete("/api/delete-categories", categoryController.handelDeleteCategory);


    //product
    router.post('/apit/create-products', productController.handleCreateProduct);
    router.get('/api/get-all-products', productController.handleGetAllProducts);
    router.put('/api/update-products', productController.handleUpdateProduct);
    router.delete('/api/delete-products', productController.handleDeleteProduct);

    //cart
    router.post('/api/create-cart', cartController.handleCreateCart);
    router.get('/api/get-cart-by-customerId', cartController.handleGetCartByCustomerId);
    router.delete('/api/delete-cart', cartController.handleDeleteCart);

    //cart details
    router.post('/api/add-product-to-cart', cartController.handleAddProductToCart);
    router.put('/api/update-cart-detail', cartController.handleUpdateCartDetail);
    router.delete('/api/remove-product-from-cart', cartController.handleRemoveProductFromCart);

    //payment method
    router.post('/api/create-payment-method', paymentController.handleCreatePaymentMethod);
    router.get('/api/get-payment-method', paymentController.handleGetPaymentMethods);
    router.delete('/api/delete-payment-method', paymentController.handleDeletePaymentMethod);


    //order
    router.post('/api/create-order', orderController.handleCreateOrder);
    router.get('/api/get-order-by-customerID-status', orderController.handleGetOrderByCustomerIdStatus);
    router.put('/api/update-order-status', orderController.handleUpdateOrderStatus);
    router.delete('/api/delete-order', orderController.handleDeleteOrder);



    //rest API
    return app.use('/', router);
}

module.exports = initWebRoute;