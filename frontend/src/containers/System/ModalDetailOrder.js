import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import './ModalDetailOrder.scss';

class ModalDetailOrder extends React.Component {
    renderOrderDetails = (orderDetails) => {
        return orderDetails.map((detail, index) => (
            <div key={index} className="order-detail">
                <p><strong>Product Name:</strong> {detail.product.name}</p>
                <p><strong>Price:</strong> {detail.product.price}</p>
                <p><strong>Quantity:</strong> {detail.quantity}</p>
                <p><strong>Total:</strong> {detail.quantity * detail.product.price}</p>
                <hr />
            </div>
        ));
    };

    render() {
        console.log('data from parent:', this.props);
        const { currentOrder } = this.props;  // Nhận dữ liệu từ props
        console.log('current data:', currentOrder);


        if (!currentOrder) {
            return null;  // Nếu không có dữ liệu đơn hàng thì không hiển thị modal
        }

        return (
            <Modal
                isOpen={this.props.isOpenDetailModal}
                toggle={this.props.toggle}
                className='modal-staff-container'
                size='lg'
            >
                <ModalHeader toggle={this.props.toggle}>Order Details</ModalHeader>
                <ModalBody>
                    <div className="modal-order-body">
                        <div className="form-section">
                            <div className="input-container">
                                <label><strong>Order ID</strong></label>
                                <p>{currentOrder.id}</p>
                            </div>
                            <div className="input-container">
                                <label><strong>Customer ID</strong></label>
                                <p>{currentOrder.customerId}</p>
                            </div>
                            <div className="input-container">
                                <label><strong>Total Amount</strong></label>
                                <p>{currentOrder.totalAmount}</p>
                            </div>
                            <div className="input-container">
                                <label><strong>Status</strong></label>
                                <p>{currentOrder.status}</p>
                            </div>
                            <div className="input-container">
                                <label><strong>Payment Method</strong></label>
                                <p>{currentOrder.paymentMethod}</p>
                            </div>
                            <div className="input-container">
                                <label><strong>Shipping Address</strong></label>
                                <p>{currentOrder.shippingAddress}</p>
                            </div>
                            <div className="input-container">
                                <label><strong>Order Date</strong></label>
                                <p>{new Date(currentOrder.orderDate).toLocaleString()}</p>
                            </div>

                            <hr />
                            <div className="order-details-section">
                                <h5>Order Items:</h5>
                                {this.renderOrderDetails(currentOrder.orderDetails)}
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="secondary"
                        className='Btn-cancel'
                        onClick={this.props.toggle}
                    >Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}


export default ModalDetailOrder;
