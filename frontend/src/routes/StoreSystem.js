import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import About from '../containers/ShopSystem/About';
import Address from '../containers/ShopSystem/Address';
import Cart from '../containers/ShopSystem/Cart';
import Home from '../containers/ShopSystem/Home';
import Profile from '../containers/ShopSystem/Profile';
import Purchase from '../containers/ShopSystem/Purchase';
import Setting from '../containers/ShopSystem/Setting';
import Shop from '../containers/ShopSystem/Shop';
import RegisterPackageGroupOrAcc from '../containers/ShopSystem/RegisterPackageGroupOrAcc';

class StoreSystem extends Component {
    render() {
        const { systemMenuPath } = this.props;
        return (
            <div className="system-container">
                <div className="system-list">
                    <Switch>
                        {/* Các route cho trang chính */}
                        <Route path="/storesystem/home" component={Home} />
                        <Route path="/storesystem/about" component={About} />
                        <Route path="/storesystem/cart" component={Cart} />
                        <Route path="/storesystem/shop" component={Shop} />
                        <Route path="/storesystem/register-package-group-or-account" component={RegisterPackageGroupOrAcc} />

                        {/* Route cho các trang con của Profile */}
                        <Route exact path="/storesystem/profile" component={Profile} />
                        <Route exact path="/storesystem/profile/purchase" component={Purchase} />
                        <Route exact path="/storesystem/profile/address" component={Address} />
                        <Route exact path="/storesystem/profile/setting" component={Setting} />

                        {/* Redirect nếu không tìm thấy route */}
                        <Route component={() => <Redirect to={systemMenuPath} />} />
                    </Switch>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath || '/' // Kiểm tra xem giá trị mặc định có hợp lý không
    };
};




const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreSystem);
