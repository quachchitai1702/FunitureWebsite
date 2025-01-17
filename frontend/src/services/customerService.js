import axios from '../axios';

const handleLoginApi = (email, password) => {
    return axios.post('/api/login', { email, password })
}

const getAllCustomers = (inputId, status, searchQuery) => {
    return axios.get(`/api/get-all-customers`, {
        params: {
            id: inputId,
            status: status,
            searchQuery: searchQuery
        }
    });
}



const createNewCustomerService = (data) => {
    console.log('check data from service: ', data)
    return axios.post('/api/create-new-customer', data);
};

const deleteCustomerService = (customerId) => {
    return axios.delete('/api/delete-customer', {
        data: {
            id: customerId
        }
    })
}

const editCustomerService = (inputData) => {
    console.log('Data to send:', inputData);

    return axios.put('/api/edit-customer', {
        id: inputData.id,
        email: inputData.email,
        password: inputData.password,
        name: inputData.name,
        phone: inputData.phone,
        address: inputData.address,
        imageUrl: inputData.imageUrl,
        status: inputData.status,
    });
};



export {
    handleLoginApi,
    getAllCustomers,
    createNewCustomerService,
    deleteCustomerService,
    editCustomerService,
}
