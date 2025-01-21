import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./About.scss";

import aboutImage from "../../assets/Image/about.png";

class About extends Component {
    componentDidMount() {
        console.log("Redux Props:", this.props);
    }

    render() {
        return (
            <div className="about-container">
                {/* Tiêu đề chính */}
                <div className="div-text">
                    <h2 className="text">About us</h2>
                    <div className="underline"></div> {/* Thanh ngang bên dưới */}
                </div>

                {/* Banner */}
                <div className="banner">
                    <div className="banner-text">
                        {/* Đoạn giới thiệu */}
                        <p>
                            <strong>Welcome to Harmony Decor</strong> – your destination for beautiful, high-quality furniture that transforms houses into homes.
                        </p>

                        <p>
                            At <strong>Harmony Decor</strong>, we believe that your space should reflect your unique style, offer lasting comfort, and create a sense of balance.
                            That’s why we are dedicated to offering furniture pieces that are not only aesthetically pleasing but also functional and crafted to stand the test of time.
                        </p>

                        {/* Mô tả bộ sưu tập */}
                        <p>
                            Our curated collection includes a wide variety of designs, from timeless classics to modern styles, allowing you to choose pieces that perfectly suit your taste.
                            We take pride in using <strong>sustainable materials</strong> and prioritizing quality in every detail, ensuring that our furniture is both <strong>eco-conscious</strong> and enduring.
                            Each piece at Harmony Decor is made with careful attention to craftsmanship and designed to enhance the beauty and harmony of your home.
                        </p>

                        {/* Điểm mạnh của thương hiệu */}
                        <h3>Why Choose Harmony Decor?</h3>
                        <ul>
                            <li><strong>Exceptional Quality</strong> – We are committed to providing furniture that combines durability with beauty, ensuring long-lasting satisfaction.</li>
                            <li><strong>Unique & Customizable Pieces</strong> – Our collection offers unique styles and customizable options, so you can tailor your furniture to fit your space.</li>
                            <li><strong>Sustainable Choices</strong> – We prioritize eco-friendly materials and processes, supporting a greener future.</li>
                            <li><strong>Customer-Centric Experience</strong> – From personalized design consultations to easy delivery and setup, we make your journey with us seamless and enjoyable.</li>
                        </ul>

                        {/* Lời kêu gọi hành động */}
                        <p>
                            Transform your home into a sanctuary of style and comfort with Harmony Decor.
                            Let us help you create a space that not only looks beautiful but also <strong>feels like home</strong>.
                        </p>
                    </div>

                    {/* Ảnh bên phải */}
                    <div className="banner-image">
                        <img src={aboutImage} alt="Về chúng tôi" />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
