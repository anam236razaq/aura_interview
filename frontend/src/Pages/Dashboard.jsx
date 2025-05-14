import React from 'react'
import Navbar from '../UI/Navbar'
import Sidebar from '../UI/Sidebar'
import { Link, Outlet } from 'react-router-dom'


export default function Dashboard() {

  return (
    <>
    <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
            <Sidebar />
            <div className="menu-mobile-toggler d-xl-none rounded-1">
                <Link to="#" className="layout-menu-toggle menu-link text-large text-bg-secondary p-2 rounded-1">
                  <i className="ti tabler-menu icon-base"></i>
                  <i className="ti tabler-chevron-right icon-base"></i>
                </Link>
            </div>
            <div className="layout-page">
                <Navbar />
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
      </div>
    </>
  )
}