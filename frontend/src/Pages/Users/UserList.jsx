import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Footer from '../../UI/Footer';
import UserModel from '../../UI/UserModel';

export default function UserList() {
 const[open, setOpen] = useState(false);
 const[showModal, setShowModal] = useState(false);

  const toggleDropdown = () => setOpen(!open);

  return (
    <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className='mb-4'>
                <p className='mb-2 text-black' style={{fontSize: '18px', fontWeight: '600'}}>User List</p>
                <span>List of users</span>
              </div>
              <div className="card">
                <div className="card-header border-bottom">
                  <h5 className="card-title mb-0">Filters</h5>
                  <div className="d-flex justify-content-between align-items-center row pt-4 gap-4 gap-md-0">
                    <div className="col-md-6 user_status">
                        <select id="FilterTransaction" className='form-select text-capitalize'>
                            <option value>Select Status</option>
                            <option value= 'Active' className='text-capitalize'>Active</option>
                            <option value= 'Deactive' className='text-capitalize'>Deactive</option>
                        </select>
                      </div>
                      <div className="col-md-6 user_role">
                        <select id="UserRole" className='form-select text-capitalize'>
                            <option value>User Type</option>
                            <option value= 'User' className='text-capitalize'>User</option>
                            <option value= 'Owner' className='text-capitalize'>Owner</option>
                        </select>
                      </div>
                  
                  </div>
                </div>
                <div className="card-datatable">
                  <div id='DataTables_Table_0_wrapper' className='dt-container dt-bootstrap5 dt-empty-footer'>
                    <div className='row my-0 justify-content-between'>
                        <div className='d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto'>
                            <div className='dt-search mt-5' style={{marginLeft: '1.5rem', marginRight: '1.5rem'}}>
                              <input type="search" className="form-control" id="dt-search-0" placeholder="Search User" aria-controls="DataTables_Table_0" />
                              <label htmlFor='dt-search-0'></label>
                            </div>
                            
                        </div>
                        <div className="d-md-flex align-items-center dt-layout-end col-md-auto ms-auto d-flex gap-md-4 justify-content-md-between justify-content-center gap-2 flex-wrap">
                            <div className='dt-length mt-m0 mt-md-5'>
                                <select name='DataTables_Table_0_length' aria-controls="DataTables_Table_0" className="form-select ms-0"
                                  id="dt-length-0">
                                      <option value= '10'>10</option>
                                      <option value= '25'>25</option>
                                      <option value= '50'>50</option>
                                      <option value= '100'>100</option>
                                  </select>
                                  <label htmlFor='dt-length-0'></label>
                            </div>
                          <div className="dt-buttons btn-group flex-wrap d-flex gap-4 mb-md-0 mb-4">
                              <div className="btn-group">
                                  <button className="btn buttons-collection btn-label-secondary dropdown-toggle" tabIndex="0"  onClick={toggleDropdown}
                                      aria-controls="DataTables_Table_0" type="button" aria-haspopup="dialog" aria-expanded={open}>
                                        <span>
                                            <span className="d-flex align-items-center gap-2">
                                                <i className="icon-base ti tabler-upload icon-xs"></i>
                                                <span className="d-none d-sm-inline-block">Export</span>
                                            </span>
                                        </span>
                                  </button>
                                  {open && (<div className="dt-button-background fixed inset-0 z-10" onClick={() => setOpen(false)}></div>)}
                                  <div className={`dropdown-menu dt-button-collection fade ${open ? 'show' : ''}`} aria-modal="true" role="dialog" style={{ top: '50px', left: '0px' }}>
                                      <div role='menu'>
                                          <Link className="dt-button dropdown-item buttons-print" tabIndex="0"  aria-controls="DataTables_Table_0" to='#'>
                                              <span>
                                                <span className="d-flex align-items-center">
                                                    <i className="icon-base ti tabler-printer me-1"></i>
                                                    Print
                                                </span>
                                              </span>
                                          </Link>
                                          <Link className="dt-button dropdown-item buttons-csv buttons-html5" tabIndex="0"  aria-controls="DataTables_Table_0" to='#'>
                                              <span>
                                                <span className="d-flex align-items-center">
                                                    <i className="icon-base ti tabler-file-text me-1"></i>
                                                    Csv
                                                </span>
                                              </span>
                                          </Link> 
                                          <Link className="dt-button dropdown-item buttons-excel buttons-html5" tabIndex="0"  aria-controls="DataTables_Table_0" to='#'>
                                              <span>
                                                <span className="d-flex align-items-center">
                                                    <i className="icon-base ti tabler-file-spreadsheet me-1"></i>
                                                    Excel
                                                </span>
                                              </span>
                                          </Link>
                                          <Link className="dt-button dropdown-item buttons-pdf buttons-html5" tabIndex="0"  aria-controls="DataTables_Table_0" to='#'>
                                              <span>
                                                <span className="d-flex align-items-center">
                                                    <i className="icon-base ti tabler-file-description me-1"></i>
                                                    Pdf
                                                </span>
                                              </span>
                                          </Link>
                                          <Link className="dt-button dropdown-item buttons-copy buttons-html5" tabIndex="0"  aria-controls="DataTables_Table_0" to='#'>
                                              <span>
                                                <span className="d-flex align-items-center">
                                                    <i className="icon-base ti tabler-copy me-1"></i>
                                                    Copy
                                                </span>
                                              </span>
                                          </Link>
                                      </div>
                                  </div>
                                  <button className="btn add-new btn-primary ms-4 override-radius" tabIndex="0" aria-controls="DataTables_Table_0" type="button" onClick={()=>setShowModal(true)} style={{marginRight: '1.5rem',}}>
                                    <span>
                                      <span className="d-flex align-items-center gap-2">
                                          <i className="icon-base ti tabler-plus icon-xs"></i>
                                          <span className="d-none d-sm-inline-block">Add User</span>
                                      </span>
                                    </span>
                                  </button>
                                  {showModal && <UserModel setShowModal={setShowModal} /> }
                              </div>
                          </div>
                        </div>
                        <div className="justify-content-between dt-layout-table">
                            <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                              <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                                aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                                    <colgroup>
                                        <col data-dt-column="0" style={{width: '10%'}} />
                                        <col data-dt-column="1" style={{width: '15%'}} />
                                        <col data-dt-column="2" style={{width: '15%'}} />
                                        <col data-dt-column="3" style={{width: '15%'}} />
                                        <col data-dt-column="4" style={{width: '18%'}} />
                                        <col data-dt-column="5" style={{width: '12%'}} />
                                        <col data-dt-column="6" style={{width: '15%'}} />
                                    </colgroup>
                                    <thead className="border-top">
                                      <tr>
                                        <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select dt-orderable-none" aria-label="">
                                          <span className="dt-column-title"></span>
                                          <span className="dt-column-order"></span>
                                          <input className="form-check-input custom-checkbox" type="checkbox" aria-label="Select all rows" />
                                        </th>
                                        <th data-dt-column="1" rowSpan="1" colSpan="1" className="dt-orderable-asc dt-orderable-desc dt-ordering-desc" aria-sort="descending"  tabIndex="0">
                                          <span className="dt-column-title" role="button">FULL NAME</span>
                                          <span className="dt-column-order"></span>
                                        </th>
                                        <th data-dt-column="2" rowSpan="1" colSpan="1" className="dt-orderable-asc dt-orderable-desc" tabIndex="0">
                                          <span className="dt-column-title" role="button">EMAIL</span>
                                          <span className="dt-column-order"></span>
                                        </th>
                                        <th data-dt-column="3" rowSpan="1" colSpan="1" className="dt-orderable-asc dt-orderable-desc" tabIndex="0">
                                          <span className="dt-column-title" role="button">ACTIVE/DEACTIVE</span>
                                          <span className="dt-column-order"></span>
                                        </th>
                                        <th data-dt-column="4" rowSpan="1" colSpan="1" className="dt-orderable-asc dt-orderable-desc" tabIndex="0">
                                          <span className="dt-column-title" role="button">REGISTER DATE</span>
                                          <span className="dt-column-order"></span>
                                        </th>
                                        <th data-dt-column="5" rowSpan="1" colSpan="1" className="dt-orderable-asc dt-orderable-desc" tabIndex="0" >
                                          <span className="dt-column-title" role="button">TYPE</span>
                                          <span className="dt-column-order"></span>
                                        </th>
                                        <th data-dt-column="6" rowSpan="1" colSpan="1" className="dt-orderable-none" >
                                          <span className="dt-column-title">ACTIONS</span>
                                          <span className="dt-column-order"></span>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" type="checkbox" /></td>
                                        <td className="sorting_1 text-black">Asif Ali</td>
                                        <td className='text-black'>admin@gmail.com</td>
                                        <td>
                                          <div className="form-check form-switch m-0">
                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                          </div>
                                        </td>
                                        <td style={{color: '#5232C2B2'}}>20-10-2024</td>
                                      <td>
                                        <span className="badge bg-label-success">Owner</span>
                                      </td>
                                      <td className="dtr-hidden">
                                          <div className="d-flex align-items-center">
                                              <Link to="#" className="btn btn-text-secondary rounded-pill waves-effect btn-icon delete-record">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 38 38" fill="none">
                                                      <path d="M16.25 14.4167H13.5C12.4874 14.4167 11.6666 15.2375 11.6666 16.25V24.5C11.6666 25.5125 12.4874 26.3334 13.5 26.3334H21.75C22.7625 26.3334 23.5833 25.5125 23.5833 24.5V21.75" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                      <path d="M16.25 21.75H19L26.7917 13.9583C27.5511 13.1989 27.5511 11.9677 26.7917 11.2083C26.0323 10.4489 24.8011 10.4489 24.0417 11.2083L16.25 19V21.75" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                      <path d="M22.6666 12.5833L25.4166 15.3333" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                  </svg>
                                              </Link>
                                              <Link to="#" className="btn btn-text-secondary rounded-pill waves-effect btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                <i className="icon-base ti tabler-dots-vertical icon-22px"></i>
                                              </Link>
                                              <div className="dropdown-menu dropdown-menu-end m-0">
                                                  <Link to="#" className="dropdown-item">Edit</Link>
                                                  <Link to="#" className="dropdown-item">Suspend</Link>
                                              </div>
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                          <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" type="checkbox" /></td>
                                          <td className="sorting_1 text-black">Ali Haider</td>
                                          <td className='text-black'>ali@gmail.com</td>
                                          <td>
                                              <div className="form-check form-switch m-0">
                                                  <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                              </div>
                                          </td>
                                          <td style={{color: '#5232C2B2'}}>20-10-2024</td>
                                          <td>
                                            <span className="badge bg-label-danger">User</span>
                                          </td>
                                          <td className="dtr-hidden">
                                              <div className="d-flex align-items-center">
                                                  <Link to="#" className="btn btn-text-secondary rounded-pill waves-effect btn-icon delete-record">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 38 38" fill="none">
                                                      <path d="M16.25 14.4167H13.5C12.4874 14.4167 11.6666 15.2375 11.6666 16.25V24.5C11.6666 25.5125 12.4874 26.3334 13.5 26.3334H21.75C22.7625 26.3334 23.5833 25.5125 23.5833 24.5V21.75" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                      <path d="M16.25 21.75H19L26.7917 13.9583C27.5511 13.1989 27.5511 11.9677 26.7917 11.2083C26.0323 10.4489 24.8011 10.4489 24.0417 11.2083L16.25 19V21.75" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                      <path d="M22.6666 12.5833L25.4166 15.3333" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                  </Link>
                                                  <Link to="#" className="btn btn-text-secondary rounded-pill waves-effect btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                      <i className="icon-base ti tabler-dots-vertical icon-22px"></i>
                                                  </Link>
                                                  <div className="dropdown-menu dropdown-menu-end m-0">
                                                    <Link to="#" className="dropdown-item">Edit</Link>
                                                    <Link to="#" className="dropdown-item">Suspend</Link>
                                                  </div>
                                              </div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" type="checkbox" /></td>
                                          <td className="sorting_1 text-black">Kashif Abbasi</td>
                                          <td className='text-black'>kashif@gmail.com</td>
                                          <td>
                                              <div className="form-check form-switch m-0">
                                                  <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                              </div>
                                          </td>
                                          <td style={{color: '#5232C2B2'}}>20-10-2024</td>
                                          <td>
                                            <span className="badge bg-label-success">Owner</span>
                                          </td>
                                          <td className="dtr-hidden">
                                              <div className="d-flex align-items-center">
                                                  <Link to="#" className="btn btn-text-secondary rounded-pill waves-effect btn-icon delete-record">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 38 38" fill="none">
                                                      <path d="M16.25 14.4167H13.5C12.4874 14.4167 11.6666 15.2375 11.6666 16.25V24.5C11.6666 25.5125 12.4874 26.3334 13.5 26.3334H21.75C22.7625 26.3334 23.5833 25.5125 23.5833 24.5V21.75" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                      <path d="M16.25 21.75H19L26.7917 13.9583C27.5511 13.1989 27.5511 11.9677 26.7917 11.2083C26.0323 10.4489 24.8011 10.4489 24.0417 11.2083L16.25 19V21.75" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                      <path d="M22.6666 12.5833L25.4166 15.3333" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                  </Link>
                                                  <Link to="#" className="btn btn-text-secondary rounded-pill waves-effect btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                      <i className="icon-base ti tabler-dots-vertical icon-22px"></i>
                                                  </Link>
                                                  <div className="dropdown-menu dropdown-menu-end m-0">
                                                    <Link to="#" className="dropdown-item">Edit</Link>
                                                    <Link to="#" className="dropdown-item">Suspend</Link>
                                                  </div>
                                              </div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" type="checkbox" /></td>
                                          <td className="sorting_1 text-black">Ali Haider</td>
                                          <td className='text-black'>ali@gmail.com</td>
                                          <td>
                                              <div className="form-check form-switch m-0">
                                                  <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                              </div>
                                          </td>
                                          <td style={{color: '#5232C2B2'}}>20-10-2024</td>
                                          <td>
                                            <span className="badge bg-label-success">Owner</span>
                                          </td>
                                          <td className="dtr-hidden">
                                              <div className="d-flex align-items-center">
                                                  <Link to="#" className="btn btn-text-secondary rounded-pill waves-effect btn-icon delete-record">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 38 38" fill="none">
                                                      <path d="M16.25 14.4167H13.5C12.4874 14.4167 11.6666 15.2375 11.6666 16.25V24.5C11.6666 25.5125 12.4874 26.3334 13.5 26.3334H21.75C22.7625 26.3334 23.5833 25.5125 23.5833 24.5V21.75" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                      <path d="M16.25 21.75H19L26.7917 13.9583C27.5511 13.1989 27.5511 11.9677 26.7917 11.2083C26.0323 10.4489 24.8011 10.4489 24.0417 11.2083L16.25 19V21.75" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                      <path d="M22.6666 12.5833L25.4166 15.3333" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                  </Link>
                                                  <Link to="#" className="btn btn-text-secondary rounded-pill waves-effect btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                      <i className="icon-base ti tabler-dots-vertical icon-22px"></i>
                                                  </Link>
                                                  <div className="dropdown-menu dropdown-menu-end m-0">
                                                    <Link to="#" className="dropdown-item">Edit</Link>
                                                    <Link to="#" className="dropdown-item">Suspend</Link>
                                                  </div>
                                              </div>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                            </div>
                        </div>
                        <div className="row mx-3 justify-content-between">
                          <div className="mt-0 mt-sm-4 d-md-flex align-items-center dt-layout-start col-md-auto me-auto d-flex justify-content-md-between justify-content-center">
                            <div className="dt-info" aria-live="polite" id="DataTables_Table_0_info" role="status">
                              Showing 1 to 4 of 4 entries
                            </div>
                          </div>
                          <div className="me-4 mt-4 d-md-flex align-items-center dt-layout-end col-md-auto ms-auto d-flex gap-md-4 justify-content-md-between justify-content-center gap-2 flex-wrap">
                            <div className="dt-paging">
                              <nav aria-label="pagination">
                                <ul className="pagination">
                                  <li className="dt-paging-button page-item disabled">
                                    <button className="page-link first" role="link" type="button" aria-controls="DataTables_Table_0" aria-disabled="true" aria-label="First" data-dt-idx="first" tabIndex="-1">
                                      <i className="icon-base ti tabler-chevrons-left scaleX-n1-rtl icon-18px"></i>
                                    </button>
                                  </li>
                                  <li className="dt-paging-button page-item disabled">
                                    <button className="page-link previous" role="link" type="button" aria-controls="DataTables_Table_0" aria-disabled="true" aria-label="Previous" data-dt-idx="previous" tabIndex="-1">
                                      <i className="icon-base ti tabler-chevron-left scaleX-n1-rtl icon-18px"></i>
                                    </button>
                                  </li>
                                  <li className="dt-paging-button page-item active">
                                    <button className="page-link me-1" role="link" type="button" aria-controls="DataTables_Table_0" aria-current="page" data-dt-idx="0">1</button>
                                  </li>
                                  <li classN="dt-paging-button page-item">
                                    <button className="page-link" role="link" type="button" aria-controls="DataTables_Table_0" data-dt-idx="1">2</button>
                                  </li>
                                  <li className="dt-paging-button page-item">
                                    <button className="page-link" role="link" type="button" aria-controls="DataTables_Table_0" data-dt-idx="2">3</button>
                                  </li>
                                  <li className="dt-paging-button page-item">
                                    <button className="page-link next" role="link" type="button" aria-controls="DataTables_Table_0" aria-label="Next" data-dt-idx="next">
                                      <i className="icon-base ti tabler-chevron-right scaleX-n1-rtl icon-18px"></i>
                                    </button>
                                  </li>
                                  <li className="dt-paging-button page-item">
                                      <button className="page-link last" role="link" type="button" aria-controls="DataTables_Table_0" aria-label="Last" data-dt-idx="last">
                                        <i className="icon-base ti tabler-chevrons-right scaleX-n1-rtl icon-18px"></i>
                                      </button>
                                  </li>
                                </ul>
                              </nav>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer/>
          <div className="content-backdrop fade"></div>
    </div>
  )
}
