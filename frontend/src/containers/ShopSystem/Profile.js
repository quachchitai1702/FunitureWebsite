import React, { Component } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom'; // Thêm useHistory
import * as actions from "../../store/actions";
import {
    getAllCustomers,
    editCustomerService
} from '../../services/customerService';
import './Profile.scss';

import ModalEditProfile from './ModalEditProfile';
import { emitter } from '../../utils/emitter';


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            customerInfor: '',
        };
    }

    // Hàm xử lý khi click vào một mục
    handleOptionClick = (index) => {
        this.setState({ selectedOption: index });
    };

    componentDidMount() {
        const { customerInfor } = this.props;
        if (customerInfor && customerInfor.id) {
            this.fetchCustomerData(customerInfor.id);
        }
    }

    fetchCustomerData = async (customerId) => {
        try {
            const response = await getAllCustomers(customerId);
            console.log('customer: ', response)

            if (response && response.errCode === 0) {
                this.setState({
                    customerInfor: response, // Giả sử response trả về có key `data`
                });
            } else {
                console.error('Failed to fetch customer data:', response?.errMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    // handleLogout = () => {
    //     this.props.processLogout(); // Gọi logout action
    //     this.props.history.push('/login'); // Điều hướng về trang đăng nhập
    // };

    toggleEditModal = () => {
        this.setState(prevState => ({
            isModalOpen: !prevState.isModalOpen,

        }));
    };


    handleEditCustomer = (customer) => {
        console.log('customer: ', customer);
        this.setState({
            isModalOpen: true,
            customerInfor: customer,
        })

    }

    doEditCustomer = async (customer) => {
        try {
            let res = await editCustomerService(customer);
            if (res && res.errCode === 0) {
                this.setState({
                    isModalOpen: false
                });

                // Lấy lại dữ liệu người dùng sau khi sửa
                await this.fetchCustomerData(customer.id);
            } else {
                alert(res.errMessage);
            }
        } catch (e) {
            console.log(e)
        }
    }


    render() {
        const { customerInfor, isModalOpen } = this.state;

        return (

            <div className="profile-container">

                {
                    this.state.isModalOpen &&
                    <ModalEditProfile
                        isOpen={this.state.isModalOpen}
                        toggle={this.toggleEditModal}
                        currentCustomer={this.state.customerInfor.customers}
                        editCustomer={this.doEditCustomer}
                    />
                }



                {/* Left Side - Menu */}
                <div className="profile-left">
                    <h3>Dashboard</h3>
                    <ul>
                        <li><a href="/storesystem/profile"><i class="fas fa-user"></i> Profile</a></li>
                        <li><a href="/storesystem/profile/purchase"><i class="fas fa-shopping-cart"></i> Purchase</a></li>
                        <li><a href="/storesystem/profile/address"><i class="fas fa-map-marker-alt"></i> Address</a></li>
                        <li><a href="/storesystem/profile/setting"><i class="fas fa-cog"></i> Setting</a></li>
                    </ul>
                    {/* <button className="logout-btn" onClick={this.handleLogout}>Logout</button> */}
                </div>

                {/* Right Side - User Information */}
                <div className="profile-right">
                    <h2>User Profile</h2>
                    {customerInfor ? (
                        <div className="customer-infor">
                            <p><strong>Name:</strong> {customerInfor?.customers?.name || 'N/A'}</p>
                            <p><strong>Email:</strong> {customerInfor?.customers?.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {customerInfor?.customers?.phone || 'N/A'}</p>
                            <p><strong>Address:</strong> {customerInfor?.customers?.address || 'N/A'}</p>
                        </div>
                    ) : (
                        <p>Loading user data...</p>
                    )}

                    <button className="edit-btn" onClick={() => this.handleEditCustomer(customerInfor)}>Edit</button>

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        customerInfor: state.customer.customerInfor
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
