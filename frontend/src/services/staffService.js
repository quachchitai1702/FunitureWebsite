import axios from '../axios';

const handleStaffLoginApi = (email, password) => {
    return axios.post('/api/staff-login', { email, password })
}

const getAllStaffs = (inputId, status, searchQuery) => {
    return axios.get(`/api/get-all-staffs`, {
        params: {
            id: inputId,
            status: status,
            searchQuery: searchQuery
        }
    });
}



const createNewStaffService = (data) => {
    console.log('check data from service: ', data)
    return axios.post('/api/create-new-staff', data);
};

const deleteStaffService = (staffId) => {
    return axios.delete('/api/delete-staff', {
        data: {
            id: staffId
        }
    })
}

const editStaffService = (inputData) => {
    console.log('Data to send:', inputData);

    return axios.put('/api/edit-staff', {
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

// const editStaffService = (inputData) => {
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

//     return axios.put('/api/edit-staff', formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data',
//         },
//     });
// };




export {
    handleStaffLoginApi,
    getAllStaffs,
    createNewStaffService,
    deleteStaffService,
    editStaffService,
}
