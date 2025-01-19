import React, { Component } from 'react';
import { connect } from 'react-redux';
import Navigator from '../../components/Navigator';
import { storeMenu } from './storeApp';
import { Link } from 'react-router-dom';

import './StoreHeader.scss';
import logo3 from '../../assets/logo/logo3.png';

class StoreHeader extends Component {
    render() {
        return (
            <div className='header'>
                <div className='header-container'>
                    {/* Logo bên trái */}
                    <div className='logo-container'>
                        <img className="logo" src={logo3} alt="Logo" />
                        <span className="website-name">HARMONI DECOR</span>
                    </div>

                    {/* Thanh điều hướng chính */}
                    <div className="header-tabs-container">
                        <Navigator menus={storeMenu} />
                    </div>

                    {/* Giỏ hàng và thông tin người dùng */}
                    <div className="user-cart-container">
                        <Link to="/storesystem/profile/purchase" className="menu-link">
                            <i className="fas fa-shopping-cart" />
                        </Link>
                        <Link to="/storesystem/profile" className="menu-link">
                            <i className="fas fa-user" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.staff.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreHeader);
