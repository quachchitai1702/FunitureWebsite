import axios from '../axios';


const createProduct = (data) => {
    console.log('check data from service: ', data)
    return axios.post('/apit/create-products', data);
}

const getAllProducts = (inputId, status, searchQuery) => {
    return axios.get(`/api/get-all-products`, {
        params: {
            id: inputId,
            status: status,
            searchQuery: searchQuery
        }
    });
}

const updateProduct = (data) => {
    console.log('Dữ liệu gửi đi từ client:', data);

    return axios.put('/api/update-products', data);
}

const deleteProduct = (id) => {
    console.log('check data from service: ', id);
    return axios.delete('/api/delete-products', { data: { id } });
};


const getCartByCustomerId = async (customerId) => {
    console.log('check data from service: ', customerId);

    // Sử dụng params trong axios để truyền tham số
    return axios.get('/api/get-cart-by-customerId', {
        params: {
            customerId: customerId
        }
    });
};



const addProductToCart = async (customerId, productId, quantity) => {
    console.log('check data from service: ', customerId, productId, quantity);
    return axios.post('/api/add-product-to-cart', {

        customerId: customerId,
        productId: productId,
        quantity: quantity


    });
}


const updateCartDetail = async (cartDetailId, newQuantity) => {
    // console.log('check data from service: ', id);
    return axios.post('/api/update-cart-detail', {
        params: {
            cartDetailId: cartDetailId,
            newQuantity: newQuantity
        }
    });
}

const removeProductFromCart = async (cartDetailId) => {
    // console.log('check data from service: ', id);
    return axios.post('/api/remove-product-from-cart', {
        params: {
            cartDetailId: cartDetailId
        }
    });
}



export {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getCartByCustomerId,
    addProductToCart,
    updateCartDetail,
    removeProductFromCart,
}
