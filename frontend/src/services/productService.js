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



export {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
}
