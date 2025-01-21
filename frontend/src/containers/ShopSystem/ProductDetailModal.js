import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import './ProductDetailModal.scss';
import _ from 'lodash';


const ModalProductDetail = ({ isOpen, toggleModal, product, handleAddToCart }) => {
    const [quantity, setQuantity] = useState(1); // Khởi tạo state cho quantity

    // Hàm thay đổi giá trị quantity khi người dùng nhập
    const handleQuantityChange = (e) => {
        const value = Math.max(1, e.target.value); // Không cho phép giá trị nhỏ hơn 1
        setQuantity(value);
    };

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
                            className="modal-product-image"
                        />
                        <div className="description-container">Description
                            <p className="product-description">{product.description}</p>


                        </div>

                    </div>

                    {/* Bên phải: Thông tin sản phẩm */}
                    <div className="modal-right">
                        <h2>{product.name}</h2>
                        <p className="product-info"><strong>Stock:</strong> {product.stock} available</p>
                        <p className="product-info"><strong>Color:</strong> {product.colors && product.colors.length > 0 ? product.colors.map(c => c.color).join(', ') : 'N/A'}</p>
                        <p className="product-info"><strong>Category:</strong> {product.productCategory?.name || 'N/A'}</p>
                        <p className="product-info"><strong>Material:</strong> {product.material}</p>
                        {/* <p className="product-info"><strong>Status:</strong> {product.status}</p> */}
                        <p className="product-info"><strong>Price:</strong> ${product.price}</p>


                        {/* Thêm ô nhập quantity */}
                        <div className="quantity-input">
                            <Label for="quantity">Quantity:</Label>
                            <Input
                                type="number"
                                id="quantity"
                                min="1"
                                value={quantity}
                                onChange={handleQuantityChange}
                            />
                        </div>

                        <div className="product-actions">
                            <button
                                className="btn-add-to-cart"
                                onClick={() => handleAddToCart(product, quantity)} // Gửi product và quantity khi thêm vào giỏ
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ModalProductDetail;
