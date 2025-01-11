import actionTypes from './actionTypes';

export const addCustomerSuccess = () => ({
    type: actionTypes.ADD_CUSTOMER_SUCCESS
})

export const customerLoginSuccess = (customerInfor) => ({

    type: actionTypes.CUSTOMER_LOGIN_SUCCESS,
    customerInfor: customerInfor,
})

export const customerLoginFail = () => ({
    type: actionTypes.CUSTOMER_LOGIN_FAIL
})

export const processLogout = () => ({
    type: actionTypes.PROCESS_LOGOUT
})