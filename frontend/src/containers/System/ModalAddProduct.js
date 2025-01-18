import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import { emitter } from '../../utils/emitter';

import './ModalAddProduct.scss';

class ModalAddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        };

        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
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
        copyState[id] = event.target.value.split(',');
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
        const { name, price, categoryInput, material, stock, description } = this.state;
        if (!name || !price || !categoryInput || !material || !stock || !description) {
            alert('Please fill in all fields!');
            return false;
        }
        return true;
    };

    handleAddNewProduct = async () => {
        let isValid = this.checkValidInput();
        if (isValid) {
            let newProductData = { ...this.state };

            // Thay đổi categoryInput thành categoryId
            newProductData.categoryId = newProductData.categoryInput;
            delete newProductData.categoryInput;

            // console.log('data input: ', newProductData);
            this.props.createNewProduct(newProductData);

            this.setState({
                isOpenAddModal: false
            });
            emitter.emit('EVENT_CLEAR_MODAL_DATA');
        }
    };


    renderImagePreview = () => {
        const { productImages } = this.state;
        return productImages.map((imageUrl, index) => {
            if (imageUrl.trim()) {
                return (
                    <div key={index} className="image-preview-container">
                        <img src={imageUrl} alt={`Product Image ${index}`} className="image-preview" />
                    </div>
                );
            }
            return null;
        });
    };

    render() {
        return (
            <Modal
                isOpen={this.props.isOpenAddModal}
                toggle={this.props.toggle}
                className='modal-add-product-container'
                size='lg'
            >
                <ModalHeader toggle={this.props.toggle}>Create New Product</ModalHeader>
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
                            </div>
                            <div className='input-container'>
                                <label>Price</label>
                                <input
                                    type='number'
                                    onChange={(event) => this.handleOnchangeInput(event, 'price')}
                                    value={this.state.price}
                                />
                            </div>
                            <div className='input-container'>
                                <label>Category</label>
                                <input
                                    type='text'
                                    onChange={(event) => this.handleOnchangeInput(event, 'categoryInput')}
                                    value={this.state.categoryInput}
                                    placeholder="Enter product category"
                                />
                            </div>
                            <div className='input-container'>
                                <label>Material</label>
                                <input
                                    type='text'
                                    onChange={(event) => this.handleOnchangeInput(event, 'material')}
                                    value={this.state.material}
                                />
                            </div>
                            <div className='input-container'>
                                <label>Stock Quantity</label>
                                <input
                                    type='number'
                                    onChange={(event) => this.handleOnchangeInput(event, 'stock')}
                                    value={this.state.stock}
                                />
                            </div>
                            <div className='input-container'>
                                <label>Description</label>
                                <textarea
                                    onChange={(event) => this.handleOnchangeInput(event, 'description')}
                                    value={this.state.description}
                                />
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
                                    value={this.state.productTypes.join(', ')}
                                />
                            </div>
                            <div className='input-container'>
                                <label>Product Colors (comma separated)</label>
                                <input
                                    type='text'
                                    onChange={(event) => this.handleOnChangeMultipleValues(event, 'productColors')}
                                    value={this.state.productColors.join(', ')}
                                />
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
                        onClick={this.handleAddNewProduct}
                    >
                        Create
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }

}

export default ModalAddProduct;
