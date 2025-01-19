import axios from '../axios';


const createOrder = (customerId, paymentMethod) => {
    // console.log('check data from service: ', id);
    return axios.post('/api/create-order', {
        data: {
            id: customerId,
            paymentMethod: paymentMethod
        }
    });
};

const getOrderByCustomerIdStatus = (customerId, status) => {
    console.log('check data from service: ', { customerId, status });
    return axios.get('/api/get-order-by-customerID-status', {
        params: {
            customerId: customerId,
            status: status
        }
    });
}

const updateOrderStatus = (orderId, newStatus) => {
    return axios.put('/api/update-order-status', {
        orderId,  // Truyền orderId và newStatus vào phần thân
        newStatus
    });
};

const deleteOrder = (orderId) => {
    return axios.delete('/api/delete-order', {
        params: { orderId }  // Truyền orderId qua query params
    });
};





export {
    createOrder,
    getOrderByCustomerIdStatus,
    updateOrderStatus,
    deleteOrder,
}
