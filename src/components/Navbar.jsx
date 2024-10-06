// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ display: 'inline', margin: '0 10px' }}>
          <Link to="/">Home</Link>
        </li>
        <li style={{ display: 'inline', margin: '0 10px' }}>
          <Link to="/about">About</Link>
        </li>
        <li style={{ display: 'inline', margin: '0 10px' }}>
          <Link to="/contact">Contact</Link>
        </li>
        <li style={{ display: 'inline', margin: '0 10px' }}>
          <Link to="/blog">Blog</Link> {/* New Blog link */}
        </li>
        <li style={{ display: 'inline', margin: '0 10px' }}>
  <Link to="/victorina">Victorina</Link> {/* Link to Victorina */}
</li>
<li style={{ display: 'inline', margin: '0 10px' }}>
  <Link to="/FruitTracker">FruitTracker</Link> {/* Link to Victorina */}
</li>
<li style={{ display: 'inline', margin: '0 10px' }}>
  <Link to="/WebSocketClient">WebSocketClient</Link> {/* Link to Victorina */}
</li>
<li style={{ display: 'inline', margin: '0 10px' }}>
  <Link to="/store">store</Link> {/* Link to Victorina */}
</li>
<li style={{ display: 'inline', margin: '0 10px' }}>
  <Link to="/market">market</Link> {}
</li>
<li style={{ display: 'inline', margin: '0 10px' }}>
  <Link to="/crossword">crossword</Link> {}
</li>

<li style={{ display: 'inline', margin: '0 10px' }}>
  <Link to="/BookShowing">Book</Link> {}
</li>
<li style={{ display: 'inline', margin: '0 10px' }}>
  <Link to="/TourUpload">TourUpload</Link> {}
</li>
<li style={{ display: 'inline', margin: '0 10px' }}>
  <Link to="/TourShowcase">TourUpload</Link> {}
</li>
 </ul>
    </nav>
  );
};

export default Navbar;
