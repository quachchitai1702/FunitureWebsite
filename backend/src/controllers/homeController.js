import { col } from 'sequelize';
import db from '../models/index';
import CRUDServices from '../services/CRUDServices';



let getHomePage = async (req, res) => {
    try {
        let data = await db.Customer.findAll();
        console.log('..................');
        console.log(data);
        console.log('..................');
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e)
    }

}

let getAboutPage = (req, res) => {
    return res.render('about.ejs');

}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}


let postCRUD = async (req, res) => {
    try {
        let message = await CRUDServices.createNewCustomer(req.body);
        console.log(message);
        return res.send('Post CRUD from server');
    } catch (error) {
        console.error("Error in postCRUD:", error);
        return res.status(500).send('Something went wrong!');
    }
};




module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
}