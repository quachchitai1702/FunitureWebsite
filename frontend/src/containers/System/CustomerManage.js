import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { debounce } from 'lodash';


import ManageNavigator from '../../components/ManageNavigator';
import { adminMenu } from '../Header/menuApp';

import { getAllCustomers, createNewCustomerService, deleteCustomerService } from '../../services/customerService';
import ModalAddCustomer from './ModalAddCustomer';
import { emitter } from '../../utils/emitter';

import './CustomerManage.scss';


class CustomerManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrCustomers: [],
            modalOpen: false,
            searchQuery: ''


        }
    }

    async componentDidMount() {
        await this.getAllCustomerFromReact();
    }


    toggleModal = () => {
        this.setState(prevState => ({
            modalOpen: !prevState.modalOpen
        }));
    };


    /** life cycle
     * run component:
     * 1. run constructor -> init state
     * 2. did mount (set state) :lấy API và set state (lưu trữ giá trị)
     * 3. render
     */

    // Hàm xử lý khi click vào một mục
    handleOptionClick = (index) => {
        this.setState({ selectedOption: index });
    };

    getAllCustomerFromReact = async () => {
        let response = await getAllCustomers('ALL', '', '');
        if (response && response.errCode === 0) {
            this.setState({
                arrCustomers: response.customers
            });
        }
    }


    handleAddNewCustomer = () => {
        this.toggleModal();  // Mở modal khi click
    }

    createNewCustomer = async (data) => {
        try {
            let response = await createNewCustomerService(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllCustomerFromReact();
                this.setState({
                    modalOpen: false
                })

                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (e) {
            console.log(e);
        }
    }


    handleDelelteCustomer = async (customer) => {
        try {
            let res = await deleteCustomerService(customer.id)
            if (res && res.errCode === 0) {
                await this.getAllCustomerFromReact();
            } else {
                alert(res.errMessage)
            }
        } catch (e) {
            console.log(e);

        }
    }

    handleFilterStatus = async (e) => {
        const status = e.target.value;
        console.log('Selected status:', status);
        let response = await getAllCustomers('ALL', status, '');
        if (response && response.errCode === 0) {
            this.setState({
                arrCustomers: response.customers
            });
        }
    }

    handleSearch = debounce(async (e) => {
        const searchQuery = e.target.value.trim();

        this.setState({ searchQuery });

        let response = await getAllCustomers('ALL', '', searchQuery);
        if (response && response.errCode === 0) {
            this.setState({
                arrCustomers: response.customers
            });
        } else {
            this.setState({
                arrCustomers: []
            });
        }
    }, 500);




    render() {
        console.log('check render', this.state)
        const { arrCustomers, modalOpen } = this.state;
        return (
            <div className="page-container">
                <ModalAddCustomer
                    modalOpen={modalOpen}
                    toggle={this.toggleModal}
                    createNewCustomer={this.createNewCustomer}
                />
                <div className='body'>
                    <div className="left-side">
                        <ManageNavigator menus={adminMenu} onLinkClick={this.handleOptionClick} />
                    </div>
                    <div className="right-side">
                        {/* Thanh phía trên bảng dữ liệu */}
                        <div className="top-bar">
                            <h2 className="title">Customer</h2>
                            <div className="search-filter">
                                {/* Thanh tìm kiếm */}
                                <div className="search-filter">
                                    <input
                                        type="text"
                                        placeholder="Search by name or phone..."
                                        onChange={this.handleSearch}
                                    />
                                    <select className="status-filter" onChange={this.handleFilterStatus}>
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                {/* Nút tạo khách hàng mới */}
                                <button className="btn-create" onClick={() => this.handleAddNewCustomer()}>
                                    Create New Customer
                                </button>
                            </div>
                        </div>
                        <table className='information-table' >
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                    <th>Delete</th>

                                </tr>
                            </thead>
                            <tbody>
                                {arrCustomers && arrCustomers.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.address}</td>
                                            <td>{item.status}</td>
                                            <td>
                                                <button className="btn-edit">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn-delete"
                                                    onClick={() => this.handleDelelteCustomer(item)}
                                                >Delete</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerManage);
