import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCartByCustomerId } from '../../services/productService'; // Đảm bảo rằng bạn có dịch vụ này
import './Cart.scss';

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: {},
            paymentMethod: 'COD', // mặc định là COD
        };
    }

    async componentDidMount() {
        const { customerInfor } = this.props;
        if (customerInfor && customerInfor.id) {
            await this.getCart(customerInfor.id);
        }
    }

    getCart = async (customerId) => {
        const response = await getCartByCustomerId(customerId);
        if (response && response.errCode === 0) {
            this.setState({
                cart: response.cart,
            });
        } else {
            console.error('Failed to fetch cart:', response.errMessage);
        }
    };

    handleDeleteProduct = async (cartDetailId) => {
        // Xử lý xóa sản phẩm trong giỏ hàng
        console.log('Delete product with ID:', cartDetailId);
    };

    handleCheckout = () => {
        const { cart, paymentMethod } = this.state;
        // Xử lý checkout với phương thức thanh toán đã chọn
        console.log('Proceed to checkout with total:', cart.total, 'Payment method:', paymentMethod);
    };

    handlePaymentMethodChange = (e) => {
        this.setState({ paymentMethod: e.target.value });
    };

    render() {
        const { cart, paymentMethod } = this.state;
        const { cartDetails } = cart;

        return (
            <div className="cart-container">
                <h1>Your Cart</h1>

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
                        {cartDetails && cartDetails.map((item, index) => (
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
                        ))}
                    </tbody>
                </table>

                <div className="cart-summary">
                    <div className="payment-method">
                        <label htmlFor="paymentMethod">Payment Method: </label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={this.handlePaymentMethodChange}
                        >
                            <option value="COD">Cash on Delivery (COD)</option>
                            {/* <option value="Online">Online Payment</option> */}
                        </select>
                    </div>

                    <div className="total">
                        <span >Total: ${cart.total}</span>
                    </div>

                    <button className="btn-checkout" onClick={this.handleCheckout}>
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
