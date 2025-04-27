import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <div className='navbar'>
      {/* <Link to='/'><img className='logo' src="path/to/logo" alt="Logo" /></Link> */}
      <ul className="navbar-menu">
        {/* <Link to="/" className="menu-item">Home</Link> */}
        <a href="#explore-menu" className="menu-item">Menu</a>
        <a href="#app-download" className="menu-item">Mobile App</a>
        <a href="#footer" className="menu-item">Contact Us</a>
      </ul>
      <div className="navbar-right">
        {/* <Link to="/cart"> */}
          <img src="path/to/basket-icon" alt="Basket" />
        {/* </Link> */}
        <button>Sign In</button>
      </div>
    </div>
  )
}

export default Navbar
