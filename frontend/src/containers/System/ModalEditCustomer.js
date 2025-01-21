import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import './ModalEditCustomer.scss';
import _ from 'lodash';
import { CommonUtils } from '../../utils';


class ModalEditCustomer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            // password: '',
            name: '',
            phone: '',
            address: '',
            imageUrl: '',
            status: '',
            previewImageUrl: '',
            selectedFile: null,
        }


    }


    componentDidMount() {
        let customer = this.props.currentCustomer;
        if (customer && !_.isEmpty(customer)) {
            // console.log('Customer data:', customer);
            let imageBase64 = '';
            if (customer.imageUrl) {
                imageBase64 = new Buffer(customer.imageUrl, 'base64').toString('binary');
            }


            this.setState({
                id: customer.id,
                email: customer.email,
                // password: customer.password,
                name: customer.name,
                phone: customer.phone,
                address: customer.address,
                imageUrl: customer.imageUrl,
                previewImageUrl: imageBase64,
                status: customer.status,
            })
        }
        console.log('dimount edit modal:', this.props.currentCustomer)
    }

    handleFileChange = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            // console.log('File base64:', base64);
            let previewUrl = URL.createObjectURL(file);
            this.setState({
                selectedFile: file,
                previewImageUrl: previewUrl,
                imageUrl: base64,
            });
        }
    };




    handleOnchangeInput = (event, id) => {

        let copyState = { ...this.state };
        copyState[id] = event.target.value;

        if (id === 'imageUrl') {
            copyState.previewImageUrl = event.target.value;
        }

        this.setState({
            ...copyState
        })
    }

    checkValideInput = () => {
        let isValid = true;
        let arrInput = ['name', 'phone', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    };

    handleEditCustomer = async () => {
        let isValid = this.checkValideInput();
        if (isValid === true) {
            this.props.editCustomer(this.state);
        }
    };




    render() {
        console.log('check: ', this.props)
        return (
            <Modal
                isOpen={this.props.isOpenEditModal}
                toggle={this.props.toggle}
                className='modal-customer-container'
                size='lg'
            >
                <ModalHeader toggle={this.props.toggle}>Edit Customer Detail</ModalHeader>
                <ModalBody>
                    <div className="modal-customer-body">
                        {/* Phần chỉnh sửa bên trái */}
                        <div className="form-section">
                            <div className="input-container">
                                <label>Email</label>
                                <input
                                    type="text"
                                    onChange={(event) => this.handleOnchangeInput(event, 'email')}
                                    value={this.state.email}
                                    disabled
                                />
                            </div>
                            {/* <div className="input-container">
                                <label>Password</label>
                                <input
                                    type="text"
                                    onChange={(event) => this.handleOnchangeInput(event, 'password')}
                                    value={this.state.password}
                                    disabled
                                />
                            </div> */}
                            <div className="input-container">
                                <label>Name</label>
                                <input
                                    type="text"
                                    onChange={(event) => this.handleOnchangeInput(event, 'name')}
                                    value={this.state.name}
                                />
                            </div>
                            <div className="input-container">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    onChange={(event) => this.handleOnchangeInput(event, 'phone')}
                                    value={this.state.phone}
                                />
                            </div>
                            <div className="input-container input-m-width">
                                <label>Address</label>
                                <input
                                    type="text"
                                    onChange={(event) => this.handleOnchangeInput(event, 'address')}
                                    value={this.state.address}
                                />
                            </div>
                            <div className="input-container">
                                <label>Status</label>
                                <select
                                    onChange={(event) => this.handleOnchangeInput(event, 'status')}
                                    value={this.state.status}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                        </div>

                        {/* Phần hiển thị ảnh bên phải */}
                        <div className="image-preview-section">
                            <div className="image-preview-container">
                                {this.state.previewImageUrl ? (
                                    <img
                                        src={this.state.previewImageUrl}
                                        alt="Customer Preview"
                                        className="preview-image"
                                    />
                                ) : (
                                    <p>No image selected</p>
                                )}
                            </div>
                            <label>Add Image</label>
                            <input type="file" onChange={this.handleFileChange} />

                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="secondary"
                        className='Btn-cancel'
                        onClick={this.props.toggle}
                    >Cancel</Button>
                    <Button
                        color="primary"
                        className='Btn-submit'
                        onClick={() => { this.handleEditCustomer() }}
                    >Save</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalEditCustomer;
