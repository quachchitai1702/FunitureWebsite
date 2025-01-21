import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';


class Address extends Component {

    state = {

    }

    componentDidMount() {
    }


    render() {
        // const { customerInfor, isModalOpen } = this.state;

        return (

            <div className="profile-container">



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
                    <h2>Address</h2>
                    {/* {customerInfor ? (
                        <div className="customer-infor">
                            <p><strong>Name:</strong> {customerInfor?.customers?.name || 'N/A'}</p>
                            <p><strong>Email:</strong> {customerInfor?.customers?.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {customerInfor?.customers?.phone || 'N/A'}</p>
                            <p><strong>Address:</strong> {customerInfor?.customers?.address || 'N/A'}</p>
                        </div>
                    ) : (
                        <p>Loading user data...</p>
                    )} */}

                    {/* <button className="edit-btn" onClick={() => this.handleEditCustomer(customerInfor)}>Edit</button> */}

                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Address);
