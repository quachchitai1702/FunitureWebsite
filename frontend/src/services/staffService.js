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
        imageUrl: inputData.imageUrl,
        status: inputData.status,
    });
};



export {
    handleStaffLoginApi,
    getAllStaffs,
    createNewStaffService,
    deleteStaffService,
    editStaffService,
}
