import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import './ModalEditProduct.scss';
import _ from 'lodash';
import { CommonUtils } from '../../utils';

class ModalEditProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            price: '',
            categoryInput: '',
            material: '',
            stock: '',
            description: '',
            status: 'Available',
            productTypes: [],
            productImages: [],
            productColors: [],
            previewImageUrls: [],
            errors: {},
        };
    }

    componentDidMount() {
        let product = this.props.currentProduct;
        if (product) {
            this.setState({
                id: product.id,
                name: product.name,
                price: product.price,
                categoryInput: product.categoryId,
                material: product.material,
                stock: product.stock,
                description: product.description,
                status: product.status,
                productTypes: product.types || [],
                productImages: product.imageUrl || [],
                productColors: product.colors || [],
            });
        }
    }

    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState(copyState);
    };

    handleOnChangeMultipleValues = (event, id) => {
        let copyState = { ...this.state };
        let values = event.target.value.split(',').map(value => value.trim()).filter(value => value !== '');
        copyState[id] = values;
        this.setState(copyState);
    };

    handleImageUpload = async (event) => {
        let files = event.target.files;
        if (files.length > 0) {
            let base64Images = [];
            let previewUrls = [];
            for (let i = 0; i < files.length; i++) {
                let base64 = await CommonUtils.getBase64(files[i]);
                base64Images.push(base64);
                previewUrls.push(URL.createObjectURL(files[i]));
            }
            this.setState({
                productImages: base64Images,
                previewImageUrls: previewUrls,
            });
        }
    };

    // checkValidInput = () => {
    //     const { id, name, price, stock, description, productTypes, productColors } = this.state;
    //     let errors = {};
    //     let isValid = true;

    //     if (!name || !description || !id) {
    //         errors.name = 'Name and Description are required.';
    //         isValid = false;
    //     }

    //     if (!price || isNaN(price) || parseFloat(price) <= 0) {
    //         errors.price = 'Price must be a valid number greater than 0.';
    //         isValid = false;
    //     }

    //     if (!stock || isNaN(stock) || parseInt(stock) <= 0) {
    //         errors.stock = 'Stock must be a valid number greater than 0.';
    //         isValid = false;
    //     }

    //     if (!productTypes || productTypes.length === 0) {
    //         errors.productTypes = 'Please specify at least one product type.';
    //         isValid = false;
    //     }

    //     if (!productColors || productColors.length === 0) {
    //         errors.productColors = 'Please specify at least one product color.';
    //         isValid = false;
    //     }

    //     this.setState({ errors });
    //     return isValid;
    // };

    handleEditProduct = async () => {
        // let isValid = this.checkValidInput();
        // if (isValid) {
        this.props.doEditProduct(this.state);
        // }
    };

    renderImagePreview = () => {
        const { previewImageUrls } = this.state;
        return previewImageUrls.map((url, index) => {
            return (
                <div key={index} className="image-preview-container">
                    <img src={url} alt={`Product Image ${index}`} className="image-preview" />
                </div>
            );
        });
    };

    render() {
        const { isOpenEditModal, toggleEditModal } = this.props;
        const { name, price, description, stock, status, productTypes, productColors, errors } = this.state;

        return (
            <Modal
                isOpen={isOpenEditModal}
                toggle={toggleEditModal}
            >
                <ModalHeader toggle={toggleEditModal}>Edit Product</ModalHeader>
                <ModalBody>
                    <div className='modal-body'>
                        {/* Product Name */}
                        <div className='input-container'>
                            <label>Product Name</label>
                            <input
                                type='text'
                                onChange={(event) => this.handleOnchangeInput(event, 'name')}
                                value={name}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        {/* Price */}
                        <div className='input-container'>
                            <label>Price</label>
                            <input
                                type='number'
                                onChange={(event) => this.handleOnchangeInput(event, 'price')}
                                value={price}
                            />
                            {errors.price && <span className="error-message">{errors.price}</span>}
                        </div>

                        {/* Category */}
                        <div className='input-container'>
                            <label>Category</label>
                            <input
                                type='text'
                                onChange={(event) => this.handleOnchangeInput(event, 'categoryInput')}
                                value={this.state.categoryInput}
                            />
                        </div>

                        {/* Material */}
                        <div className='input-container'>
                            <label>Material</label>
                            <input
                                type='text'
                                onChange={(event) => this.handleOnchangeInput(event, 'material')}
                                value={this.state.material}
                            />
                        </div>

                        {/* Stock Quantity */}
                        <div className='input-container'>
                            <label>Stock Quantity</label>
                            <input
                                type='number'
                                onChange={(event) => this.handleOnchangeInput(event, 'stock')}
                                value={stock}
                            />
                            {errors.stock && <span className="error-message">{errors.stock}</span>}
                        </div>

                        {/* Description */}
                        <div className='input-container'>
                            <label>Description</label>
                            <textarea
                                onChange={(event) => this.handleOnchangeInput(event, 'description')}
                                value={description}
                            />
                            {errors.description && <span className="error-message">{errors.description}</span>}
                        </div>

                        {/* Status */}
                        <div className='input-container'>
                            <label>Status</label>
                            <select
                                onChange={(event) => this.handleOnchangeInput(event, 'status')}
                                value={status}
                            >
                                <option value="Available">Available</option>
                                <option value="Out of stock">Out of stock</option>
                                <option value="Discontinued">Discontinued</option>
                            </select>
                        </div>

                        {/* Product Types */}
                        <div className='input-container'>
                            <label>Product Types (comma separated)</label>
                            <input
                                type='text'
                                onChange={(event) => this.handleOnChangeMultipleValues(event, 'productTypes')}
                                value={productTypes.join(', ')}
                            />
                            {errors.productTypes && <span className="error-message">{errors.productTypes}</span>}
                        </div>

                        {/* Product Colors */}
                        <div className='input-container'>
                            <label>Product Colors (comma separated)</label>
                            <input
                                type='text'
                                onChange={(event) => this.handleOnChangeMultipleValues(event, 'productColors')}
                                value={productColors.join(', ')}
                            />
                            {errors.productColors && <span className="error-message">{errors.productColors}</span>}
                        </div>

                        {/* Product Images */}
                        <div className='input-container'>
                            <label>Product Images</label>
                            <input
                                type="file"
                                multiple
                                onChange={this.handleImageUpload}
                            />
                        </div>

                        {/* Image Preview */}
                        <div className="image-preview-section">
                            <label>Image Preview</label>
                            {this.renderImagePreview()}
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="secondary" onClick={toggleEditModal}>Cancel</Button>
                    <Button color="primary" onClick={this.handleEditProduct}>Save</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalEditProduct;
