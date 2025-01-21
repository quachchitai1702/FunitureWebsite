import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./Home.scss";

import bn1 from "../../assets/Image/bn1.png";
import bn2 from "../../assets/Image/bn2.png";
import bn3 from "../../assets/Image/bn3.png";
import bn4 from "../../assets/Image/bn4.png";

class Home extends Component {
    componentDidMount() {
        console.log("ID from Redux:", this.props.id);
        console.log("Customer Info from Redux:", this.props.customerInfor);
    }

    render() {
        return (
            <div className="home-container">
                {/* Banner 1 */}
                <div className="banner">
                    <div className="banner-text">
                        <h2>We create home
                            more aesthetic</h2>
                        <p>
                            At Harmony Decor, our mission is to make every home a work of art. Through carefully designed, high-quality furniture, we transform spaces into beautiful, functional environments that inspire and comfort.
                        </p>
                        <div className="banner-buttons">
                            <Link to="/storesystem/shop" className="btn btn-solid">Get Started</Link>
                        </div>
                    </div>
                    <div className="banner-image">
                        <img src={bn1} alt="Nội thất sang trọng" />
                    </div>
                </div>

                {/* Banner 2 */}
                <div className="banner banner">
                    <div className="banner-image">
                        <img src={bn2} alt="Thiết kế hiện đại" />
                    </div>
                    <div className="banner-text">
                        <h2>The Best
                            Funiture
                            Manufacturerg</h2>
                        <p>
                            We are committed to excellence in every piece we create. As a leading furniture manufacturer, Harmony Decor combines premium materials with meticulous craftsmanship to deliver furniture that stands the test of time.
                        </p>
                        <div className="banner-buttons">
                            <Link to="/storesystem/shop" className="btn btn-outline">Get Started</Link>
                        </div>
                    </div>
                </div>

                {/* Banner 3 */}
                <div className="banner banner">
                    <div className="banner-text">
                        <h2>Many Unique Funiture</h2>
                        <p>
                            Explore our unique collection! From contemporary to classic, our range offers one-of-a-kind pieces that allow you to express your personal style while enhancing the character of your home.
                        </p>
                    </div>
                    <div className="banner-image">
                        <img src={bn3} alt="Sản phẩm chất lượng" />
                    </div>
                </div>

                <div className="div-text">
                    <h2 className="text">Your Benefits</h2>
                    <div className="underline"></div> {/* Thêm thanh ngang bên dưới */}
                </div>

                {/* Banner 4 */}
                <div className="banner banner">
                    <div className="banner-image">
                        <img src={bn4} alt="Nội thất đẳng cấp" />
                    </div>
                    <div className="banner-text">
                        <h2>Investing in Quality and Style</h2>
                        <p>
                            Investing in Harmony Decor means choosing quality that lasts and style that resonates. Our pieces are designed to elevate any space, allowing you to create a home environment that reflects your taste and enhances your lifestyle.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        isLoggedIn: state.customer.isLoggedIn,
        id: state.customer.id,
        customerInfor: state.customer.customerInfor,
    };
};

export default connect(mapStateToProps)(Home);
