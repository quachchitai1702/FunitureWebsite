import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import moment from 'moment';


import ManageNavigator from '../../components/StaffNavigator';
import { adminMenu } from '../Header/menuApp';

import {
    createOrder,
    getOrderByCustomerIdStatus,
    updateOrderStatus,
    deleteOrder,
} from '../../services/orderService';

import ModalDetailOrder from './ModalDetailOrder';
import { emitter } from '../../utils/emitter';

import './OrderManage.scss';


class OrderManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrOders: [],
            isOpenDetailModal: false,
            orderEdit: {},


        }
    }


    async componentDidMount() {
        await this.getAllOrderFromReact()
    }

    getAllOrderFromReact = async () => {
        try {
            let response = await getOrderByCustomerIdStatus('ALL', 'ALL');
            // console.log('API Response:', response);  // Kiểm tra dữ liệu trả về

            if (response && response.errCode === 0) {
                // console.log('Orders:', response.orders);  // Kiểm tra danh sách đơn hàng

                this.setState({
                    arrOders: response.orders
                });
            } else {
                console.error('Failed to fetch orders:', response.errMessage);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    handleFilterStatus = async (e) => {
        const status = e.target.value;
        console.log('Selected status:', status);
        let response = await getOrderByCustomerIdStatus('ALL', status);
        if (response && response.errCode === 0) {
            this.setState({
                arrOders: response.orders  // Đảm bảo trả về đúng trường `products` từ API
            });

        } else {
            console.error('Error fetching products:', response.errMessage);
        }
    }




    // Hàm xử lý khi click vào một mục
    handleOptionClick = (index) => {
        this.setState({ selectedOption: index });
    };

    // handleConfirm = async (order) => {
    //     const isConfirmed = window.confirm("Are you sure you want to cancel this order?");
    //     if (!isConfirmed) {
    //         return;
    //     }
    //     try {
    //         let res = await deleteOrder(order.id);

    //         if (res && res.errCode === 0) {
    //             await this.getAllOrderFromReact();
    //         } else {
    //             alert(res.errMessage);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    handleConfirm = async (order) => {

        try {
            let res = await updateOrderStatus(order.id, order.status = 'shipped');

            if (res && res.errCode === 0) {  // Sử dụng res.data để kiểm tra kết quả từ backend
                await this.getAllOrderFromReact();
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

        const { arrOders, isOpenDetailModal } = this.state;

        return (
            <div className="page-container">

                {this.state.isOpenDetailModal &&
                    <ModalDetailOrder
                        isOpenDetailModal={this.state.isOpenDetailModal}
                        toggle={this.toggleModal}
                        currentOrder={this.state.orderEdit}
                    // doEditProduct={this.doEditProduct}
                    />
                }


                <div className='body'>
                    <div className="left-side">
                        <ManageNavigator menus={adminMenu} onLinkClick={this.handleOptionClick} />
                    </div>
                    <div className="right-side">
                        {/* Thanh phía trên bảng dữ liệu */}
                        <div className="top-bar">
                            <h2 className="title">Order</h2>
                            <div className="search-filter">
                                {/* Thanh tìm kiếm */}
                                <div className="search-filter">
                                    {/* <input
                                        type="text"
                                        placeholder="Search by name, material or category..."
                                        onChange={this.handleSearch}
                                    /> */}
                                    <select className="status-filter" onChange={this.handleFilterStatus}>
                                        <option value="ALL">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>



                                    </select>
                                </div>

                            </div>
                        </div>
                        <table className='information-table' >
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>CustomerID</th>
                                    <th>Total Amount</th>
                                    <th>Payment method</th>
                                    <th>Shipping Address</th>
                                    <th>Order Date</th>
                                    <th>Status</th>
                                    <th>Detail</th>
                                    <th>Confirm</th>

                                </tr>
                            </thead>
                            <tbody>
                                {arrOders && arrOders.map((item, index) => {
                                    // console.log("Rendering Order Item:", item);

                                    return (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td>{item.customerId}</td>
                                            <td>{item.totalAmount}</td>

                                            <td>{item.paymentMethod}</td>
                                            <td>{item.shippingAddress}</td>
                                            <td>{moment(item.orderDate).format('DD/MM/YYYY')}</td>
                                            <td>{item.status}</td>
                                            <td>
                                                <button className="btn-edit">
                                                    <i className="fa-solid fa-pen-to-square"
                                                        onClick={() => this.handleViewDetail(item)}
                                                    ></i>
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn-delete"
                                                    onClick={() => this.handleConfirm(item)}
                                                >Confirm</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                    </div>


                </div>
                <div className='space-50px'></div>

            </div >

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

export default connect(mapStateToProps, mapDispatchToProps)(OrderManage);
