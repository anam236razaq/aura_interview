import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarContext } from '../Contexts/SidebarContext';

export default function Sidebar() {
  const { toggleSidebar, handleMouseEnter, handleMouseLeave, handleLinkClick} = useContext(SidebarContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);

  const toggleMenu = (index) => {
    setIsOpen(prevIndex => (prevIndex === index ? null : index));
  }

  useEffect(() => {
    if(window.PerfectScrollbar && sidebarRef.current){
      const ps = new window.PerfectScrollbar(sidebarRef.current, {
        supressScrollX: true
      });

      return () => {
        ps.destroy();
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const screenWidth = window.innerWidth;
      if(screenWidth < 992 && sidebarRef.current && !sidebarRef.current.contains(event.target)){
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [toggleSidebar])


  const storedFrom = localStorage.getItem('candidateFrom');
  const interviewFrom = localStorage.getItem('interviewFrom');

  const roleId = parseInt(localStorage.getItem('roleId'), 10);
  const isHr = roleId === 3;

  return (
    <aside
      id="layout-menu"
      className="layout-menu menu-vertical menu"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={sidebarRef}
    >
      <div className="app-brand demo">
        <Link to="index.html" className="app-brand-link">
          <span className="app-brand-logo demo">
            <span className="text-primary">
              <svg
                width="32"
                height="22"
                viewBox="0 0 32 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                  fill="currentColor"
                />
                <path
                  opacity="0.06"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                  fill="#161616"
                />
                <path
                  opacity="0.06"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                  fill="#161616"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </span>
          <span className="app-brand-text demo menu-text fw-bold ms-3">Vuexy</span>
        </Link>

        <Link
          className="layout-menu-toggle menu-link text-large ms-auto"
          onClick={toggleSidebar}
        >
          <i className="icon-base ti menu-toggle-icon d-none d-xl-block"></i>
          <i className="icon-base ti tabler-x d-block d-xl-none"></i>
        </Link>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        <li className={`menu-item ${isOpen === 0 ? 'open' : ''}`}>
          <Link to="#" className="menu-link menu-toggle" onClick={()=>toggleMenu(0)}>
            <i className="menu-icon icon-base ti tabler-smart-home mb-1"></i>
            <div data-i18n="Dashboards">Dashboards</div>
            <div className="badge text-bg-danger rounded-pill ms-auto">5</div>
          </Link>
          <ul className="menu-sub">
            <li className="menu-item">
              <Link to="index.html" className="menu-link" onClick={handleLinkClick}>
                <div data-i18n="Analytics">Analytics</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="dashboards-crm.html" className="menu-link" onClick={handleLinkClick}>
                <div data-i18n="CRM">CRM</div>
              </Link>
            </li>
          </ul>
        </li>
        {!isHr && <li className={`menu-item ${isOpen === 1 ? 'open' : ''}`}>
          <Link to="#" className="menu-link menu-toggle" onClick={()=>toggleMenu(1)}>
            <svg className='me-2 mb-1 menu-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <ellipse cx="11" cy="6.41667" rx="3.66667" ry="3.66667" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.5 19.25V17.4167C5.5 15.3916 7.14162 13.75 9.16667 13.75H12.8333C14.8584 13.75 16.5 15.3916 16.5 17.4167V19.25" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div data-i18n="Users">Users</div>
          </Link>
          <ul className="menu-sub">
            <li className="menu-item">
              <Link to="/users/user-list" onClick={handleLinkClick} className={`menu-link ${location.pathname === '/users/user-list' ? 'active-links' : ''}`}>
                <div data-i18n="Users List">Users List</div>
              </Link>
            </li>
          </ul>
        </li>}
        {!isHr && <li className={`menu-item ${isOpen === 2 ? 'open' : ''}`}>
          <Link to="#" className="menu-link menu-toggle" onClick={()=>toggleMenu(2)}>
              <svg className='me-2 mb-1 menu-icon' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="3.5" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            <div data-i18n="Candidate">Candidate</div>
          </Link>
          <ul className="menu-sub">
            <li className="menu-item">
              <Link to="/candidates/cv-import" onClick={() =>{handleLinkClick(); localStorage.removeItem('candidateFrom');}} 
                className={`menu-link ${location.pathname === '/candidates/cv-import' ? 'active-links' : ''}`}>
                <div data-i18n="Bulk CV Import">Bulk CV Import</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/candidates/candidate-list" onClick={() => {handleLinkClick(); localStorage.removeItem('candidateFrom');}} 
                className={`menu-link ${location.pathname === '/candidates/candidate-list' || storedFrom === 'list' ? 'active-links' : ''}`}>
                <div data-i18n="Candidate List">Candidate List</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/candidates/short-listed" onClick={() => {handleLinkClick(); localStorage.removeItem('candidateFrom');}} 
                className={`menu-link ${location.pathname === '/candidates/short-listed' || storedFrom === 'shortlisted' ? 'active-links' : ''}`}>
                <div data-i18n="Short Listed">Short Listed</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/candidates/blacklisted" onClick={() => {handleLinkClick(); localStorage.removeItem('candidateFrom');}} 
                className={`menu-link ${location.pathname === '/candidates/blacklisted' || storedFrom === 'blacklisted' ? 'active-links' : ''}`}>
                <div data-i18n="Blacklisted">Blacklisted</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/candidates/draft-cvs" onClick={() => {handleLinkClick(); localStorage.removeItem('candidateFrom')}} 
                className={`menu-link ${location.pathname === '/candidates/draft-cvs' ? 'active-links' : ''}`}>
                <div data-i18n="Draft CVs">Draft CVs</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/candidates/interviewed" onClick={() => {handleLinkClick(); localStorage.removeItem('candidateFrom')}} 
                className={`menu-link ${location.pathname === '/candidates/interviewed' ? 'active-links' : ''}`}>
                <div data-i18n="Interviewed">Interviewed</div>
              </Link>
            </li>
          </ul>
        </li>}
        <li className={`menu-item ${isOpen === 3 ? 'open' : ''}`}>
          <Link to="#" className="menu-link menu-toggle" onClick={()=>toggleMenu(3)}>
              <svg className='me-2 mb-1 menu-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M12.8334 2.75V6.41667C12.8334 6.92293 13.2438 7.33333 13.75 7.33333H17.4167" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.5834 19.25H6.41671C5.40419 19.25 4.58337 18.4292 4.58337 17.4167V4.58333C4.58337 3.57081 5.40419 2.75 6.41671 2.75H12.8334L17.4167 7.33333V17.4167C17.4167 18.4292 16.5959 19.25 15.5834 19.25Z" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.25 6.41671H9.16667" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.25 11.9167H13.75" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.9166 15.5833H13.75" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div data-i18n="Interview">Interview</div>
          </Link>
          <ul className="menu-sub">
            {!isHr && <li className="menu-item">
              <Link to="/interviewed/create-interview" onClick={() =>{handleLinkClick(); localStorage.removeItem('interviewFrom');}}  className={`menu-link ${location.pathname === '/interviewed/create-interview' ? 'active-links' : ''}`}>
                <div data-i18n="Create a Interview">Create a Interview</div>
              </Link>
            </li>}
            <li className="menu-item">
              <Link to="/interviewed/interview-list" onClick={() =>{handleLinkClick(); localStorage.removeItem('interviewFrom');}} className={`menu-link ${location.pathname === '/interviewed/interview-list' || interviewFrom === 'interviewlist' ? 'active-links' : ''}`}>
                <div data-i18n="Interview List">Interview List</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/interviewed/upcoming-interview" onClick={() =>{handleLinkClick(); localStorage.removeItem('interviewFrom');}} className={`menu-link ${location.pathname === '/interviewed/upcoming-interview' || interviewFrom === 'upcoming' ? 'active-links' : ''}`}>
                <div data-i18n="Upcoming Interview">Upcoming Interview</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/interviewed/expired-interview" onClick={() => {handleLinkClick(); localStorage.removeItem('interviewFrom');}} className={`menu-link ${location.pathname === '/interviewed/expired-interview' || interviewFrom === 'expired' ? 'active-links' : ''}`}>
                <div data-i18n="Expired Interview">Expired Interview</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/interviewed/draft-interviews" onClick={() => {handleLinkClick(); localStorage.removeItem('interviewFrom')}} className={`menu-link ${location.pathname === '/interviewed/draft-interviews' || interviewFrom === 'draft' ? 'active-links' : ''}`}>
                <div data-i18n="Draft Interviews">Draft Interviews</div>
              </Link>
            </li>
          </ul>
        </li>
        <li className={`menu-item ${isOpen === 4 ? 'open' : ''}`}>
          <Link to="#" className="menu-link menu-toggle" onClick={()=>toggleMenu(4)}>
            <svg className='me-2 mb-1 menu-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="4.58337" y="10.0834" width="12.8333" height="9.16667" rx="2" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <ellipse cx="11" cy="14.6667" rx="0.916667" ry="0.916667" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.33337 10.0833V6.41667C7.33337 4.39162 8.975 2.75 11 2.75C13.0251 2.75 14.6667 4.39162 14.6667 6.41667V10.0833" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div data-i18n="Reporting">Reporting</div>
          </Link>
        </li>
        <li className="menu-header small">
            <span className="menu-header-text text-capitalize" data-i18n="Settings">Settings</span>
        </li>
        {!isHr && <li className="menu-item">
          <Link to="/company" onClick={handleLinkClick} className={`menu-link ${location.pathname === '/company' ? 'active-links' : ''}`}>
              <svg className='me-2 mb-1 menu-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M12.8334 2.75V6.41667C12.8334 6.92293 13.2438 7.33333 13.75 7.33333H17.4167" stroke={`${location.pathname === '/company' ? '#ffffff' : '#2F2B3D'}`} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.5834 19.25H6.41671C5.40419 19.25 4.58337 18.4292 4.58337 17.4167V4.58333C4.58337 3.57081 5.40419 2.75 6.41671 2.75H12.8334L17.4167 7.33333V17.4167C17.4167 18.4292 16.5959 19.25 15.5834 19.25Z" stroke={`${location.pathname === '/company' ? '#ffffff' : '#2F2B3D'}`} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            <div data-i18n="Company Page">Company Page</div>
          </Link>
        </li>}
        <li className={`menu-item ${isOpen === 5 ? 'open' : ''}`}>
          <Link to="#" className="menu-link menu-toggle" onClick={()=>toggleMenu(5)}>
            <svg className='me-2 mb-1 menu-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2.75C13.1411 4.64436 15.9357 5.63069 18.7916 5.5C19.6317 8.35774 19.2769 11.434 17.8084 14.0255C16.3399 16.617 13.8832 18.5021 11 19.25C8.11671 18.5021 5.66001 16.617 4.1915 14.0255C2.72299 11.434 2.36821 8.35774 3.20829 5.5C6.06419 5.63069 8.85878 4.64436 11 2.75" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <ellipse cx="11" cy="10.0834" rx="0.916667" ry="0.916667" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 11V13.2917" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div data-i18n="Integration">Integration</div>
          </Link>
        </li>
        <li className={`menu-item ${isOpen === 6 ? 'open' : ''}`}>
          <Link to="#" className="menu-link menu-toggle" onClick={()=>toggleMenu(6)}>
              <svg className='me-2 mb-1 menu-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <ellipse cx="4.58329" cy="11" rx="0.916667" ry="0.916667" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="11" cy="11" r="0.916667" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="17.4167" cy="11" r="0.916667" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div data-i18n="Integration">Notification</div>
          </Link>
        </li>
        <li className={`menu-item ${isOpen === 7 ? 'open' : ''}`}>
          <Link to="#" className="menu-link menu-toggle" onClick={()=>toggleMenu(7)}>
            <svg className='me-2 mb-1 menu-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3.66663" y="3.66669" width="14.6667" height="14.6667" rx="2" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div data-i18n="Integration">Subscription</div>
          </Link>
        </li>
        <li className="menu-header small">
            <span className="menu-header-text text-capitalize" data-i18n="Settings">Support & Help</span>
            <ul className='ps-0'>
            <li className="menu-item">
              <Link to="/documentation" className={`menu-link mt-2 ${location.pathname === '/documentation' ? 'active-links' : ''}`} style={{borderRadius: '0.375rem'}}>
                <svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke={location.pathname === '/documentation' ? '#ffffff' : '#2F2B3D'} strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div data-i18n="Documentation">Documentation</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/support" className={`menu-link mt-2 ${location.pathname === '/support' ? 'active-links' : ''}`} style={{borderRadius: '0.375rem'}}>
                <svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke={location.pathname === '/support' ? '#ffffff' : '#2F2B3D'} strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div data-i18n="Support">Support</div>
              </Link>
            </li>
            </ul>
        </li>
      </ul>
      <div className="ps__rail-x" style={{left: '0px', bottom: '0px'}}>
        <div className="ps__thumb-x" tabIndex="0" style={{left: '0px', width: '0px'}}></div>
      </div>
      <div className="ps__rail-y" style={{top: '0px', height: '195px', right: '4px'}}>
        <div className="ps__thumb-y" tabIndex="0" style={{top: '0px', height: '23px'}}></div>
      </div>
    </aside>
  );
}


