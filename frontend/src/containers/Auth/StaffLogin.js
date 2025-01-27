import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './StaffLogin.scss';

// import { FormattedMessage } from 'react-intl';
import image1 from '../../assets/Image/signin.png';
import logo3 from '../../assets/logo/logo3.png';
import { handleStaffLoginApi } from '../../services/staffService';

class StaffLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isShowPassword: false,
            errMessage: '',
        };
    }


    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
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

    handleStaffLogin = async (event) => {
        this.setState({
            errMessage: '',
        })
        event.preventDefault();
        // console.log('email: ', this.state.email, 'password: ', this.state.password);
        // console.log('all state: ', this.state);
        try {
            let data = await handleStaffLoginApi(this.state.email, this.state.password)

            // console.log('API response:', data);

            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.errMessage,
                })
            }

            if (data && data.errCode === 0) {
                this.props.staffLoginSuccess(data.staff);
                this.props.navigate('/system/account-information');
            }


        } catch (e) {
            if (e.response) {
                if (e.response.data) {
                    this.setState({
                        errMessage: e.response.data.errMessage,
                    })
                }
            }
        }
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
                            <img src={image1} alt="StaffLogin Illustration" className="stafflogin-image" />
                        </div>
                        <div className="login-form-container">
                            <div className='text-36'>Staff Sign In</div>
                            <form className="login-form">
                                <input
                                    type="email"
                                    placeholder="email"
                                    className="input-field"
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeEmail(event)}
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

                                <div>
                                    {/* Thêm dòng hiển thị thông báo lỗi dưới trường mật khẩu */}

                                    {this.state.errMessage && (
                                        <div style={{ color: 'red', marginTop: '10px' }}>
                                            {this.state.errMessage}
                                        </div>
                                    )}
                                </div>


                                <button className='forgotpassword'>Forgot pasword? </button>

                                <button
                                    type="submit"
                                    className="login-btn" onClick={(event) => this.handleStaffLogin(event)} >Sign In</button>
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



const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        staffLoginSuccess: (staffInfor) => dispatch(actions.staffLoginSuccess(staffInfor)),
    };
};


const mapStateToProps = (state) => {
    // console.log('Redux state:', state); // Di chuyển console.log vào đây
    return {
        language: state.app.language,
        isLoggedIn: state.staff.isLoggedIn,  // Đảm bảo lấy được giá trị isLoggedIn
        // staffInfor: state.app.staffInfor,  // Lấy staffInfor từ state
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffLogin);
