import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import './Purchase.scss';

import ModalDetailOrder from './ModalDetailOrder';

import {
    getOrderByCustomerIdStatus,
    updateOrderStatus,
} from '../../services/orderService';

class Purchase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orders: [],  // Danh sách đơn hàng
            isOpenDetailModal: false,
            orderEdit: {},
        };
    }

    componentDidMount() {
        this.fetchOrders();  // Gọi API khi component được tải
    }

    // Hàm lấy đơn hàng theo trạng thái
    fetchOrders = async () => {
        const { customerId } = this.props;  // Lấy customerId từ redux

        try {
            let response = await getOrderByCustomerIdStatus(customerId, 'pending');  // Lấy danh sách đơn hàng của người dùng với trạng thái "pending"
            if (response && response.errCode === 0) {
                this.setState({
                    orders: response.orders,  // Lưu danh sách đơn hàng vào state
                });
            } else {
                console.error('Failed to fetch orders:', response.errMessage);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Hàm lọc đơn hàng theo trạng thái
    handleFilterStatus = async (e) => {
        const status = e.target.value;
        console.log('Selected status:', status);
        const { customerId } = this.props;  // Lấy customerId từ redux

        let response = await getOrderByCustomerIdStatus(customerId, status);
        if (response && response.errCode === 0) {
            this.setState({
                orders: response.orders,  // Đảm bảo trả về đúng trường `orders` từ API
            });
        } else {
            console.error('Error fetching orders:', response.errMessage);
        }
    };

    handleConfirmOrder = async (order) => {
        try {
            console.log('order:', order);
            let res = await updateOrderStatus(order.id, 'completed');  // Cập nhật trạng thái đơn hàng thành 'completed'

            if (res && res.errCode === 0) {
                await this.fetchOrders();
            } else {
                alert(res.errMessage);
            }
        } catch (e) {
            console.log(e);
        }
    };

    handleCancelOrder = async (order) => {
        try {
            let res = await updateOrderStatus(order.id, 'cancelled');  // Cập nhật trạng thái đơn hàng thành 'cancelled'

            if (res && res.errCode === 0) {
                await this.fetchOrders();
            } else {
                alert(res.errMessage);
            }
        } catch (e) {
            console.log(e);
        }
    };

    toggleModal = () => {
        this.setState(prevState => ({
            isOpenDetailModal: !prevState.isOpenDetailModal,
        }));
    };


    handleViewDetail = (order) => {
        console.log('View Order Detail:', order);

        this.setState({
            isOpenDetailModal: true,
            orderEdit: order,
        }, () => {
        });
    };

    render() {
        const { orders } = this.state;

        return (
            <div className="profile-container">



                {this.state.isOpenDetailModal &&
                    <ModalDetailOrder
                        isOpenDetailModal={this.state.isOpenDetailModal}
                        toggle={this.toggleModal}
                        currentOrder={this.state.orderEdit}
                    // doEditProduct={this.doEditProduct}
                    />
                }


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
                    <h2>History Purchase</h2>

                    <div className="search-filter">
                        <select className="status-filter" onChange={this.handleFilterStatus}>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {orders.length > 0 ? (
                        <table className="information-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Total Amount</th>
                                    <th>Payment method</th>
                                    <th>Shipping Address</th>
                                    <th>Order Date</th>
                                    <th>Status</th>
                                    {/* Chỉ hiển thị cột Confirm Status khi trạng thái là "shipped" */}
                                    {orders.some(order => order.status === 'shipped') && <th>Receive Order</th>}
                                    {orders.some(order => order.status === 'pending') && <th>Cancel</th>}
                                    <th>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={index}>
                                        <td>{order.id}</td>
                                        <td>{order.totalAmount}</td>
                                        <td>{order.paymentMethod}</td>
                                        <td>{order.shippingAddress}</td>
                                        <td>{moment(order.orderDate).format('DD/MM/YYYY')}</td>
                                        <td>{order.status}</td>

                                        {/* Chỉ hiển thị nút Confirm khi trạng thái là "shipped" */}
                                        {order.status === 'shipped' && (
                                            <td>
                                                <button className="btn-confirm"
                                                    onClick={() => this.handleConfirmOrder(order)}>
                                                    Confirm
                                                </button>
                                            </td>
                                        )}

                                        {/* Chỉ hiển thị nút Cancel khi trạng thái là "pending" */}
                                        {order.status === 'pending' && (
                                            <td>
                                                <button className="btn-cancel"
                                                    onClick={() => this.handleCancelOrder(order)}>
                                                    Cancel
                                                </button>
                                            </td>
                                        )}

                                        <td>
                                            <button className="btn-edit">
                                                <i className="fa-solid fa-pen-to-square"
                                                    onClick={() => this.handleViewDetail(order)}
                                                ></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No orders found.</p>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        customerId: state.customer.id,  // Lấy customerId từ Redux
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Purchase);
