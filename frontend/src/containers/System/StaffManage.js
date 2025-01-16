import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { debounce } from 'lodash';


import ManageNavigator from '../../components/StaffNavigator';
import { adminMenu } from '../Header/menuApp';

import {
    getAllStaffs,
    createNewStaffService,
    deleteStaffService,
    editStaffService
} from '../../services/staffService';
import ModalAddStaff from './ModalAddStaff';
import ModalEditStaff from './ModalEditStaff';
import { emitter } from '../../utils/emitter';

import './StaffManage.scss';


class StaffManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrStaffs: [],
            isOpenAddModal: false,
            isOpenEditModal: false,
            searchQuery: '',
            staffEdit: {},


        }
    }

    async componentDidMount() {
        await this.getAllStaffFromReact();
    }


    toggleModal = () => {
        this.setState(prevState => ({
            isOpenAddModal: !prevState.isOpenAddModal,

        }));
    };

    toggleEditModal = () => {
        this.setState(prevState => ({
            isOpenEditModal: !prevState.isOpenEditModal,

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

    getAllStaffFromReact = async () => {
        let response = await getAllStaffs('ALL', '', '');
        if (response && response.errCode === 0) {
            this.setState({
                arrStaffs: response.staffs
            });
        }
    }


    handleAddNewStaff = () => {
        this.toggleModal();  // Mở modal khi click
    }

    createNewStaff = async (data) => {
        try {
            let response = await createNewStaffService(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllStaffFromReact();
                this.setState({
                    isOpenAddModal: false
                })

                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (e) {
            console.log(e);
        }
    }


    handleDelelteStaff = async (staff) => {
        try {
            let res = await deleteStaffService(staff.id)
            if (res && res.errCode === 0) {
                await this.getAllStaffFromReact();
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
        let response = await getAllStaffs('ALL', status, '');
        if (response && response.errCode === 0) {
            this.setState({
                arrStaffs: response.staffs
            });
        }
    }

    handleSearch = debounce(async (e) => {
        const searchQuery = e.target.value.trim();

        this.setState({ searchQuery });

        let response = await getAllStaffs('ALL', '', searchQuery);
        if (response && response.errCode === 0) {
            this.setState({
                arrStaffs: response.staffs
            });
        } else {
            this.setState({
                arrStaffs: []
            });
        }
    }, 500);

    handleEditStaff = (staff) => {
        console.log('staff: ', staff);
        this.setState({
            isOpenEditModal: true,
            staffEdit: staff,
        })

    }

    doEditStaff = async (staff) => {
        try {
            let res = await editStaffService(staff);
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenEditModal: false
                })

                await this.getAllStaffFromReact();
            } else {
                alert(res.errMessage);
            }
        } catch (e) {
            console.log(e)
        }

    }




    render() {
        // console.log('check render', this.state)
        const { arrStaffs, isOpenAddModal, isOpenEditModal } = this.state;
        return (
            <div className="page-container">
                <ModalAddStaff
                    isOpenAddModal={isOpenAddModal}
                    toggle={this.toggleModal}
                    createNewStaff={this.createNewStaff}
                />

                {
                    this.state.isOpenEditModal &&
                    <ModalEditStaff
                        isOpenEditModal={isOpenEditModal}
                        toggle={this.toggleEditModal}
                        currentStaff={this.state.staffEdit}
                        editStaff={this.doEditStaff}
                    />
                }


                <div className='body'>
                    <div className="left-side">
                        <ManageNavigator menus={adminMenu} onLinkClick={this.handleOptionClick} />
                    </div>
                    <div className="right-side">
                        {/* Thanh phía trên bảng dữ liệu */}
                        <div className="top-bar">
                            <h2 className="title">Staff</h2>
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
                                <button className="btn-create-new" onClick={() => this.handleAddNewStaff()}>
                                    Create New Staff
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
                                {arrStaffs && arrStaffs.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.address}</td>
                                            <td>{item.status}</td>
                                            <td>
                                                <button className="btn-edit">
                                                    <i className="fa-solid fa-pen-to-square"
                                                        onClick={() => this.handleEditStaff(item)}
                                                    ></i>
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn-delete"
                                                    onClick={() => this.handleDelelteStaff(item)}
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

export default connect(mapStateToProps, mapDispatchToProps)(StaffManage);
