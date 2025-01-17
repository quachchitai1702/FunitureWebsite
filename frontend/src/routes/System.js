import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import CustomerManage from '../containers/System/CustomerManage';
import StaffManage from '../containers/System/StaffManage';
import CategoryManage from '../containers/System/CategoryManage';
import OrderManage from '../containers/System/OrderManage';
import Analytic from '../containers/System/Analytic';
import AccountInformation from '../containers/System/AccountInformation';
import ProductManage from '../containers/System/ProductManage';
import RegisterPackageGroupOrAcc from '../containers/System/RegisterPackageGroupOrAcc';

class System extends Component {
    render() {
        const { systemMenuPath } = this.props;
        return (
            <div className="system-container">
                <div className="system-list">
                    <Switch>
                        <Route path="/system/customer-manage" component={CustomerManage} />
                        <Route path="/system/staff-manage" component={StaffManage} />
                        <Route path="/system/category-manage" component={CategoryManage} />
                        <Route path="/system/order-manage" component={OrderManage} />
                        <Route path="/system/analytic" component={Analytic} />
                        <Route path="/system/account-information" component={AccountInformation} />
                        <Route path="/system/product-manage" component={ProductManage} />
                        <Route path="/system/register-package-group-or-account" component={RegisterPackageGroupOrAcc} />
                        <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                    </Switch>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
