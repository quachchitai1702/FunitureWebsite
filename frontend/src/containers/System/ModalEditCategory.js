import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './ModalEditCategory.scss';
import _ from 'lodash';

class ModalEditCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            imageUrl: '',
            previewImageUrl: '',
            selectedFile: null,
        };
    }

    componentDidMount() {
        let category = this.props.currentCategory;
        if (category) {
            this.setState({
                id: category.id,
                name: category.name,
                description: category.description,
                imageUrl: category.imageUrl,
                previewImageUrl: category.imageUrl,
            });
        }
    }


    // componentDidUpdate(prevProps) {
    //     if (prevProps.currentStaff !== this.props.currentStaff && this.props.currentStaff) {
    //         const { id, name, description, imageUrl } = this.props.currentStaff;
    //         this.setState({
    //             id, name, description, imageUrl, previewImageUrl: imageUrl
    //         });
    //     }
    // }

    handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            this.setState({
                selectedFile: file,
                previewImageUrl: previewUrl,
                imageUrl: previewUrl,
            });
        }
    };

    handleOnchangeInput = (event, id) => {
        const value = event.target.value;
        this.setState((prevState) => ({
            ...prevState,
            [id]: value,
            ...(id === 'imageUrl' && { previewImageUrl: value })
        }));
    };

    checkValideInput = () => {
        const { name, description } = this.state;
        if (!name || !description) {
            alert('Missing required fields: Name and Description.');
            return false;
        }
        return true;
    };

    handleEditStaff = async () => {
        if (this.checkValideInput()) {
            this.props.updateCategory(this.state);
        }
    };

    render() {
        const { isOpenEditModal, toggle } = this.props;
        const { name, description, previewImageUrl } = this.state;

        return (
            <Modal
                isOpen={isOpenEditModal}
                toggle={toggle}
                className='modal-staff-container'
                size='lg'
            >
                <ModalHeader toggle={toggle}>Edit Category Detail</ModalHeader>
                <ModalBody>
                    <div className="modal-staff-body">
                        <div className="form-section">
                            <div className="input-container">
                                <label>Name</label>
                                <input
                                    type="text"
                                    onChange={(event) => this.handleOnchangeInput(event, 'name')}
                                    value={name}
                                />
                            </div>
                            <div className="input-container">
                                <label>Description</label>
                                <input
                                    type="text"
                                    onChange={(event) => this.handleOnchangeInput(event, 'description')}
                                    value={description}
                                />
                            </div>
                        </div>

                        <div className="image-preview-section">
                            <div className="image-preview-container">
                                {previewImageUrl ? (
                                    <img
                                        src={previewImageUrl}
                                        alt="Category Preview"
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
                    <Button color="secondary" className='Btn-cancel' onClick={toggle}>
                        Cancel
                    </Button>
                    <Button color="primary" className='Btn-submit' onClick={this.handleEditStaff}>
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalEditCategory;
