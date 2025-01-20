import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import './ModalAddCategory.scss';
import axios from 'axios';

class ModalAddCategory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            imageUrl: '', // Lưu trữ ảnh được chọn
            previewImageUrl: '', // Lưu trữ ảnh preview
        }

        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            // Reset modal
            this.setState({
                name: '',
                description: '',
                imageUrl: '', // Reset ảnh
                previewImageUrl: '', // Reset ảnh preview
            })
        })
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;

        this.setState({
            ...copyState
        })
    }

    handleOnChangeImage = (event) => {
        this.setState({ imageUrl: event.target.files[0] }); // Lưu file thực tế

    }

    checkValidInput = () => {
        let isValid = true;
        let arrInput = ['name', 'description'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
            }
        }
        return isValid;
    }

    // handleAddNewCategory = async () => {
    //     let isValid = this.checkValidInput();
    //     if (isValid) {
    //         // Thực hiện gọi API để tạo danh mục mới
    //         console.log("Data to be sent:", this.state);

    //         this.props.createNewCategory(this.state);
    //     }
    // }

    handleAddNewCategory = async () => {
        let isValid = this.checkValidInput();
        if (isValid) {
            // Gọi API upload ảnh lên server
            const formData = new FormData();
            formData.append('image', this.state.imageUrl); // Thêm ảnh vào formData

            try {
                // Gửi request upload ảnh
                const uploadResponse = await axios.post('http://localhost:8080/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('uploadResponse: ', uploadResponse);

                if (uploadResponse.data.errCode === 0) {
                    const imageUrl = uploadResponse.data.imageUrl; // Lấy URL của ảnh đã upload thành công

                    // Gửi thông tin danh mục cùng với URL ảnh
                    const categoryData = {
                        name: this.state.name,
                        description: this.state.description,
                        imageUrl: imageUrl, // Đưa URL ảnh vào dữ liệu danh mục
                    };

                    // Gọi API tạo danh mục mới
                    this.props.createNewCategory(categoryData);
                } else {
                    alert('Error uploading image: ' + uploadResponse.data.errMessage);
                }
            } catch (err) {
                console.error('Error uploading image:', err);
                alert('Error uploading image.');
            }
        }
    };

    render() {
        return (
            <Modal
                isOpen={this.props.isOpenAddModal}
                toggle={this.props.toggle}
                className='modal-category-container'
                size='lg'
            >
                <ModalHeader toggle={this.props.toggle}>Create New Category</ModalHeader>
                <ModalBody>
                    <div className='modal-category-body'>
                        <div className='input-container'>
                            <label>Category Name</label>
                            <input
                                type='text'
                                onChange={(event) => { this.handleOnChangeInput(event, "name") }}
                                value={this.state.name}
                            />
                        </div>
                        <div className='input-container'>
                            <label>Description</label>
                            <input
                                type='text'
                                onChange={(event) => { this.handleOnChangeInput(event, "description") }}
                                value={this.state.description}
                            />
                        </div>

                        {/* Thêm input để chọn ảnh */}
                        <div className='input-container'>
                            <label>Category Image</label>
                            <input
                                type='file'
                                onChange={this.handleOnChangeImage}
                            />
                        </div>

                        {/* Preview ảnh sau khi chọn */}
                        {this.state.previewImageUrl && (
                            <div className="image-preview-container">
                                <img
                                    src={this.state.previewImageUrl}
                                    alt="Preview"
                                    className="image-preview"
                                />
                            </div>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="secondary"
                        className='Btn-cancel'
                        onClick={this.props.toggle}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        className='Btn-create'
                        onClick={this.handleAddNewCategory}
                    >
                        Create
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalAddCategory;
