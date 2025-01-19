import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import {
    getAllProducts,
    addProductToCart
} from '../../services/productService'; // API đã có sẵn
import ModalProductDetail from './ProductDetailModal'; // Modal để xem chi tiết sản phẩm
import './Shop.scss';

class Shop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrProduct: [],
            isOpenProductModal: false,
            productDetail: {},
            searchQuery: '',
            quantity: 1, //default
            customerId: '',

        };
    }

    async componentDidMount() {
        if (this.props.id) {
            console.log("User is already logged in with ID:", this.props.id);
        } else {
            console.log("No user logged in.");
        }
        await this.getAllProductFromReact();
    }

    getAllProductFromReact = async () => {
        let response = await getAllProducts('ALL', '', '');
        console.log('Response from API:', response);  // Debugging line to check the API response

        if (response && response.errCode === 0) {
            this.setState({
                arrProduct: response.products  // Ensure the state is updated with the correct data
            });
        } else {
            console.error('Failed to fetch products:', response.errMessage);
        }
    };

    handleSearch = debounce(async (e) => {
        const searchQuery = e.target.value.trim();
        this.setState({ searchQuery });

        let response = await getAllProducts('ALL', '', searchQuery);
        if (response && response.errCode === 0) {
            this.setState({
                arrProduct: response.products
            });
        } else {
            this.setState({
                arrProduct: []
            });
        }
    }, 500);

    toggleProductDetailModal = (product) => {
        this.setState({
            isOpenProductModal: !this.state.isOpenProductModal,
            productDetail: product,
        });
    };

    handleAddToCart = async (product) => {
        const { customerId } = this.props;
        const { quantity } = this.state;

        if (!customerId) {
            alert("You must be logged in to add items to the cart!");
            return;
        }

        const response = await addProductToCart(customerId, product.id, quantity);
        if (response && response.errCode === 0) {
            alert("Product added to cart successfully!");
        } else {
            alert(response.errMessage);
        }
    };

    render() {
        const { arrProduct, isOpenProductModal, productDetail } = this.state;
        return (
            <div className="product-list-container">
                <div className="search-bar ">
                    <input

                        className='input-search'
                        type="text"
                        placeholder="Search by name, color, or category..."
                        onChange={this.handleSearch}
                    />
                </div>

                {isOpenProductModal && (
                    <ModalProductDetail
                        isOpen={isOpenProductModal}
                        toggleModal={this.toggleProductDetailModal}
                        product={productDetail}
                    />
                )}

                <div className="product-list">
                    {arrProduct && arrProduct.map((product, index) => (
                        <div key={index} className="product-item">
                            <img
                                src={product.imageUrl ? product.imageUrl : 'default-image.jpg'}
                                className="product-image"
                            />
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p>Color: {product.color}</p>
                                <p>Category: {product.category}</p>
                                <p>{product.description}</p>
                                <p className="product-price">${product.price}</p>
                                <div className="product-actions">
                                    <button className="btn-add-to-cart">Add to Cart</button>
                                    <button
                                        className="btn-view-detail fa-solid fa-plus"
                                        onClick={() => this.toggleProductDetailModal(product)}
                                    ></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        id: state.customer.id,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Shop);
