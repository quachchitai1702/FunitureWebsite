import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import './ModalAddCustomer.scss';

class ModalAddCustomer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            phone: '',
            address: '',
        }

        this.listenToEmitter();

    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            //reset modal
            this.setState({
                email: '',
                password: '',
                name: '',
                phone: '',
                address: '',
            })
        })
    }

    componentDidMount() {

    }

    handleOnchangeInput = (event, id) => {

        let copyState = { ...this.state };
        copyState[id] = event.target.value;

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
            }
        }
        return isValid;
    }

    handleAddNewCustomer = async () => {
        let isValid = this.checkValideInput();
        if (isValid === true) {
            //call Api
            this.props.createNewCustomer(this.state);

        }
    }




    render() {
        return (
            <Modal
                isOpen={this.props.isOpenAddModal}
                toggle={this.props.toggle}
                className='modal-customer-container'
                size='lg'
            >
                <ModalHeader toggle={this.props.toggle}>Create New Customer</ModalHeader>
                <ModalBody>
                    <div className='modal-customer-body'>
                        <div className='input-container'>
                            <label>Email</label>
                            <input type='text'
                                onChange={((event) => { this.handleOnchangeInput(event, "email") })}
                                value={this.state.email}
                            ></input>
                        </div>
                        <div className='input-container'>
                            <label>Password</label>
                            <input type='password'
                                onChange={((event) => { this.handleOnchangeInput(event, "password") })}
                                value={this.state.password}

                            ></input>
                        </div>

                        <div className='input-container'>
                            <label>Name</label>
                            <input type='text'
                                onChange={((event) => { this.handleOnchangeInput(event, "name") })}
                                value={this.state.name}

                            ></input>
                        </div>
                        <div className='input-container'>
                            <label>Phone</label>
                            <input type='text'
                                onChange={((event) => { this.handleOnchangeInput(event, "phone") })}
                                value={this.state.phone}

                            ></input>
                        </div>
                        <div className='input-container input-m-width'>
                            <label>Address</label>
                            <input type='text'
                                onChange={((event) => { this.handleOnchangeInput(event, "address") })}
                                value={this.state.address}
                            ></input>
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
                        className='Btn-create'
                        onClick={() => { this.handleAddNewCustomer() }}
                    >Create</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalAddCustomer;
