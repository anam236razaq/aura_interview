import React from 'react'

export default function UnderMaintenance() {
  return (
    <div className="container-p-y mt-3" style={{backgroundImage: 'url(../../assets/img/illustrations/bg-shape-image-light.png)',
      backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom', backgroundSize: '100% 250px',
    }}>
    <div className="misc-wrapper d-flex flex-column align-items-center justify-content-between">
      <h4 className="mb-2 mx-2">Under Maintenance! 🚧</h4>
      <p className="mb-6 mx-2">Sorry for the inconvenience but we're performing some maintenance at the moment</p>
      <a href="index.html" className="btn btn-primary">Back to home</a>
      <div className="mt-12">
        <img
          src="../../assets/img/illustrations/page-misc-under-maintenance.png"
          alt="page-misc-under-maintenance"
          width="550"
          className="img-fluid" />
      </div>
    </div>
  </div>
  )
}
