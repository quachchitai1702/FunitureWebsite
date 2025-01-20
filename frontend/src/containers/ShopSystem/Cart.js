import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    getCartByCustomerId,
    removeProductFromCart
} from '../../services/productService'; // Đảm bảo rằng bạn có dịch vụ này
import './Cart.scss';

import CheckOutModal from './CheckOutModal'; // Import modal

import cartempty from '../../assets/Image/Empty.png';


class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: {},
            paymentMethod: 'COD', // mặc định là COD
            isCheckOutModalOpen: false, // Trạng thái mở modal

        };
    }

    async componentDidMount() {
        // const { customerInfor } = this.props;
        // if (customerInfor && customerInfor.id) {
        //     await this.getCart(customerInfor.id);
        // }
        await this.getCart();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.isCheckOutModalOpen && !this.state.isCheckOutModalOpen) {
            this.getCart(); // Gọi lại để cập nhật giỏ hàng sau khi modal đóng
        }
    }

    getCart = async () => {
        const { customerInfor } = this.props;

        if (customerInfor && customerInfor.id) {
            try {
                const response = await getCartByCustomerId(customerInfor.id); // Sử dụng id từ Redux
                if (response && response.errCode === 0) {
                    this.setState({
                        cart: response.cart,
                    });
                } else {
                    console.error('Failed to fetch cart:', response?.errMessage || 'Unknown error');
                }
            } catch (error) {
                console.error('Error fetching cart:', error.message);
            }
        } else {
            console.error('Customer information is missing! Unable to fetch cart.');
        }
    };





    handlePaymentMethodChange = (e) => {
        this.setState({ paymentMethod: e.target.value });
    };


    handleDeleteProduct = async (cartDetailId) => {
        const { customerInfor } = this.props;
        if (!customerInfor || !customerInfor.id) {
            alert('You must be logged in to delete items!');
            return;
        }

        try {
            const responseData = await removeProductFromCart(cartDetailId);

            console.log('API Response Data:', responseData); // Kiểm tra phản hồi

            if (responseData && responseData.errCode === 0) {
                alert('Product removed from cart');
                this.getCart(customerInfor.id);
            } else {
                alert(`Error: ${responseData?.errMessage || 'Unknown error'}`);
            }
        } catch (error) {
            alert(`Error removing product from cart: ${error.message}`);
            console.error('API Error:', error);
        }
    };

    toggleCheckOutModal = () => {
        this.setState(prevState => ({
            isCheckOutModalOpen: !prevState.isCheckOutModalOpen
        }));
    };

    handleCheckOut = () => {
        this.setState({
            isCheckOutModalOpen: !this.state.isCheckOutModalOpen
        });

    };


    render() {
        const { cart, paymentMethod, isCheckOutModalOpen } = this.state;
        const { cartDetails } = cart;
        const { customerInfor } = this.props;

        const cartLength = Array.isArray(cartDetails) ? cartDetails.length : 0;

        console.log("cartDetails length: ", cartLength);

        return (
            <div className="cart-container">

                {isCheckOutModalOpen && (
                    <CheckOutModal
                        isOpen={isCheckOutModalOpen}
                        toggleModal={this.toggleCheckOutModal}
                        customerId={customerInfor?.id}
                        paymentMethod={paymentMethod}
                    />
                )}

                <h1>Your Cart</h1>

                <div className='table-container'>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th>Color</th>
                                <th>Quantity</th>
                                <th>Material</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartLength === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '10px', }}>
                                        <img src={cartempty} alt="Empty Cart" style={{ width: '300px', height: '300px' }} />
                                    </td>
                                </tr>
                            ) : (
                                cartDetails.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.product.name}</td>
                                        <td>{item.product.productCategory?.name || 'N/A'}</td>
                                        <td>{item.product.types?.map(type => type.type).join(', ') || 'N/A'}</td>
                                        <td>{item.product.colors?.map(color => color.color).join(', ') || 'N/A'}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.product.material}</td>
                                        <td>${item.price}</td>
                                        <td>
                                            <button
                                                className="btn-delete"
                                                onClick={() => this.handleDeleteProduct(item.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="cart-summary">
                    <div className="payment-method">
                        <label htmlFor="paymentMethod">Payment Method: </label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={this.handlePaymentMethodChange}
                        >
                            <option value="COD">Cash on Delivery (COD)</option>
                        </select>
                    </div>

                    <div className="total">
                        <span >Total: ${cart.total}</span>
                    </div>

                    <button className="btn-checkout" onClick={() => this.handleCheckOut()}>
                        Checkout
                    </button>
                </div>

            </div>
        );
    }





}

const mapStateToProps = state => {
    return {
        customerInfor: state.customer.customerInfor
    };
};

export default connect(mapStateToProps)(Cart);
