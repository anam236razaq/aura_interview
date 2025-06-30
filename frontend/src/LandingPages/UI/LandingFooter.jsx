import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingFooter() {
  return (
    <footer className="landing-footer bg-body footer-text">
      <div className="footer-bottom py-3 py-md-5">
        <div className="container d-flex flex-wrap justify-content-between flex-md-row flex-column text-center text-md-start">
          <div className="mb-2 mb-md-0">
            <span className="footer-bottom-text">© {new Date().getFullYear()} </span>
            <Link to="https://keydevs.com" target="_blank" className="fw-medium text-white" rel="noreferrer">Keydevs,</Link>
            <span className="footer-bottom-text"> Made with ❤️ for a better web.</span>
          </div>
          <div>
            <Link to="https://github.com" className="me-2 text-white fs-5" target="_blank" rel="noreferrer">
              <i className="bi bi-github fs-6"></i>
            </Link>
            <Link to="https://www.facebook.com" className="me-2 text-white fs-5" target="_blank" rel="noreferrer">
              <i className="bi bi-facebook fs-6"></i>
            </Link>
            <Link to="https://x.com" className="me-2 text-white fs-5" target="_blank" rel="noreferrer">
              <i className="bi bi-twitter fs-6"></i>
            </Link>
            <Link to="https://www.instagram.com" className="text-white fs-5" target="_blank" rel="noreferrer">
              <i className="bi bi-instagram fs-6"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
