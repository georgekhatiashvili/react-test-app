// SubNav.js
import React from 'react';
import { Link } from 'react-router-dom';

const SubNav = () => {
    return (
        <nav className="sub-nav">
            <ul className="nav">
                <li className="nav-item">
                    <Link to="/store" className="nav-link">Store</Link>
                </li>
                <li className="nav-item">
                    <Link to="/cart" className="nav-link">Cart</Link>
                </li>
                <li className="nav-item">
                    <Link to="/profile" className="nav-link">Profile</Link>
                </li>
                {/* Add more links as needed */}
            </ul>
        </nav>
    );
};

export default SubNav;
