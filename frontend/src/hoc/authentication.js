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


export const staffIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => state.staff.isLoggedIn,  // Kiểm tra trạng thái đăng nhập của quản lý
    wrapperDisplayName: 'StaffIsAuthenticated',  // Tên hiển thị cho HOC
    redirectPath: '/staff-login'  // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
});

export const staffIsNotAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => !state.staff.isLoggedIn,  // Kiểm tra nếu quản lý chưa đăng nhập
    wrapperDisplayName: 'StaffIsNotAuthenticated',  // Tên hiển thị cho HOC
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/account-information',  // Chuyển hướng về trang trước nếu có, hoặc trang chủ của quản lý
    allowRedirectBack: false  // Không cho phép quay lại trang trước nếu đã đăng nhập
});
