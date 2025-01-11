import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    customerInfor: null
}

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CUSTOMER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                customerInfor: action.customerInfor,
            }
        case actionTypes.CUSTOMER_LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                customerInfor: null
            }
        case actionTypes.PROCESS_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                customerInfor: null
            }
        default:
            return state;
    }
}

export default customerReducer;