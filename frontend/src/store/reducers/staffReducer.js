import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    staffInfor: null
}

const staffReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.STAFF_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                staffInfor: action.staffInfor,
            }
        case actionTypes.STAFF_LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                staffInfor: null
            }
        case actionTypes.PROCESS_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                staffInfor: null
            }
        default:
            return state;
    }
}

export default staffReducer;