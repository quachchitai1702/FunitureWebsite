import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './StaffNavigator.scss';
import { connect } from 'react-redux';  // Kết nối với Redux
import * as actions from "../store/actions";

class StaffNavigator extends Component {

    render() {
        const { menus, onLinkClick, processLogout } = this.props;
        return (
            <Fragment>


                <ul className="staff-navigator-menu list-unstyled">
                    {
                        menus.map((menuGroup, groupIndex) => (
                            <Fragment key={groupIndex}>
                                <li className="menu-group">
                                    <ul className="menu-list">
                                        {menuGroup.menus.map((menu, menuIndex) => (
                                            <li key={menuIndex} className="menu-item">
                                                <Link
                                                    to={menu.link}
                                                    className="menu-link"
                                                    onClick={onLinkClick}
                                                >
                                                    <i className={menu.icon}></i>
                                                    <FormattedMessage id={menu.name} />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                <div className="btn btn-logout" onClick={processLogout}>
                                    <i className="fas fa-sign-out-alt"></i>
                                    <span>Logout</span>
                                </div>
                            </Fragment>
                        ))
                    }
                </ul>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        // user: state.customer.user,  // Đảm bảo truyền thông tin user vào props nếu cần

        isLoggedIn: state.customer.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffNavigator);