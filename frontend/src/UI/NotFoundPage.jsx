import React from 'react'

export default function NotFoundPage() {
  return (
    <div className="container-p-y mt-3" style={{backgroundImage: 'url(../../assets/img/illustrations/bg-shape-image-light.png)',
      backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom', backgroundSize: '100% 250px',
    }}>
    <div className="misc-wrapper d-flex flex-column align-items-center justify-content-between">
      <h1 className="mb-2 mx-2" style={{lineHeight: '6rem', fontSize: '6rem'}}>404</h1>
      <h4 className="mb-2 mx-2">Page Not Found️ ⚠️</h4>
      <p className="mb-6 mx-2">we couldn't find the page you are looking for</p>
      <a href="index.html" className="btn btn-primary mb-10">Back to home</a>
      <div className="mt-4">
        <img
          src="../../assets/img/illustrations/page-misc-error.png"
          alt="page-misc-error-light"
          width="225"
          className="img-fluid" />
      </div>
    </div>
  </div>
   )
}
