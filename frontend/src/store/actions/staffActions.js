import actionTypes from './actionTypes';

export const addStaffSuccess = () => ({
    type: actionTypes.ADD_STAFF_SUCCESS
})

export const staffLoginSuccess = (staffInfor) => ({

    type: actionTypes.STAFF_LOGIN_SUCCESS,
    staffInfor: staffInfor,
})

export const staffLoginFail = () => ({
    type: actionTypes.STAFF_LOGIN_FAIL
})

export const processLogout = () => ({
    type: actionTypes.PROCESS_LOGOUT
})