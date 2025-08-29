import { useContext, useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import { SidebarContext } from '../Contexts/SidebarContext';
import { API_BASE_URL } from '../utils/Constants';
import axios from 'axios';
import { useProfileData } from '../Contexts/ProfileContext';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';

export default function Navbar() {
  const{ toggleExpandedSidebar } = useContext(SidebarContext);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const {profileData} = useProfileData();

  const clearAuthData = () => {
  const keysToRemove = [
    'authToken',
    'roleId',
    'profileData',
    'interviewFrom',
    'candidateFrom'
  ];

  keysToRemove.forEach(key => localStorage.removeItem(key));
};


  const handleLogout = async () => {
      const token = localStorage.getItem('authToken');

      try {
          await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
              headers: {
                Authorization: `Bearer ${token}`,
      },
    });

      clearAuthData();
      window.location.href = '/login';
  } catch (err) {
      console.error('Logout failed:', err);
  }
};
    
  const userId = profileData?.id
 useEffect(() => {
      let intervalId;

      const fetchNotifications = async ()=> {
        try{
          const token = localStorage.getItem('authToken');
          const response = await axios.get(API_BASE_URL+`/notifications/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          setNotifications(response?.data);
          
          const unread = response?.data.some(n => !n.is_read);
          setHasUnread(unread);

        }catch(error){
            console.log(error);
        }
      }
      fetchNotifications();

      intervalId = setInterval(fetchNotifications, 10000);

      return () => clearInterval(intervalId);
    }, [userId]);

    const handleMarkAllAsRead = async () => {
      try {
        const token = localStorage.getItem('authToken');
        await axios.patch(`${API_BASE_URL}/notifications/mark-all-read/${userId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setNotifications(prev =>
          prev.map(n => ({ ...n, is_read: 1 }))
        );
        setHasUnread(false);
      } catch (error) {
        console.error('Failed to mark notifications as read:', error);
      }
    };

    const handledeleteNotification = async (notificationId) => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success(response?.data?.message);
        setNotifications(prevNotifications =>prevNotifications.filter(notification => notification.id !== notificationId));
      } catch (error) {
        toast.error(error.response.data.message);
        console.log('Error:', error.message);
      }
    };

    const returnToSuperadmin = async () => {
      try {
        const superadminSession = JSON.parse(localStorage.getItem('superadminSession'));
        if (!superadminSession) return;

         // Restore token
        localStorage.setItem('authToken', superadminSession.token);
        localStorage.setItem('roleId', '4'); 

        localStorage.removeItem('superadminSession');
        window.location.href = '/';
        
      } catch (error) {
        console.log(error);
      }
    };


  return (
  <>
    <Toaster reverseOrder={false} position='top-center' />
    <nav
            className="layout-navbar container-xxl navbar-detached navbar navbar-expand-xl align-items-center bg-navbar-theme"
            id="layout-navbar">
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
              <Link className="nav-item nav-link px-0 me-xl-6" onClick={toggleExpandedSidebar}>
                <i className="icon-base ti tabler-menu-2 icon-md"></i>
              </Link>
            </div>

            <div className="navbar-nav-right d-flex align-items-center justify-content-end" id="navbar-collapse">
              <div className="navbar-nav align-items-center">
                <div className="nav-item px-md-0 px-2 mb-0">
                  {localStorage.getItem('superadminSession') && (
                  <button className='btn btn-primary' onClick={returnToSuperadmin}>Back</button>
                  )}
                </div>
              </div>
      
              <ul className="navbar-nav flex-row align-items-center ms-md-auto">
                <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3 me-xl-2">
                  <Link
                    className="nav-link dropdown-toggle hide-arrow btn btn-icon btn-text-secondary rounded-pill"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false">
                    <span className="position-relative">
                      <i className="icon-base ti tabler-bell icon-22px text-heading"></i>
                      {hasUnread && <span className="badge rounded-pill bg-danger badge-dot badge-notifications border"></span>}
                    </span>
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end p-0">
                    <li className="dropdown-menu-header border-bottom">
                      <div className="dropdown-header d-flex align-items-center py-3">
                        <h6 className="mb-0 me-auto">Notification</h6>
                        <div className="d-flex align-items-center h6 mb-0">
                          <Link
                            onClick={handleMarkAllAsRead}
                            className="dropdown-notifications-all p-2 btn btn-icon"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Mark all as read"
                            ><i className="icon-base ti tabler-mail-opened text-heading"></i
                          ></Link>
                        </div>
                      </div>
                    </li>
                    <li className="dropdown-notifications-list scrollable-container">
                      <ul className="list-group list-group-flush">
                        {notifications?.length > 0 ? (
                          notifications.map((item) => (
                          <li className="list-group-item list-group-item-action dropdown-notifications-item" key={item.id}>
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar">
                                <img src={item.profile_image} alt className="rounded-circle" />
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="small mb-1">{item.subject}</h6>
                              <small className="mb-1 d-block text-body">{item.message}</small>
                              <small className="text-body-secondary">{moment(item.created_at).fromNow()}</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                              <Link onClick={()=>handledeleteNotification(item.id)} className="dropdown-notifications-archive"
                                ><span className="icon-base ti tabler-x"></span
                              ></Link>
                            </div> 
                          </div>
                        </li>
                        ))) : (
                          <div className='d-flex align-items-center justify-content-center py-5'>
                              <span className="text-center">No Notifications found</span>
                          </div>
                        )}
                      </ul>
                    </li>
                    {!notifications && <li className="border-top">
                      <div className="d-grid p-4">
                        <Link className="btn btn-primary btn-sm d-flex" to="#">
                          <small className="align-middle">View all notifications</small>
                        </Link>
                      </div>
                    </li> }
                  </ul>
                </li>

                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                  <Link
                    className="nav-link dropdown-toggle hide-arrow p-0"
                    to="#"
                    data-bs-toggle="dropdown">
                    <div className="avatar avatar-online">
                      <img src={profileData?.profile_image} alt className="rounded-circle" />
                    </div>
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <div className="dropdown-item mt-0" style={{pointer: 'cursor'}}>
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-2">
                            <div className="avatar avatar-online">
                              <img src={profileData?.profile_image} alt className="rounded-circle" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-0 text-capitalize">{profileData?.first_name} {profileData?.last_name}</h6>
                            <small className="text-body-secondary text-capitalize">{profileData?.role_name}</small>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="dropdown-divider my-1 mx-n2"></div>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="icon-base ti tabler-user me-3 icon-md"></i
                        ><span className="align-middle">My Profile</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/settings">
                        <i className="icon-base ti tabler-settings me-3 icon-md"></i
                        ><span className="align-middle">Settings</span>
                      </Link>
                    </li>
                  
                    <li>
                      <div className="dropdown-divider my-1 mx-n2"></div>
                    </li>
                    <li>
                      <div className="d-grid px-2 pt-2 pb-1">
                        <Link onClick={handleLogout}  className="btn btn-sm btn-danger d-flex">
                          <small className="align-middle">Logout</small>
                          <i className="icon-base ti tabler-logout ms-2 icon-14px"></i>
                        </Link>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
    </>
  )
}

