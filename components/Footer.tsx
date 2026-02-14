import React from 'react'

export default function Footer() {
  return (
    <footer>
    <div className="container">
        <div className="row justify-content-between">
            <div className="col-lg-4 col-md-6 mb-4">
                <div className="footer-brand">
                    <img src="/assests/images/Logowhite.png" alt="" />
                </div>
                <p className="footer-description">
                    We are a residential interior design firm located in Portland. Our
                    boutique-studio offers more than
                </p>
                <div className="social-links">
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-tiktok"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                </div>
            </div>

            <div className="col-lg-3 col-md-3 col-sm-6 mb-4">
                <h6>Services</h6>
                <ul className="footer-links">
                    <li><a href="#">Bonus program</a></li>
                    <li><a href="#">Gift cards</a></li>
                    <li><a href="#">Credit and payment</a></li>
                    <li><a href="#">Service contracts</a></li>
                    <li><a href="#">Non-cash account</a></li>
                    <li><a href="#">Payment</a></li>
                </ul>
            </div>

            <div className="col-lg-3 col-md-3 col-sm-6 mb-4">
                <h6>Assistance to the buyer</h6>
                <ul className="footer-links">
                    <li><a href="#">Find an order</a></li>
                    <li><a href="#">Terms of delivery</a></li>
                    <li><a href="#">Exchange and return of goods</a></li>
                    <li><a href="#">Guarantee</a></li>
                    <li><a href="#">Frequently asked questions</a></li>
                    <li><a href="#">Terms of use of the site</a></li>
                </ul>
            </div>
        </div>
    </div>
</footer>
  )
}