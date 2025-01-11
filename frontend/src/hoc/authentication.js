import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";

const locationHelper = locationHelperBuilder({});

export const customerIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => state.customer.isLoggedIn,
    wrapperDisplayName: 'CustomerIsAuthenticated',
    redirectPath: '/login'
});

export const customerIsNotAuthenticated = connectedRouterRedirect({
    // Want to redirect the customer when they are authenticated
    authenticatedSelector: state => !state.customer.isLoggedIn,
    wrapperDisplayName: 'CustomerIsNotAuthenticated',
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
    allowRedirectBack: false
});