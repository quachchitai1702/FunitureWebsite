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

// const editCustomerService = (inputData) => {
//     const formData = new FormData();
//     formData.append('id', inputData.id);
//     formData.append('email', inputData.email);
//     formData.append('password', inputData.password);
//     formData.append('name', inputData.name);
//     formData.append('phone', inputData.phone);
//     formData.append('address', inputData.address);
//     formData.append('status', inputData.status);

//     if (inputData.selectedFile) {
//         formData.append('imageUrl', inputData.selectedFile); // Đảm bảo tên trường là 'imageUrl'
//     }

//     console.log('data from frontend:', formData)

//     return axios.put('/api/edit-customer', formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data',
//         },
//     });
// };




export {
    handleLoginApi,
    getAllCustomers,
    createNewCustomerService,
    deleteCustomerService,
    editCustomerService,
}
