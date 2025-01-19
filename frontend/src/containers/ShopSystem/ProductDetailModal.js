import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import './ProductDetailModal.scss';
import _ from 'lodash';
import './ProductDetailModal.scss';

const ModalProductDetail = ({ isOpen, toggleModal, product }) => {
    if (!isOpen || !product) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="fa-solid fa-x" onClick={toggleModal}></button>
                <div className="modal-body">
                    {/* Bên trái: Hình ảnh và mô tả */}
                    <div className="modal-left">
                        <img
                            src={product.imageUrl ? product.imageUrl : 'default-image.jpg'}
                            // alt={product.name}
                            className="modal-product-image"
                        />
                        <p className="product-description">{product.description}</p>
                    </div>

                    {/* Bên phải: Thông tin sản phẩm */}
                    <div className="modal-right">
                        <h2>{product.name}</h2>
                        <p className="product-info"><strong>Price:</strong> ${product.price}</p>
                        <p className="product-info"><strong>Category:</strong> {product.productCategory?.name || 'N/A'}</p>
                        <p className="product-info"><strong>Material:</strong> {product.material}</p>
                        <p className="product-info"><strong>Status:</strong> {product.status}</p>
                        <p className="product-info"><strong>Stock:</strong> {product.stock} available</p>

                        <div className="product-actions">
                            <button className="btn-add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ModalProductDetail;


