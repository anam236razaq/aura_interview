import React from 'react'

export default function NotAuthorized() {
  return (
       <div className="container-p-y mt-3" style={{backgroundImage: 'url(../../assets/img/illustrations/bg-shape-image-light.png)',
        backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom', backgroundSize: '100% 250px',
      }}>
      <div className="misc-wrapper d-flex flex-column align-items-center justify-content-between">
        <h1 className="mb-2 mx-2" style={{lineHeight: '6rem', fontSize: '6rem'}}>401</h1>
        <h4 className="mb-2 mx-2">You are not authorized! 🔐</h4>
        <p className="mb-6 mx-2">You don’t have permission to access this page. Go Home!</p>
        <a href="index.html" className="btn btn-primary">Back to home</a>
        <div className="mt-12">
          <img
            src="../../assets/img/illustrations/page-misc-you-are-not-authorized.png"
            alt="page-misc-not-authorized"
            width="170"
            className="img-fluid" />
        </div>
      </div>
    </div>
  )
}
