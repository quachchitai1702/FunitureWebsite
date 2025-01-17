import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';

import './App.scss'

import { customerIsAuthenticated, customerIsNotAuthenticated, staffIsAuthenticated, staffIsNotAuthenticated } from '../hoc/authentication';

import { path } from '../utils'

import Home from '../routes/Home';
import Store from '../routes/Store';

import StaffLogin from './Auth/StaffLogin';
import Login from './Auth/Login';


import StoreHeader from './Header/StoreHeader';
import StaffHeader from './Header/StaffHeader';

import System from '../routes/System';
import StoreSystem from '../routes/StoreSystem';


import { CustomToastCloseButton } from '../components/CustomToast';
import ConfirmModal from '../components/ConfirmModal';
import Footer from './Footer/Footer';

class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        const { isCustomerLoggedIn, isStaffLoggedIn } = this.props;

        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <ConfirmModal />

                        {/* Hiển thị header phù hợp cho từng loại người dùng */}
                        {isCustomerLoggedIn && !isStaffLoggedIn && <StoreHeader />}
                        {isStaffLoggedIn && !isCustomerLoggedIn && <StaffHeader />}

                        <div className="content-container">
                            <Switch>
                                <Route path={path.HOME} exact component={Home} />
                                <Route path={path.HOMECUSTOMER} exact component={Store} />
                                <Route path={path.STAFFLOGIN} component={staffIsNotAuthenticated(StaffLogin)} />
                                <Route path={path.SYSTEM} component={staffIsAuthenticated(System)} />
                                <Route path={path.LOGIN} component={customerIsNotAuthenticated(Login)} />
                                <Route path={path.STORESYSTEM} component={customerIsAuthenticated(StoreSystem)} />
                            </Switch>
                        </div>

                        <ToastContainer
                            className="toast-container" toastClassName="toast-item" bodyClassName="toast-item-body"
                            autoClose={false} hideProgressBar={true} pauseOnHover={false}
                            pauseOnFocusLoss={true} closeOnClick={false} draggable={false}
                            closeButton={<CustomToastCloseButton />}
                        />

                        {(isCustomerLoggedIn || isStaffLoggedIn) && <Footer />}

                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isCustomerLoggedIn: state.customer.isLoggedIn,
        isStaffLoggedIn: state.staff.isLoggedIn

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);