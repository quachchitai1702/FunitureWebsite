import axios from '../axios';

const handleLoginApi = (email, password) => {
    return axios.post('/api/login', { email, password })
}

const getAllCustomers = (inputId) => {
    //template string
    return axios.get(`/api/get-all-customers?id=${inputId}`);
}

export { handleLoginApi, getAllCustomers }
