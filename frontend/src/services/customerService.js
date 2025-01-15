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


export { handleLoginApi, getAllCustomers, createNewCustomerService, deleteCustomerService }
