import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ModalAddCustomer extends React.Component {
    render() {
        return (
            <Modal
                isOpen={this.props.modalOpen}
                toggle={this.props.toggle}
                className='modal-customer-container'
                size='lg'
            >
                <ModalHeader toggle={this.props.toggle}>Create New Customer</ModalHeader>
                <ModalBody>
                    <div className='modal-customer-body'>
                        <div className='input-container'>
                            <label>Email</label>
                            <input type='text'></input>
                        </div>
                        <div className='input-container'>
                            <label>Password</label>
                            <input type='password'></input>
                        </div>

                        <div className='input-container'>
                            <label>Name</label>
                            <input type='text'></input>
                        </div>
                        <div className='input-container'>
                            <label>Phone</label>
                            <input type='text'></input>
                        </div>
                        <div className='input-container input-m-width'>
                            <label>Address</label>
                            <input type='text'></input>
                        </div>
                    </div>




                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" className='Btn-cancel' onClick={this.props.toggle}>Cancel</Button>
                    <Button color="primary" className='Btn-create' onClick={this.handleSubmit}>Create</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalAddCustomer;
