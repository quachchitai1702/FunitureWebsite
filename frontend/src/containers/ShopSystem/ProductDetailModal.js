import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import './ProductDetailModal.scss';
import _ from 'lodash';

const ModalProductDetail = ({ isOpen, toggleModal, product, handleAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [imageSrc, setImageSrc] = useState(''); // State lưu hình ảnh Base64

    useEffect(() => {
        if (product?.imageUrl?.data) {
            // Chuyển đổi Buffer thành Base64
            const base64Image = new Buffer(product.imageUrl.data, 'base64').toString('binary');
            setImageSrc(base64Image);
        } else {
            setImageSrc('default-image.jpg'); // Ảnh mặc định nếu không có ảnh
        }
    }, [product]);

    // Hàm thay đổi giá trị quantity
    const handleQuantityChange = (e) => {
        const value = Math.max(1, e.target.value);
        setQuantity(value);
    };

    if (!isOpen || !product) return null;
    console.log('ImageSrc:', imageSrc);



    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="fa-solid fa-x" onClick={toggleModal}></button>
                <div className="modal-body">
                    {/* Bên trái: Hình ảnh và mô tả */}
                    <div className="modal-left">

                        <img src={imageSrc} className="modal-product-image" />
                        <div className="description-container">
                            <strong>Description:</strong>
                            <p className="product-description">{product.description}</p>
                        </div>
                    </div>

                    {/* Bên phải: Thông tin sản phẩm */}
                    <div className="modal-right">
                        <h2>{product.name}</h2>
                        <p className="product-info"><strong>Stock:</strong> {product.stock} available</p>
                        <p className="product-info"><strong>Color:</strong> {product.colors?.map(c => c.color).join(', ') || 'N/A'}</p>
                        <p className="product-info"><strong>Category:</strong> {product.productCategory?.name || 'N/A'}</p>
                        <p className="product-info"><strong>Material:</strong> {product.material}</p>
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
                                onClick={() => handleAddToCart(product, quantity)}
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
