import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import './ModalEditProduct.scss';
import _ from 'lodash';

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
            errors: {}
        };

        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
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
                errors: {}
            });
        });
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

    handleImageUpload = (event) => {
        const files = event.target.files;
        let fileArray = [];
        for (let i = 0; i < files.length; i++) {
            fileArray.push(URL.createObjectURL(files[i]));
        }
        this.setState({
            productImages: fileArray
        });
    };

    checkValidInput = () => {
        const { id, name, price, stock, description, productTypes, productColors } = this.state;

        let errors = {};
        let isValid = true;


        // Kiểm tra các trường bắt buộc
        if (!name || !description || !id) {
            errors.name = 'Name and Description are required.';
            isValid = false;
        }

        // Kiểm tra giá trị của price và stock (phải là số và lớn hơn 0)
        if (!price || isNaN(price) || parseFloat(price) <= 0) {
            errors.price = 'Price must be a valid number greater than 0.';
            isValid = false;
        }

        if (!stock || isNaN(stock) || parseInt(stock) <= 0) {
            errors.stock = 'Stock must be a valid number greater than 0.';
            isValid = false;
        }

        // Kiểm tra nếu productTypes và productColors không trống
        if (!productTypes || productTypes.length === 0) {
            errors.productTypes = 'Please specify at least one product type.';
            isValid = false;
        }

        if (!productColors || productColors.length === 0) {
            errors.productColors = 'Please specify at least one product color.';
            isValid = false;
        }

        this.setState({ errors });
        return isValid;
    };

    handleEditProduct = async () => {
        // console.log('update data from modal: ', this.state);

        let isValid = this.checkValidInput();
        if (isValid) {
            // console.log('Sending data to doEditProduct:', this.state); // Kiểm tra dữ liệu khi gửi đi
            this.props.doEditProduct(this.state);
        }
    };

    renderImagePreview = () => {
        const { productImages } = this.state;
        return productImages.map((imageUrl, index) => {
            if (imageUrl && imageUrl.trim()) {
                return (
                    <div key={index} className="image-preview-container">
                        <img src={imageUrl} alt={`Product Image ${index}`} className="image-preview" />
                    </div>
                );
            }
            return null;
        });
    };

    componentDidMount() {
        let product = this.props.currentProduct;
        if (product && !_.isEmpty(product)) {
            console.log('Product data:', product);  // Debug dữ liệu

            this.setState({
                id: product.id || '',
                name: product.name || '',
                price: product.price || '',
                categoryInput: product.categoryId || '',
                material: product.material || '',
                stock: product.stock || '',
                description: product.description || '',
                status: product.status || 'Available',
                productTypes: Array.isArray(product.types) ? product.types.map(type => type.type) : [], // Lấy tên types
                productImages: Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl], // Xử lý imageUrl
                productColors: Array.isArray(product.colors) ? product.colors.map(color => color.color) : [], // Lấy tên màu
            });
        }
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isOpenEditModal}
                toggle={this.props.toggle}
                className='modal-add-product-container'
                size='lg'
            >
                <ModalHeader toggle={this.props.toggle}>Edit Product</ModalHeader>
                <ModalBody>
                    <div className='modal-body'>
                        {/* Phần bên trái (fields) */}
                        <div className='left-container'>
                            <div className='input-container'>
                                <label>Product Name</label>
                                <input
                                    type='text'
                                    onChange={(event) => this.handleOnchangeInput(event, 'name')}
                                    value={this.state.name}
                                />
                                {this.state.errors.name && <span className="error-message">{this.state.errors.name}</span>}
                            </div>
                            <div className='input-container'>
                                <label>Price</label>
                                <input
                                    type='number'
                                    onChange={(event) => this.handleOnchangeInput(event, 'price')}
                                    value={this.state.price}
                                />
                                {this.state.errors.price && <span className="error-message">{this.state.errors.price}</span>}
                            </div>
                            <div className='input-container'>
                                <label>Category</label>
                                <input
                                    type='text'
                                    onChange={(event) => this.handleOnchangeInput(event, 'categoryInput')}
                                    value={this.state.categoryInput}
                                    placeholder="Enter product category"
                                />
                                {this.state.errors.categoryInput && <span className="error-message">{this.state.errors.categoryInput}</span>}
                            </div>
                            <div className='input-container'>
                                <label>Material</label>
                                <input
                                    type='text'
                                    onChange={(event) => this.handleOnchangeInput(event, 'material')}
                                    value={this.state.material}
                                />
                                {this.state.errors.material && <span className="error-message">{this.state.errors.material}</span>}
                            </div>
                            <div className='input-container'>
                                <label>Stock Quantity</label>
                                <input
                                    type='number'
                                    onChange={(event) => this.handleOnchangeInput(event, 'stock')}
                                    value={this.state.stock}
                                />
                                {this.state.errors.stock && <span className="error-message">{this.state.errors.stock}</span>}
                            </div>
                            <div className='input-container'>
                                <label>Description</label>
                                <textarea
                                    onChange={(event) => this.handleOnchangeInput(event, 'description')}
                                    value={this.state.description}
                                />
                                {this.state.errors.description && <span className="error-message">{this.state.errors.description}</span>}
                            </div>
                            <div className='input-container'>
                                <label>Status</label>
                                <select
                                    onChange={(event) => this.handleOnchangeInput(event, 'status')}
                                    value={this.state.status}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Out of stock">Out of stock</option>
                                    <option value="Discontinued">Discontinued</option>
                                </select>
                            </div>
                            <div className='input-container'>
                                <label>Product Types (comma separated)</label>
                                <input
                                    type='text'
                                    onChange={(event) => this.handleOnChangeMultipleValues(event, 'productTypes')}
                                    value={this.state.productTypes.join(', ')}  // Hiển thị đúng format
                                />
                                {this.state.errors.productTypes && <span className="error-message">{this.state.errors.productTypes}</span>}
                            </div>
                            <div className='input-container'>
                                <label>Product Colors (comma separated)</label>
                                <input
                                    type='text'
                                    onChange={(event) => this.handleOnChangeMultipleValues(event, 'productColors')}
                                    value={this.state.productColors.join(', ')}  // Hiển thị đúng format
                                />
                                {this.state.errors.productColors && <span className="error-message">{this.state.errors.productColors}</span>}
                            </div>
                        </div>

                        {/* Phần bên phải (image preview) */}
                        <div className='right-container'>
                            <div className='input-container'>
                                <label>Product Images</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={this.handleImageUpload}
                                />
                            </div>
                            <div className="image-preview-section">
                                <label>Image Preview</label>
                                {this.renderImagePreview()}
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        className='Btn-cancel'
                        color="secondary"
                        onClick={this.props.toggle}
                    >
                        Cancel
                    </Button>
                    <Button
                        className='Btn-create'
                        color="primary"
                        onClick={this.handleEditProduct}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalEditProduct;
