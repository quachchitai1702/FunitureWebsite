import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import './ModalAddCategory.scss';

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
        const file = event.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file); // Tạo URL tạm thời cho ảnh
            this.setState({
                imageUrl: previewUrl,
                previewImageUrl: previewUrl // Lưu preview ảnh
            });
        }
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

    handleAddNewCategory = async () => {
        let isValid = this.checkValidInput();
        if (isValid) {
            // Thực hiện gọi API để tạo danh mục mới
            console.log("Data to be sent:", this.state);

            this.props.createNewCategory(this.state);
        }
    }

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
