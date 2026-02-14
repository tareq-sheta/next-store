import React from 'react'

export default function CategoryNav() {
  return (
     <nav className="category-nav d-none d-md-block" >
        <div className="container " >
            <ul className="nav col-12 text-center">
                <li className="nav-item col-6 col-lg-2 col-md-4" data-category="phones">
                    <a className="nav-link" href="#">
                        <i className="fas fa-mobile-alt"></i>Phones
                    </a>
                </li>
                <li className="nav-item col-6 col-lg-2 col-md-4" data-category="computers">
                    <a className="nav-link" href="#">
                        <i className="fas fa-laptop"></i>Computers
                    </a>
                </li>
                <li className="nav-item col-6 col-lg-2 col-md-4" data-category="smartwatch">
                    <a className="nav-link" href="#">
                        <i className="far fa-clock"></i>Smart Watches
                    </a>
                </li>
                <li className="nav-item col-6 col-lg-2 col-md-4" data-category="cameras">
                    <a className="nav-link" href="#">
                        <i className="fas fa-camera"></i>Cameras
                    </a>
                </li>
                <li className="nav-item col-6 col-lg-2 col-md-4" data-category="headphones">
                    <a className="nav-link" href="#">
                        <i className="fas fa-headphones"></i>Headphones
                    </a>
                </li>
                <li className="nav-item col-6 col-lg-2 col-md-4" data-category="gaming">
                    <a className="nav-link" href="#">
                        <i className="fas fa-gamepad"></i>Gaming
                    </a>
                </li>
            </ul>
        </div>
    </nav>
  )
}