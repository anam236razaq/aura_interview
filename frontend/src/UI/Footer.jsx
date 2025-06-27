import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="content-footer footer bg-footer-theme">
    <div className="container-xxl">
      <div
        className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
        <div className="text-body">
          ©
            {new Date().getFullYear()}
          , made with ❤️ by <Link to="https://keydevs.com/" target="_blank" className="footer-link">KeyDevs</Link>
        </div>
        <div className="d-none d-lg-inline-block">
          <Link to="/privacy-policy" className="footer-link me-4" target="_blank"
            >Privacy Policy</Link>
          <Link to="/terms-conditions" target="_blank" className="footer-link me-4"
            >Term and Condition</Link>
          <Link
            to="#"
            target="_blank"
            className="footer-link me-4"
            >Documentation</Link>

          <Link to="/contact-us" target="_blank" className="footer-link d-none d-sm-inline-block"
            >Support</Link>
        </div>
      </div>
    </div>
  </footer>
  )
}
