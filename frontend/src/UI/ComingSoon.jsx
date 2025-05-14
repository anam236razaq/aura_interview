import React from 'react'

export default function ComingSoon() {
  return (
    <>
    <div className="container-p-y py-4 mt-3" style={{backgroundImage: 'url(../../assets/img/illustrations/bg-shape-image-light.png)',
        backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom', backgroundSize: '100% 250px',
      }}>
      <div className="misc-wrapper d-flex flex-column align-items-center justify-content-between">
        <h4 className="mb-2 mx-2">We are launching soon 🚀</h4>
        <p className="mb-6 mx-2">Our website is opening soon. Please register to get notified when it's ready!</p>
        <form onsubmit="return false">
          <div className="mb-0">
            <div className="mb-0 d-flex gap-4">
              <input type="text" className="form-control" placeholder="Enter your email" autofocus />
              <button type="submit" className="btn btn-primary">Notify</button>
            </div>
          </div>
        </form>
        <div className="mt-12">
          <img
            src="../../assets/img/illustrations/page-misc-launching-soon.png"
            alt="page-misc-launching-soon"
            width="263"
            className="img-fluid" />
        </div>
      </div>
    </div>
    </>
  )
}
