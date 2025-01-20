import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getAllCustomers } from '../../services/customerService';
import { createOrder } from '../../services/orderService';
import './CheckOutModal.scss';

const CheckOutModal = ({ isOpen, toggleModal, customerId, paymentMethod }) => {
    const [customerInfo, setCustomerInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Gọi API để lấy thông tin khách hàng khi modal mở
    useEffect(() => {
        if (isOpen && customerId) {
            fetchCustomerInfo(customerId);
        }
    }, [isOpen, customerId]);

    const fetchCustomerInfo = async (customerId) => {
        try {
            // console.log('id from cart', customerId)

            setLoading(true);
            const response = await getAllCustomers(customerId, '', '');

            // console.log('customer: ', response);

            if (response.errCode === 0) {
                setCustomerInfo(response || {});

                console.log('customer: ', response);

            } else {
                console.error('Failed to fetch customer info:', response.errMessage);
            }
        } catch (error) {
            console.error('Error fetching customer info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        try {
            console.log('customerId:', customerId);
            console.log('paymentMethod:', paymentMethod);

            setLoading(true);
            const response = await createOrder(customerId, paymentMethod);

            if (response.errCode === 0) {
                setOrderSuccess(true);
                alert('Order placed successfully!');
                // Cập nhật giỏ hàng nếu cần, ví dụ: reset cart hoặc gọi API cập nhật giỏ hàng
                // Ví dụ gọi API để reset giỏ hàng sau khi đặt hàng
                // await resetCart(customerId);

                // onModalClose

                toggleModal();  // Đóng modal sau khi đơn hàng thành công
            } else {
                alert(`Failed to place order: ${response.errMessage}`);
            }
        } catch (e) {
            console.error('Error creating order:', e);
            alert('Failed to place order.');
        } finally {
            setLoading(false);
        }
    };

    console.log('customerInfor: ', customerInfo?.customers?.name);
    console.log('customerInfor: ', customerInfo.customers);



    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} toggle={toggleModal} className="checkout-modal modal-sm">
            <ModalHeader toggle={toggleModal}>Checkout</ModalHeader>
            <ModalBody>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <h5>Customer Information</h5>
                        <p><strong>Name:</strong> {customerInfo?.customers?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {customerInfo?.customers?.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {customerInfo?.customers?.phone || 'N/A'}</p>
                        <p><strong>Address:</strong> {customerInfo?.customers?.address || 'N/A'}</p>

                        <h5>Payment Method</h5>
                        <p>{paymentMethod}</p>
                    </div>
                )}
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? 'Processing...' : 'Place Order'}
                </Button>{' '}
                <Button color="secondary" onClick={toggleModal}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default CheckOutModal;
