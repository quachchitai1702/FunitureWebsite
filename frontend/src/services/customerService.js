import axios from '../axios';

const handleLoginApi = (email, password) => {
    return axios.post('/api/login', { email, password })
}

const getAllCustomers = (inputId) => {
    return axios.get(`/api/get-all-customers?id=${inputId}`);

    // return axios.get(`/api/get-all-customers`, {
    //     params: {
    //         query: query,
    //         status: status
    //     }
    // });
}


export { handleLoginApi, getAllCustomers }
