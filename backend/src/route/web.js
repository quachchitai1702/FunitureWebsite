import express from "express";
import homeController from "../controllers/homeController";

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