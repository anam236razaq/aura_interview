import { useContext } from 'react';
import { Link} from 'react-router-dom';
import { SidebarContext } from '../Contexts/SidebarContext';
import { API_BASE_URL } from '../utils/Constants';
import axios from 'axios';

export default function Navbar() {
  const{ toggleExpandedSidebar } = useContext(SidebarContext);

  const handleLogout = async () => {
      const token = localStorage.getItem('authToken');

      try {
          await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
              headers: {
                Authorization: `Bearer ${token}`,
      },
    });

    // Remove token on frontend
    localStorage.removeItem('authToken');

    // Redirect to login or homepage
    window.location.href = '/login';
  } catch (err) {
    console.error('Logout failed:', err);
  }
};


  return (
  <>
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
                <div className="nav-item navbar-search-wrapper px-md-0 px-2 mb-0">
                  <Link className="nav-item nav-link search-toggler d-flex align-items-center px-0" to="#">
                    <span className="d-inline-block text-body-secondary fw-normal" id="autocomplete"></span>
                  </Link>
                </div>
              </div>


              <ul className="navbar-nav flex-row align-items-center ms-md-auto">
                <li className="nav-item dropdown-language dropdown">
                  <Link
                    className="nav-link dropdown-toggle hide-arrow btn btn-icon btn-text-secondary rounded-pill"
                    to="#"
                    data-bs-toggle="dropdown">
                    <i className="icon-base ti tabler-language icon-22px text-heading"></i>
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="#" data-language="en" data-text-direction="ltr">
                        <span>English</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="#" data-language="fr" data-text-direction="ltr">
                        <span>French</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="#" data-language="ar" data-text-direction="rtl">
                        <span>Arabic</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="#" data-language="de" data-text-direction="ltr">
                        <span>German</span>
                      </Link>
                    </li>
                  </ul>
                </li>
               
                <li className="nav-item dropdown-shortcuts navbar-dropdown dropdown">
                  <Link
                    className="nav-link dropdown-toggle hide-arrow btn btn-icon btn-text-secondary rounded-pill"
                    to="#"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false">
                    <i className="icon-base ti tabler-layout-grid-add icon-22px text-heading"></i>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end p-0">
                    <div className="dropdown-menu-header border-bottom">
                      <div className="dropdown-header d-flex align-items-center py-3">
                        <h6 className="mb-0 me-auto">Shortcuts</h6>
                        <Link
                          to="#"
                          className="dropdown-shortcuts-add py-2 btn btn-text-secondary rounded-pill btn-icon"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Add shortcuts"
                          ><i className="icon-base ti tabler-plus icon-20px text-heading"></i
                        ></Link>
                      </div>
                    </div>
                    <div className="dropdown-shortcuts-list scrollable-container">
                      <div className="row row-bordered overflow-visible g-0">
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                            <i className="icon-base ti tabler-calendar icon-26px text-heading"></i>
                          </span>
                          <Link to="app-calendar.html" className="stretched-link">Calendar</Link>
                          <small>Appointments</small>
                        </div>
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                            <i className="icon-base ti tabler-file-dollar icon-26px text-heading"></i>
                          </span>
                          <Link to="app-invoice-list.html" className="stretched-link">Invoice App</Link>
                          <small>Manage Accounts</small>
                        </div>
                      </div>
                      <div className="row row-bordered overflow-visible g-0">
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                            <i className="icon-base ti tabler-user icon-26px text-heading"></i>
                          </span>
                          <Link to="app-user-list.html" className="stretched-link">User App</Link>
                          <small>Manage Users</small>
                        </div>
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                            <i className="icon-base ti tabler-users icon-26px text-heading"></i>
                          </span>
                          <Link to="app-access-roles.html" className="stretched-link">Role Management</Link>
                          <small>Permission</small>
                        </div>
                      </div>
                      <div className="row row-bordered overflow-visible g-0">
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                            <i className="icon-base ti tabler-device-desktop-analytics icon-26px text-heading"></i>
                          </span>
                          <Link to="index.html" className="stretched-link">Dashboard</Link>
                          <small>User Dashboard</small>
                        </div>
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                            <i className="icon-base ti tabler-settings icon-26px text-heading"></i>
                          </span>
                          <Link to="pages-account-settings-account.html" className="stretched-link">Setting</Link>
                          <small>Account Settings</small>
                        </div>
                      </div>
                      <div className="row row-bordered overflow-visible g-0">
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                            <i className="icon-base ti tabler-help-circle icon-26px text-heading"></i>
                          </span>
                          <Link to="pages-faq.html" className="stretched-link">FAQs</Link>
                          <small>FAQs & Articles</small>
                        </div>
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                            <i className="icon-base ti tabler-square icon-26px text-heading"></i>
                          </span>
                          <Link to="modal-examples.html" className="stretched-link">Modals</Link>
                          <small>Useful Popups</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3 me-xl-2">
                  <Link
                    className="nav-link dropdown-toggle hide-arrow btn btn-icon btn-text-secondary rounded-pill"
                    to="#"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false">
                    <span className="position-relative">
                      <i className="icon-base ti tabler-bell icon-22px text-heading"></i>
                      <span className="badge rounded-pill bg-danger badge-dot badge-notifications border"></span>
                    </span>
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end p-0">
                    <li className="dropdown-menu-header border-bottom">
                      <div className="dropdown-header d-flex align-items-center py-3">
                        <h6 className="mb-0 me-auto">Notification</h6>
                        <div className="d-flex align-items-center h6 mb-0">
                          <span className="badge bg-label-primary me-2">8 New</span>
                          <Link
                            to="#"
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
                        <li className="list-group-item list-group-item-action dropdown-notifications-item">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar">
                                <img src="../../assets/img/avatars/1.png" alt className="rounded-circle" />
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="small mb-1">Congratulation Lettie 🎉</h6>
                              <small className="mb-1 d-block text-body">Won the monthly best seller gold badge</small>
                              <small className="text-body-secondary">1h ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                              <Link to="#" className="dropdown-notifications-read"
                                ><span className="badge badge-dot"></span
                              ></Link>
                              <Link to="#" className="dropdown-notifications-archive"
                                ><span className="icon-base ti tabler-x"></span
                              ></Link>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item list-group-item-action dropdown-notifications-item">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar">
                                <span className="avatar-initial rounded-circle bg-label-danger">CF</span>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 small">Charles Franklin</h6>
                              <small className="mb-1 d-block text-body">Accepted your connection</small>
                              <small className="text-body-secondary">12hr ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                              <Link to="#" className="dropdown-notifications-read"
                                ><span className="badge badge-dot"></span
                              ></Link>
                              <Link to="#" className="dropdown-notifications-archive"
                                ><span className="icon-base ti tabler-x"></span
                              ></Link>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar">
                                <img src="../../assets/img/avatars/2.png" alt className="rounded-circle" />
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 small">New Message ✉️</h6>
                              <small className="mb-1 d-block text-body">You have new message from Natalie</small>
                              <small className="text-body-secondary">1h ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                              <Link to="#" className="dropdown-notifications-read"
                                ><span className="badge badge-dot"></span
                              ></Link>
                              <Link to="#" className="dropdown-notifications-archive"
                                ><span className="icon-base ti tabler-x"></span
                              ></Link>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item list-group-item-action dropdown-notifications-item">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar">
                                <span className="avatar-initial rounded-circle bg-label-success"
                                  ><i className="icon-base ti tabler-shopping-cart"></i
                                ></span>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 small">Whoo! You have new order 🛒</h6>
                              <small className="mb-1 d-block text-body">ACME Inc. made new order $1,154</small>
                              <small className="text-body-secondary">1 day ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                              <Link to="#" className="dropdown-notifications-read"
                                ><span className="badge badge-dot"></span
                              ></Link>
                              <Link to="#" className="dropdown-notifications-archive"
                                ><span className="icon-base ti tabler-x"></span
                              ></Link>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar">
                                <img src="../../assets/img/avatars/9.png" alt className="rounded-circle" />
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 small">Application has been approved 🚀</h6>
                              <small className="mb-1 d-block text-body"
                                >Your ABC project application has been approved.</small
                              >
                              <small className="text-body-secondary">2 days ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                              <Link to="#" className="dropdown-notifications-read"
                                ><span className="badge badge-dot"></span
                              ></Link>
                              <Link to="#" className="dropdown-notifications-archive"
                                ><span className="icon-base ti tabler-x"></span
                              ></Link>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar">
                                <span className="avatar-initial rounded-circle bg-label-success"
                                  ><i className="icon-base ti tabler-chart-pie"></i
                                ></span>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 small">Monthly report is generated</h6>
                              <small className="mb-1 d-block text-body">July monthly financial report is generated </small>
                              <small className="text-body-secondary">3 days ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                              <Link to="#" className="dropdown-notifications-read"
                                ><span className="badge badge-dot"></span
                              ></Link>
                              <Link to="#" className="dropdown-notifications-archive"
                                ><span className="icon-base ti tabler-x"></span
                              ></Link>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar">
                                <img src="../../assets/img/avatars/5.png" alt className="rounded-circle" />
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 small">Send connection request</h6>
                              <small className="mb-1 d-block text-body">Peter sent you connection request</small>
                              <small className="text-body-secondary">4 days ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                              <Link to="#" className="dropdown-notifications-read"
                                ><span className="badge badge-dot"></span
                              ></Link>
                              <Link to="#" className="dropdown-notifications-archive"
                                ><span className="icon-base ti tabler-x"></span
                              ></Link>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item list-group-item-action dropdown-notifications-item">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar">
                                <img src="../../assets/img/avatars/6.png" alt className="rounded-circle" />
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 small">New message from Jane</h6>
                              <small className="mb-1 d-block text-body">Your have new message from Jane</small>
                              <small className="text-body-secondary">5 days ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                              <Link to="#" className="dropdown-notifications-read"
                                ><span className="badge badge-dot"></span
                              ></Link>
                              <Link to="#" className="dropdown-notifications-archive"
                                ><span className="icon-base ti tabler-x"></span
                              ></Link>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar">
                                <span className="avatar-initial rounded-circle bg-label-warning"
                                  ><i className="icon-base ti tabler-alert-triangle"></i
                                ></span>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 small">CPU is running high</h6>
                              <small className="mb-1 d-block text-body"
                                >CPU Utilization Percent is currently at 88.63%,</small
                              >
                              <small className="text-body-secondary">5 days ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                              <Link to="#" className="dropdown-notifications-read"
                                ><span className="badge badge-dot"></span
                              ></Link>
                              <Link to="#" className="dropdown-notifications-archive"
                                ><span className="icon-base ti tabler-x"></span
                              ></Link>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </li>
                    <li className="border-top">
                      <div className="d-grid p-4">
                        <Link className="btn btn-primary btn-sm d-flex" to="#">
                          <small className="align-middle">View all notifications</small>
                        </Link>
                      </div>
                    </li>
                  </ul>
                </li>

                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                  <Link
                    className="nav-link dropdown-toggle hide-arrow p-0"
                    to="#"
                    data-bs-toggle="dropdown">
                    <div className="avatar avatar-online">
                      <img src="../../assets/img/avatars/1.png" alt className="rounded-circle" />
                    </div>
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item mt-0" to="pages-account-settings-account.html">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-2">
                            <div className="avatar avatar-online">
                              <img src="../../assets/img/avatars/1.png" alt className="rounded-circle" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-0">John Doe</h6>
                            <small className="text-body-secondary">Admin</small>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <div className="dropdown-divider my-1 mx-n2"></div>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="pages-profile-user.html">
                        <i className="icon-base ti tabler-user me-3 icon-md"></i
                        ><span className="align-middle">My Profile</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="pages-account-settings-account.html">
                        <i className="icon-base ti tabler-settings me-3 icon-md"></i
                        ><span className="align-middle">Settings</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="pages-account-settings-billing.html">
                        <span className="d-flex align-items-center align-middle">
                          <i className="flex-shrink-0 icon-base ti tabler-file-dollar me-3 icon-md"></i
                          ><span className="flex-grow-1 align-middle">Billing</span>
                          <span className="flex-shrink-0 badge bg-danger d-flex align-items-center justify-content-center"
                            >4</span
                          >
                        </span>
                      </Link>
                    </li>
                    <li>
                      <div className="dropdown-divider my-1 mx-n2"></div>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="pages-pricing.html">
                        <i className="icon-base ti tabler-currency-dollar me-3 icon-md"></i
                        ><span className="align-middle">Pricing</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="pages-faq.html">
                        <i className="icon-base ti tabler-question-mark me-3 icon-md"></i
                        ><span className="align-middle">FAQ</span>
                      </Link>
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

