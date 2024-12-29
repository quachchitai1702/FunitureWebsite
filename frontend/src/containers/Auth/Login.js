import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import image1 from '../../assets/Image/signin.png';
import logo3 from '../../assets/logo/logo3.png';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
        };
    }

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    handleLogin = (event) => {
        event.preventDefault();
        console.log('username: ', this.state.username, 'password: ', this.state.password);
        console.log('all state: ', this.state);
    }

    render() {
        //JSX
        return (
            <div className="page-container">
                <div className='header'>
                    <div className='header-container'>
                        <img className="logo" src={logo3} alt="Logo" />
                        <span className="website-name">HARMONI DECOR</span>

                    </div>
                </div>

                <div className='body'>
                    <div className='body-container'>
                        <div className="image-container">
                            <img src={image1} alt="Login Illustration" className="login-image" />
                        </div>
                        <div className="login-form-container">
                            <div className='text-36'>Sign In</div>
                            <form className="login-form">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="input-field"
                                    value={this.state.username}
                                    onChange={(event) => this.handleOnChangeUsername(event)}
                                />
                                <div className='password-container' >
                                    <input
                                        className='input-field-password'
                                        type={this.state.isShowPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        onChange={(event) => this.handleOnChangePassword(event)}
                                        autoComplete='current-password'
                                    />

                                    <span
                                        onClick={() => { this.handleShowHidePassword() }}
                                    >
                                        <i className={this.state.isShowPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}></i>
                                    </span>

                                </div>

                                <a href='#' className='forgotpassword'>Forgot pasword? </a>
                                <button
                                    type="submit"
                                    className="login-btn" onClick={(event) => this.handleLogin(event)} >Sign In</button>
                                <div className='text-16'>or</div>
                                <button
                                    type="submit"
                                    className="google-btn">
                                    <i className="fa-brands fa-google "></i>
                                    <span className='text'>Sign in with Google</span>

                                </button>
                                <div>

                                </div>
                                <div className="signup-container">
                                    <p>
                                        <span>Don't have an account? </span>
                                        <button onClick={this.handleSignup} className="signup-btn">Signup</button>
                                    </p>
                                </div>
                            </form>
                        </div>

                    </div>
                    <div className='space-50px'></div>

                </div >


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

            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        adminLoginSuccess: (adminInfo) => dispatch(actions.adminLoginSuccess(adminInfo)),
        adminLoginFail: () => dispatch(actions.adminLoginFail()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
