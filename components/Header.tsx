import React from 'react'

export default function Header() {
  return (
     <header>
  <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
    <div className="container-fluid d-flex align-items-center justify-content-between">
  
       {/* Brand */}
      <a className="navbar-brand" href="../index.html" id="brand">
        <img src="/assests/images/LogoMainVector.png" alt="Logo" />
      </a>
  
      {/* Center Links (collapsible) */}
      <div className="collapse navbar-collapse justify-content-center order-lg-2" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link main-nav-link active" href="/">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link main-nav-link active" href="/Products.html">Products</a>
          </li>
          <li className="nav-item">
            <a className="nav-link main-nav-link" href="./../about.html">Our Team</a>
          </li>
          <li className="nav-item">
            <a className="nav-link main-nav-link" href="#footer">Contact Us</a>
          </li>
          <li className="nav-item d-none" id="dashboard">
            <a className="btn btn-dark" href="">dashboard</a>
          </li>
        </ul>
      </div>
  
      {/* Right Side (ALWAYS fixed on far-right) */}
      <div className="d-flex align-items-center gap-4 order-lg-3 ms-auto">
        <ul id="authPlaceholder" className="d-flex align-items-center mb-0 p-0 list-unstyled"></ul>
  
        <a id="cart-icon" className="nav-link cart-icon-container position-relative" href="#">
          <i className="fas fa-shopping-cart"></i>
          <span id="cart-badge" className="cart-badge hidden">0</span>
        </a>
  
        {/* Hamburger */}
        <button className="navbar-toggler ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
  
    </div>
  </nav>
  </header>
  )
}