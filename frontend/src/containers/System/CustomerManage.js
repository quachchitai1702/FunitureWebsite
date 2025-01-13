import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import ManageNavigator from '../../components/ManageNavigator';
import { adminMenu } from '../Header/menuApp';

import { getAllCustomers } from '../../services/customerService';

import './CustomerManage.scss';


class CustomerManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrCustomers: []

        }
    }

    async componentDidMount() {
        let response = await getAllCustomers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrCustomers: response.customers

            })
        }

    }

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


    render() {
        console.log('check render', this.state)
        let arrCustomers = this.state.arrCustomers;
        return (
            <div className="page-container">
                <div className='body'>
                    <div class="left-side">
                        <ManageNavigator menus={adminMenu} onLinkClick={this.handleOptionClick} />
                    </div>
                    <div class="right-side">
                        <h1>Welcome to the Admin Dashboard</h1>
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
                                    console.log('check map', item, index);
                                    return (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.address}</td>

                                            <td>{item.status}</td>
                                            <td>
                                                <button className="btn-edit" > <i class="fa-solid fa-pen-to-square"></i> </button>
                                            </td>
                                            <td>
                                                <button className="btn-delete" >Delete</button>
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
