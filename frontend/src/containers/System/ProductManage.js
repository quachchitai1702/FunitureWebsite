import React, { Component } from 'react';
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
            currentProduct: '',
        };
    }

    async componentDidMount() {
        await this.getAllProductFromReact();
    }

    getAllProductFromReact = async () => {
        try {
            // Lấy tất cả sản phẩm
            let response = await getAllProducts('ALL', '', '');
            console.log('Response from API (Products):', response);

            if (response && response.errCode === 0) {
                let products = response.products;

                // Chuyển đổi buffer ảnh trong imageUrl sang Base64 cho mỗi sản phẩm
                let productsWithImages = products.map(product => {
                    let base64Image = '';

                    // Kiểm tra nếu có imageUrl và nó là Buffer
                    if (product.imageUrl && product.imageUrl.data) {
                        // Chuyển Buffer thành Base64
                        base64Image = new Buffer(product.imageUrl.data, 'basase64').toString('binary');
                        // imageBase64 = new Buffer(category.imageUrl, 'base64').toString('binary');

                        // console.log("Converted Base64 Image for Product ID " + product.id + ":", base64Image);
                    }

                    return {
                        ...product,
                        previewImageUrl: base64Image, // Thêm Base64 Image vào sản phẩm
                    };
                });

                this.setState({
                    arrProduct: productsWithImages,
                });
            } else {
                console.error('Failed to fetch products:', response.errMessage);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    handleFilterStatus = async (e) => {
        const status = e.target.value;
        console.log('Selected status:', status);
        let response = await getAllProducts('ALL', status, '');
        if (response && response.errCode === 0) {
            this.setState({
                arrProduct: response.products,
            });
        } else {
            console.error('Error fetching products:', response.errMessage);
        }
    };

    handleSearch = debounce(async (e) => {
        const searchQuery = e.target.value.trim();
        this.setState({ searchQuery });

        let response = await getAllProducts('ALL', '', searchQuery);
        if (response && response.errCode === 0) {
            this.setState({
                arrProduct: response.products,
            });
        } else {
            this.setState({
                arrProduct: [],
            });
        }
    }, 500);

    toggleModal = () => {
        this.setState(prevState => ({
            isOpenAddModal: !prevState.isOpenAddModal,
        }));
    };

    toggleEditModal = () => {
        this.setState(prevState => ({
            isOpenEditModal: !prevState.isOpenEditModal
        }));
    };

    handleOptionClick = (index) => {
        this.setState({ selectedOption: index });
    };

    handleAddNewProduct = () => {
        this.toggleModal();
    };

    createNewProduct = async (data) => {
        try {
            console.log("Creating new product with data:", data);
            let response = await createProduct(data);
            console.log('API response:', response);

            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                console.log('Product created successfully');
                await this.getAllProductFromReact();
                this.setState({
                    isOpenAddModal: false,
                });

                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }
        } catch (e) {
            console.error('Error during product creation:', e);
        }
    };

    handleDelelteProduct = async (product) => {
        try {
            let res = await deleteProduct(product.id);
            console.log('API response:', res);

            if (res && res.errCode === 0) {
                await this.getAllProductFromReact();
            } else {
                alert(res.errMessage);
            }
        } catch (e) {
            console.log(e);
        }
    };

    handleEditProduct = (product) => {
        this.setState({
            isOpenEditModal: true,
            currentProduct: product,
        });
    };

    doEditProduct = async (product) => {
        console.log('Received data in doEditProduct:', product);

        try {
            let res = await updateProduct(product);
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenEditModal: false,
                });

                await this.getAllProductFromReact();
            } else {
                alert(res.errMessage);
            }
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        const { arrProduct, isOpenAddModal, isOpenEditModal } = this.state;

        console.log('Products:', this.state.currentProduct);

        return (
            <div className="page-container">
                <ModalAddProduct
                    isOpenAddModal={isOpenAddModal}
                    toggle={this.toggleModal}
                    createNewProduct={this.createNewProduct}
                />
                {isOpenEditModal &&
                    <ModalEditProduct
                        isOpenEditModal={this.state.isOpenEditModal}
                        toggleEditModal={this.toggleEditModal}
                        // currentProduct={this.state.currentProduct}
                        doEditProduct={this.doEditProduct}
                    />

                }
                {/* 
                {isOpenEditModal &&
                <ModalEditProduct
                    isOpenEditModal={this.state.isOpenEditModal}
                    toggleEditModal={this.toggleEditModal}
                    currentProduct={this.state.productEdit}
                    doEditProduct={this.doEditProduct}
                />

                } */}



                <div className='body'>
                    <div className="left-side">
                        <ManageNavigator menus={adminMenu} onLinkClick={this.handleOptionClick} />
                    </div>
                    <div className="right-side">
                        <div className="top-bar">
                            <h2 className="title">Product</h2>
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
                            <button className="btn-create-new" onClick={this.handleAddNewProduct}>
                                Create New Product
                            </button>
                        </div>
                        <table className='information-table'>
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
                                {arrProduct && arrProduct.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.price}</td>
                                        <td>{item.productCategory ? item.productCategory.name : 'N/A'}</td>
                                        <td>{item.material}</td>
                                        <td>{item.stock}</td>
                                        <td>
                                            {item.previewImageUrl ? (
                                                <>
                                                    <img src={item.previewImageUrl} width="50" />
                                                    {/* {console.log("Preview Image URL:", item.previewImageUrl)} Log to check */}
                                                </>
                                            ) : (
                                                <span>No Image</span>
                                            )}
                                        </td>
                                        <td>{item.status}</td>
                                        <td>
                                            <button className="btn-edit" onClick={() => this.handleEditProduct(item)}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                        </td>
                                        <td>
                                            <button className="btn-delete" onClick={() => this.handleDelelteProduct(item)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='space-50px'></div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ProductManage);