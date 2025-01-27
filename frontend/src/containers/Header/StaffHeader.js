import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import StaffNavigator from '../../components/StaffNavigator';
import { adminMenu } from './menuApp';
import './StaffHeader.scss';

import logo3 from '../../assets/logo/logo3.png';


class StoreHeader extends Component {

    render() {
        const { processLogout } = this.props;

        return (
            <div className='header'>
                <div className='header-container'>
                    <img className="logo" src={logo3} alt="Logo" />
                    <span className="website-name">HARMONI DECOR</span>

                    {/* thanh navigator */}
                    <div className="header-tabs-container">
                        {/* <StaffNavigator menus={adminMenu} /> */}
                    </div>

                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout}>
                        <i className="fas fa-sign-out-alt"></i>
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
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreHeader);
