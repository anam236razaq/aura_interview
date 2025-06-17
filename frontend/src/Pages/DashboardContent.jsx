import React from 'react'
import Footer from '../UI/Footer'
import { Link } from 'react-router-dom'

export default function DashboardContent() {

return (
  <div className="content-wrapper">
  <div className="container-xxl flex-grow-1 container-p-y"> 
      Dashboard Content
  </div>
  <Footer />
  <div className="content-backdrop fade"></div>
  </div>
  )
}
