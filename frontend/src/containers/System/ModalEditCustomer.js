import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import './ModalEditCustomer.scss';
import _ from 'lodash';

class ModalEditCustomer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
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
            console.log('Customer data:', customer);  // Kiểm tra dữ liệu hiện tại

            this.setState({
                id: customer.id,
                email: customer.email,
                password: 'harcode',
                name: customer.name,
                phone: customer.phone,
                address: customer.address,
                imageUrl: customer.imageUrl,
                previewImageUrl: customer.imageUrl,
                status: customer.status,
            })
        }
        console.log('dimount edit modal:', this.props.currentCustomer)
    }

    handleFileChange = (event) => {
        let file = event.target.files[0];
        if (file) {
            let previewUrl = URL.createObjectURL(file);
            this.setState({
                selectedFile: file,
                previewImageUrl: previewUrl,
                imageUrl: previewUrl, // Cập nhật trực tiếp vào trường imageUrl
            });
        }
    };

    // handleUploadFile = async () => {
    //     if (!this.state.selectedFile) {
    //         alert('Please select an image to upload!');
    //         return;
    //     }

    //     console.log('Uploading file:', this.state.selectedFile); // Kiểm tra tệp đã chọn


    //     // Giả lập quá trình upload lên server
    //     let formData = new FormData();
    //     formData.append('imageUrl', this.state.selectedFile); // Đảm bảo tên trường 'imageUrl'

    //     try {
    //         let response = await fetch('https://your-server.com/upload', {
    //             method: 'POST',
    //             body: formData,
    //         });
    //         let data = await response.json();

    //         if (data && data.imageUrl) {
    //             this.setState({
    //                 imageUrl: data.imageUrl,
    //                 previewImageUrl: data.imageUrl,
    //             });
    //             alert('Upload successful!');
    //         } else {
    //             alert('Upload failed!');
    //         }
    //     } catch (error) {
    //         console.error('Error uploading file:', error);
    //         alert('An error occurred while uploading the file.');
    //     }
    // };



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
        let arrInput = ['email', 'password', 'name', 'phone', 'address'];
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
                            <div className="input-container">
                                <label>Password</label>
                                <input
                                    type="password"
                                    onChange={(event) => this.handleOnchangeInput(event, 'password')}
                                    value={this.state.password}
                                    disabled
                                />
                            </div>
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
