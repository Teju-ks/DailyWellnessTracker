// src/layout/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navbar() {
  const [navbarStyle, setNavbarStyle] = useState({
    backgroundColor: 'transparent',
    transition: 'background-color 0.5s',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000
  });

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setNavbarStyle({
        backgroundColor: 'black',
        transition: 'background-color 0.5s',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000
      });
    } else {
      setNavbarStyle({
        backgroundColor: 'transparent',
        transition: 'background-color 0.5s',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000
      });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light shadow" style={navbarStyle}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#" style={{ color: 'white', zIndex: 0 }}>
            Mindfullme
          </a>
          <div className="btn-group" role="group" aria-label="Basic outlined example">
            <Link to="/login">
              <button type="button" className="btn btn-outline-primary" style={{ borderColor: 'white', color: 'white' }}>Login</button>
            </Link>
             
          </div>
        </div>
      </nav>
    </div>
  );
}