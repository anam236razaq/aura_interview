import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Constants';
import Footer from '../../UI/Footer';
import Pagination from '../../UI/Pagination';

export default function InterviewList() {
    const[open, setOpen] = useState(false);
    const [interviewList, setInterviewList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    const toggleDropdown = () => setOpen(!open);

    //Fetching Interview List
    useEffect(() => {
      const handleInterviewList = async () => {
        try{
          const token = localStorage.getItem('authToken');
          const response = await axios.get(API_BASE_URL+'/interviews', {
            headers: {
              "Content-Type": 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
          setInterviewList(response?.data);
          console.log(response);

        }catch(error){
          console.log(error);
        }
      }
      handleInterviewList();
    }, []);

    //Pagination
    const totalPages = Math.ceil(interviewList.length/itemsPerPage);
    const endIndex = currentPage * itemsPerPage;
    const startIndex = endIndex - itemsPerPage;
    const currentInterviewList = interviewList.slice(startIndex, endIndex)

    const handlePageChange = (page) => {
      if(page >= 1 && page <= totalPages){
        setCurrentPage(page);
      }
    }

  return (
    <div className="content-wrapper">
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className='mb-4'>
        <p className='mb-2 text-black' style={{fontSize: '18px', fontWeight: '600'}}>Interview List</p>
        <span>List of interviews</span>
      </div>
      <div className="card">
        <div className="card-datatable">
          <div id='DataTables_Table_0_wrapper' className='dt-container dt-bootstrap5 dt-empty-footer'>
            <div className='row my-0 justify-content-between'>
                <div className='d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto'>
                    <div className='dt-search mt-5' style={{marginLeft: '1.5rem', marginRight: '1.5rem'}}>
                      <input type="search" className="form-control" id="dt-search-0" placeholder="Search Interview" aria-controls="DataTables_Table_0" />
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
                          <button className="btn add-new btn-primary ms-4 override-radius" tabIndex="0" aria-controls="DataTables_Table_0" type="button" style={{marginRight: '1.5rem',}}>
                            <span>
                              <span className="d-flex align-items-center gap-2">
                                  <i className="icon-base ti tabler-plus icon-xs"></i>
                                  <span className="d-none d-sm-inline-block">Create Interview</span>
                              </span>
                            </span>
                          </button>
                      </div>
                  </div>
                </div>
                <div className="justify-content-between dt-layout-table">
                    <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                      <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                        aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                            <colgroup>
                                <col data-dt-column="0" style={{width: '10%'}} />
                                <col data-dt-column="1" style={{width: '25%'}} />
                                <col data-dt-column="2" style={{width: '25%'}} />
                                <col data-dt-column="3" style={{width: '20%'}} />
                                <col data-dt-column="4" style={{width: '20%'}} />
                                <col data-dt-column="5" style={{width: '20%'}} />
                            </colgroup>
                            <thead className="border-top">
                              <tr>
                                <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select">
                                  <span className="dt-column-title"></span>
                                  <input className="form-check-input custom-checkbox" type="checkbox" />
                                </th>
                                {[{columnName: 'TITLE', dtColumn: '1'}, {columnName: 'DESCRIPTION', dtColumn: '2'},
                                  {columnName: 'STATUS', dtColumn: '3'}, {columnName: 'EXPIRY DATE', dtColumn: '4'},
                                  {columnName: 'ACTIONS', dtColumn: '5'}].map((column, index) => (
                                    <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                        <span className="dt-column-title">{column.columnName}</span>
                                    </th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody>
                              {currentInterviewList.map((interview) => (
                                  <tr key={interview.id}>
                                  <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" type="checkbox" /></td>
                                  <td className='text-black'>{interview.title}</td>
                                  <td>{interview.description}</td>
                                  <td style={{color: '#5232C2B2', fontWeight: '600'}}>{interview.status}</td>
                                <td>
                                  <span className="text-black">{new Date(interview.expiry_date).toLocaleDateString()}</span>
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
                                            <Link to={`/interviewed/interview-list/${interview.id}`} className="dropdown-item">View</Link>
                                        </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                      </table>
                    </div>
                </div>
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} 
                  list ={interviewList} handlePageChange = {handlePageChange}
                  totalPages={totalPages}/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    <div className="content-backdrop fade"></div>
    </div>
    )
}