import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { debounce } from 'lodash';


import ManageNavigator from '../../components/StaffNavigator';
import { adminMenu } from '../Header/menuApp';

import {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,

} from '../../services/productService';

import ModalAddProduct from './ModalAddProduct';
import ModalEditProduct from './ModalEditProduct';
import { emitter } from '../../utils/emitter';

import './ProductManage.scss';

class ProductManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrProduct: [],
            isOpenAddModal: false,
            isOpenEditModal: false,
            searchQuery: '',
            productEdit: {},


        }
    }

    async componentDidMount() {
        await this.getAllProductFromReact();
    }

    getAllProductFromReact = async () => {
        let response = await getAllProducts('ALL', '', '');
        console.log('Response from API:', response);  // Debugging line to check the API response

        if (response && response.errCode === 0) {
            this.setState({
                arrProduct: response.products  // Make sure to update the state with the correct data
            });
        } else {
            console.error('Failed to fetch products:', response.errMessage);
        }
    };

    handleFilterStatus = async (e) => {
        const status = e.target.value;
        console.log('Selected status:', status);
        let response = await getAllProducts('ALL', status, '');
        if (response && response.errCode === 0) {
            this.setState({
                arrProduct: response.products  // Đảm bảo trả về đúng trường `products` từ API
            });
        } else {
            console.error('Error fetching products:', response.errMessage);
        }
    }

    handleSearch = debounce(async (e) => {
        const searchQuery = e.target.value.trim();
        this.setState({ searchQuery });

        let response = await getAllProducts('ALL', '', searchQuery);
        if (response && response.errCode === 0) {
            this.setState({
                arrProduct: response.products  // Đảm bảo trả về đúng trường `products` từ API
            });
        } else {
            this.setState({
                arrProduct: []
            });
        }
    }, 500);


    toggleModal = () => {
        // console.log('Toggling modal. Current state:', this.state.isOpenAddModal); // Kiểm tra trạng thái modal
        this.setState(prevState => ({
            isOpenAddModal: !prevState.isOpenAddModal,
        }));
    };



    toggleEditModal = () => {
        // console.log('Toggling Edit Modal. Current state:', this.state.isOpenEditModal);
        this.setState(prevState => ({
            isOpenEditModal: !prevState.isOpenEditModal,
        }));
    };


    // Hàm xử lý khi click vào một mục
    handleOptionClick = (index) => {
        this.setState({ selectedOption: index });
    };

    handleAddNewProduct = () => {
        this.toggleModal(); // Mở modal khi nhấn vào nút
    };


    createNewProduct = async (data) => {
        try {
            console.log("Creating new product with data:", data); // Thêm log này để kiểm tra dữ liệu đang được truyền vào
            let response = await createProduct(data);
            console.log('API response:', response); // Kiểm tra phản hồi từ API

            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                console.log('Product created successfully');
                await this.getAllProductFromReact(); // Lấy lại danh sách sản phẩm sau khi tạo thành công
                this.setState({
                    isOpenAddModal: false
                });

                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }
        } catch (e) {
            console.error('Error during product creation:', e); // Log lỗi nếu có
        }
    }

    handleDelelteProduct = async (product) => {

        try {
            let res = await deleteProduct(product.id)
            console.log('API response:', res);

            if (res && res.errCode === 0) {
                await this.getAllProductFromReact();
            } else {
                alert(res.errMessage)
            }
        } catch (e) {
            console.log(e);

        }
    }

    handleEditProduct = (product) => {
        console.log('Editing product:', product);

        this.setState({
            isOpenEditModal: true,
            productEdit: product,
        }, () => {
            // console.log('After setting state, isOpenEditModal:', this.state.isOpenEditModal);
            // console.log('Updated productEdit:', this.state.productEdit);
        });
    };



    doEditProduct = async (product) => {
        // console.log('Received data in doEditProduct:', product); // Kiểm tra dữ liệu nhận được

        try {

            let res = await updateProduct(product);
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenEditModal: false
                })

                await this.getAllProductFromReact();
            } else {
                alert(res.errMessage);
            }
        } catch (e) {
            console.log(e)
        }

    }




    render() {
        // console.log("Render: isOpenEditModal:", this.state.isOpenEditModal);

        const { arrProduct, isOpenAddModal, isOpenEditModal } = this.state;
        return (
            <div className="page-container">
                <ModalAddProduct
                    isOpenAddModal={this.state.isOpenAddModal}
                    toggle={this.toggleModal}
                    createNewProduct={this.createNewProduct}
                />

                {this.state.isOpenEditModal &&
                    <ModalEditProduct
                        isOpenEditModal={this.state.isOpenEditModal}
                        toggle={this.toggleEditModal}
                        currentProduct={this.state.productEdit}
                        doEditProduct={this.doEditProduct}
                    />
                }



                <div className='body'>
                    <div className="left-side">
                        <ManageNavigator menus={adminMenu} onLinkClick={this.handleOptionClick} />
                    </div>
                    <div className="right-side">
                        {/* Thanh phía trên bảng dữ liệu */}
                        <div className="top-bar">
                            <h2 className="title">Product</h2>
                            <div className="search-filter">
                                {/* Thanh tìm kiếm */}
                                <div className="search-filter">
                                    <input
                                        type="text"
                                        placeholder="Search by name, material or category..."
                                        onChange={this.handleSearch}
                                    />
                                    <select className="status-filter" onChange={this.handleFilterStatus}>
                                        <option value="">All Status</option>
                                        <option value="available">Available</option>
                                        <option value="out of stock">Out of stock</option>
                                        <option value="discontinued">Discontinued</option>

                                    </select>
                                </div>

                                {/* Nút tạo khách hàng mới */}
                                <button className="btn-create-new" onClick={() => this.handleAddNewProduct()}>
                                    Create New Product
                                </button>
                            </div>
                        </div>
                        <table className='information-table' >
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Material</th>
                                    <th>Stock</th>
                                    <th>Image</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                    <th>Delete</th>

                                </tr>
                            </thead>
                            <tbody>
                                {arrProduct && arrProduct.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.price}</td>
                                            <td>{item.productCategory ? item.productCategory.name : 'N/A'}</td>
                                            <td>{item.material}</td>
                                            <td>{item.stock}</td>
                                            <td>
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt="Product Image" width="50" />
                                                ) : (
                                                    <span>No Image</span>
                                                )}
                                            </td>
                                            <td>{item.status}</td>

                                            <td>
                                                <button className="btn-edit">
                                                    <i className="fa-solid fa-pen-to-square"
                                                        onClick={() => this.handleEditProduct(item)}
                                                    ></i>
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn-delete"
                                                    onClick={() => this.handleDelelteProduct(item)}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductManage);
