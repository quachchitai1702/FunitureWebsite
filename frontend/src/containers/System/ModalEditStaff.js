import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import './ModalEditStaff.scss';
import _ from 'lodash';

class ModalEditStaff extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            // password: '',
            name: '',
            phone: '',
            imageUrl: '',
            status: '',
            previewImageUrl: '',
            selectedFile: null,
        }


    }


    componentDidMount() {
        let staff = this.props.currentStaff;
        if (staff && !_.isEmpty(staff)) {
            console.log('Staff data:', staff);  // Kiểm tra dữ liệu hiện tại

            this.setState({
                id: staff.id,
                email: staff.email,
                // password: 'harcode',
                name: staff.name,
                phone: staff.phone,
                imageUrl: staff.imageUrl,
                previewImageUrl: staff.imageUrl,
                status: staff.status,
            })
        }
        console.log('dimount edit modal:', this.props.currentStaff)
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
        let arrInput = ['name', 'phone'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    };

    handleEditStaff = async () => {
        let isValid = this.checkValideInput();
        if (isValid === true) {
            this.props.editStaff(this.state);
        }
    };




    render() {
        console.log('check: ', this.props)
        return (
            <Modal
                isOpen={this.props.isOpenEditModal}
                toggle={this.props.toggle}
                className='modal-staff-container'
                size='lg'
            >
                <ModalHeader toggle={this.props.toggle}>Edit Staff Detail</ModalHeader>
                <ModalBody>
                    <div className="modal-staff-body">
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
                                    type="password"
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
                                        alt="Staff Preview"
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
                        onClick={() => { this.handleEditStaff() }}
                    >Save</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalEditStaff;
