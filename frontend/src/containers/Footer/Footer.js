import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";

import './Footer.scss';

import logo3 from '../../assets/logo/logo3.png';


class Footer extends Component {

    render() {
        const { processLogout } = this.props;

        return (
            <div className="footer">
                <div className="footer-container">
                    <div className="footer-r1">
                        <div className='r1'>
                            <img className="logo" src={logo3} alt="Logo" />
                            <span className="website-name">HARMONI DECOR</span>

                        </div>
                        <div className='r2'>
                            <div className='left-footer'>
                                <span>PRODUCTS</span>
                                <span>BLOG</span>
                                <span>ABOUT</span>
                                <span>CONTACTS</span>

                            </div>
                        </div>
                    </div>
                    <div className="footer-r2">
                        <div className="website-description">
                            We are a furniture store dedicated to helping you craft spaces
                            that are not only beautiful but also balanced and harmonious.
                        </div>
                    </div>
                    <div className="footer-r3">
                        <hr className="footer-line" />
                    </div>
                    <div className="footer-r4">
                        <span className="footer-text">© 2024 Harmoni Decor - All Rights Reserved</span>
                    </div>
                </div>
            </div>

        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.customer.isLoggedIn,
        isLoggedIn: state.staff.isLoggedIn

    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
