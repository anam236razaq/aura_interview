import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingFooter() {
  return (
    <footer className="landing-footer bg-body footer-text">
      <div className="footer-top position-relative overflow-hidden z-1">
        <img src="./assets/img/front-pages/backgrounds/footer-bg.png"
          alt="footer bg" className="footer-bg banner-bg-img z-n1" />
        <div className="container">
          <div className="row gx-0 gy-6 g-lg-10">
            <div className="col-lg-5">
              <Link to="#" className="app-brand-link mb-6 ms-3">
                <span className="app-brand-logo demo">
                  <span className="text-primary">
                    <img src=".././assets/img/logo-transparent.png" alt="AuraInterview" />
                  </span>
                </span>
              </Link>
              <p className="footer-text footer-logo-description mb-6 ms-3">
                Most developer friendly & highly customisable Admin Dashboard Template.
              </p>
              <form className="footer-form ms-3">
                <label htmlFor="footer-email" className="small">
                  Subscribe to newsletter
                </label>
                <div className="d-flex mt-1">
                  <input type="email" className="form-control rounded-0 rounded-start-bottom rounded-start-top"
                    id="footer-email" placeholder="Your email" />
                  <button type="submit"
                    className="btn btn-primary shadow-none rounded-0 rounded-end-bottom rounded-end-top waves-effect waves-light">
                      Subscribe
                  </button>
                </div>
              </form>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6">
              <h6 className="footer-title mb-6">Pages</h6>
              <ul className="list-unstyled">
                <li className="mb-5">
                  <Link to="#" target="_blank" className="footer-link" rel="noreferrer">Pricing</Link>
                </li>
                <li className="mb-5">
                  <Link to="#" target="_blank" className="footer-link" rel="noreferrer">
                    Payment <span className="badge bg-primary ms-2">New</span>
                  </Link>
                </li>
                <li className="mb-5">
                  <Link to="#" target="_blank" className="footer-link" rel="noreferrer">Maintenance</Link>
                </li>
                <li className="mb-5">
                  <Link to="#" target="_blank" className="footer-link" rel="noreferrer">Coming Soon</Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6">
              <h6 className="footer-title mb-6">Products</h6>
              <ul className="list-unstyled">
                <li className="mb-5"><Link to="#" className="footer-link">Page Builder</Link></li>
                <li className="mb-5"><Link to="#" className="footer-link">Admin Dashboards</Link></li>
                <li className="mb-5"><Link to="#" className="footer-link">UK Kits</Link></li>
                <li className="mb-5"><Link to="#" className="footer-link">Illustrations</Link></li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-4">
              <h6 className="footer-title mb-6">Download our app</h6>
              <Link to="#" className="d-block mb-4">
                <img src="./assets/img/front-pages/landing-page/apple-icon.png" alt="apple icon" />
              </Link>
              <Link to="#" className="d-block">
                <img src="./assets/img/front-pages/landing-page/google-play-icon.png" alt="google play icon" />
              </Link>
            </div>
          </div>
        </div>
      </div>

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
