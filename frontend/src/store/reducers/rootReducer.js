import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import appReducer from "./appReducer";
import customerReducer from "./customerReducer";
import staffReducer from "./staffReducer";


import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persistCommonConfig = {
    storage: storage,
    stateReconciler: autoMergeLevel2,
};


const customerPersistConfig = {
    ...persistCommonConfig,
    key: 'customer',
    whitelist: ['isLoggedIn', 'customerInfor']
};

const staffPersistConfig = {
    ...persistCommonConfig,
    key: 'staff',
    whitelist: ['isLoggedIn', 'staffInfor'],
};

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    customer: persistReducer(customerPersistConfig, customerReducer),
    staff: persistReducer(staffPersistConfig, staffReducer),

    app: appReducer
});


export default rootReducer;
