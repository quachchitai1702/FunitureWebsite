import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Setting.scss';
import * as actions from "../../store/actions";


class Setting extends Component {

    state = {
        // Add any necessary state here
    }

    componentDidMount() {
        // Handle logic when the component mounts
    }

    // Handle Logout logic
    handleLogout = () => {
        this.props.processLogout();
        this.props.history.push('/login');
    };

    // Handle Change Password logic
    handleChangePassword = () => {
        // Redirect to the change password page or open a modal
        console.log('Changing password...');
    }

    render() {
        return (
            <div className="profile-container">

                {/* Left Side - Menu */}
                <div className="profile-left">
                    <h3>Dashboard</h3>
                    <ul>
                        <li><a href="/storesystem/profile"><i className="fas fa-user"></i> Profile</a></li>
                        <li><a href="/storesystem/profile/purchase"><i className="fas fa-shopping-cart"></i> Purchase</a></li>
                        <li><a href="/storesystem/profile/address"><i className="fas fa-map-marker-alt"></i> Address</a></li>
                        <li><a href="/storesystem/profile/setting"><i className="fas fa-cog"></i> Setting</a></li>
                    </ul>
                </div>

                {/* Right Side - User Information */}
                <div className="profile-right">
                    <h2>Setting</h2>

                    <div className="button-container">
                        <button className="change-password-btn" onClick={this.handleChangePassword}>
                            <i className="fas fa-key"></i> Change Password
                        </button>
                        <button className="logout-btn" onClick={this.handleLogout}>
                            <i className="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
