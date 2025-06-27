import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingNavbar() {
  const navbarStyle = {
    position: 'static',
    insetBlockStart: 'auto',
    insetInline: 'auto'
  };

  return (
    <nav className="layout-navbar shadow-none py-0" style={navbarStyle}>
      <div className="container">
        <div className="navbar navbar-expand-lg landing-navbar px-3 px-md-8">
          <div className="navbar-brand app-brand demo d-flex py-0 me-4 me-xl-8 ms-0">
            <Link to="#" className="app-brand-link">
              <span className="app-brand-logo demo">
                <span><img src=".././assets/img/logo.png" alt="AuraInterview"/></span>
              </span>
            </Link>
          </div>

          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li>
              <Link to="/login" className="btn btn-primary waves-effect waves-light" target="_blank" rel="noreferrer">
                <span className="d-md-block">Login</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
