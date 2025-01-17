import React, { Component } from 'react';
import { connect } from 'react-redux';

// Điều hướng
import StaffNavigator from '../../components/StaffNavigator';

// Header
import { adminMenu } from '../Header/menuApp';

// SCSS
import './AccountInformation.scss';

class AccountInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedOption: null,
        };
    }

    // Hàm xử lý khi click vào một mục
    handleOptionClick = (index) => {
        this.setState({ selectedOption: index });
    };

    render() {
        const { isLoggedIn, staffInfo } = this.props;

        // Kiểm tra nếu staffInfo có dữ liệu hợp lệ
        const userInfo = staffInfo || {};
        const { name, id, role, email } = userInfo;

        return (
            <div className="page-container">
                <div className="body">
                    <div className="left-side">
                        <StaffNavigator menus={adminMenu} onLinkClick={this.handleOptionClick} />
                    </div>

                    <div className="right-side">

                        <div className="page-title">
                            <h1 className="title">Staff Profile</h1>
                            <h2 className="subtitle">Manage and protect your account</h2>
                        </div>

                        <div className='infor'>
                            {isLoggedIn ? (
                                <div className="user-info">
                                    <p><strong>Name:</strong> {name}</p>
                                    <p><strong>Role:</strong> {role}</p>
                                    <p><strong>Email:</strong> {email}</p>
                                </div>
                            ) : (
                                <p>You are not logged in.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.staff.isLoggedIn, // Kiểm tra trạng thái đăng nhập
        staffInfo: state.staff.staffInfor,  // Lấy thông tin người dùng từ Redux
    };
};

export default connect(mapStateToProps)(AccountInformation);
