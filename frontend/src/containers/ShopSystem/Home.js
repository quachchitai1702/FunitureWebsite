import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
class Home extends Component {

    state = {

    }

    componentDidMount() {
        console.log('ID from Redux:', this.props.id);
        console.log('Customer Info from Redux:', this.props.customerInfor);

    }


    render() {
        return (
            <div className="text-center" >Manage products</div>
        )
    }

}

const mapStateToProps = state => {
    console.log('Redux state:', state);  // Thêm log này để kiểm tra trạng thái Redux
    return {
        language: state.app.language,
        isLoggedIn: state.customer.isLoggedIn,
        id: state.customer.id,  // Lấy id từ Redux
        customerInfor: state.customer.customerInfor,  // Lấy customerInfor từ Redux

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
