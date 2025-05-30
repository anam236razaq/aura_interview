import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../UI/Footer';
import AIReprocessModal from '../../UI/AIReprocessModal';
import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Constants';
import Pagination from '../../UI/Pagination';
import DeleteModal from '../../UI/DeleteModal';
import toast, { Toaster } from 'react-hot-toast';

export default function CandidateList() {
    const[open, setOpen] = useState(false);
    const[showModal, setShowModal] = useState(false);
    const[showDeleteModal, setShowDeleteModal] = useState(false);
    const[selectedCandidateId, setSelectedCandidateId] = useState(null);
    const[searchQuery, setSearchQuery] = useState('');
    const[candidatesList, setCandidatesList] = useState([]);
    const[currentPage, setCurrentPage] = useState(1);
    const[totalPages, setTotalPages] = useState(1);
    const[totalEntries, setTotalEntries] = useState(0);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    
    const toggleDropdown = () => setOpen(!open);

    //Fetching Candidate List
    useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const handleCandidateList = async () => {
        try {
            const token = localStorage.getItem('authToken');
              const params = new URLSearchParams({
                  page: currentPage,
                  limit: itemsPerPage
              });

              if (searchQuery.trim()) {
                  params.append('search', searchQuery.trim());
              }

              const endPoint = `${API_BASE_URL}/cv?${params.toString()}`;

              const response = await axios.get(endPoint, {
                  headers: {
                      "Content-Type": 'application/json',
                      Authorization: `Bearer ${token}`
                  }
              });

              console.log(response)
              setCandidatesList(response?.data?.cvs || []);
              setTotalPages(Math.ceil((response?.data?.total || 0) / itemsPerPage)); 
              setTotalEntries(response?.data?.total)
          } catch (error) {
            console.log(error);
          }
      };

      handleCandidateList();
    }, 1000);

      return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage]);

    const handlePageChange = (page) => {
      if(page >= 1 && page <= totalPages){
        setCurrentPage(page);
      }
    }

    //method for handling id for delete
    const handleDeleteClick = (id) => {
      setSelectedCandidateId(id);
      setShowDeleteModal(true);
    }

    //Deleting Cv of specific candidate
    const confirmDelete = async () => {
      try{
        const token = localStorage.getItem('authToken');
        const response = await axios.delete(`${API_BASE_URL}/cv/${selectedCandidateId}`, {
          headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        setShowDeleteModal(false);
        toast.success(response.data.message);

      }catch(error){
        toast.error(error.response?.data?.message || 'An unexpected error occured');
      }
    }

  return (
    <>
    <Toaster reverseOrder={false} position='top-center' />
    <div className="content-wrapper">
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className='mb-4'>
        <p className='mb-2 text-black' style={{fontSize: '18px', fontWeight: '600'}}>Candidate CV List</p>
        <span>Import bulk CV AI Sorted</span>
      </div>
      <div className="card">
        <div className="card-header border-bottom">
          <h5 className="card-title mb-0">Filters</h5>
          <div className="d-flex justify-content-between align-items-center row pt-4 gap-4 gap-md-0">
            <div className="col-md-4 user_status">
                <select id="FilterTransaction" className='form-select text-capitalize'>
                    <option value>Select Status</option>
                    <option value= 'Inactive' className='text-capitalize'>Inactive</option>
                    <option value= 'Draft' className='text-capitalize'>Draft</option>
                    <option value= 'Processed' className='text-capitalize'>Processed</option>
                    <option value= 'Processing' className='text-capitalize'>Processing</option>
                </select>
              </div>
              <div className="col-md-4 user_role">
                <select id="Skills" className='form-select text-capitalize'>
                    <option value>Select Skills</option>
                    <option value= 'Laravel' className='text-capitalize'>Laravel</option>
                    <option value= 'PHP' className='text-capitalize'>PHP</option>
                    <option value= 'React Js' className='text-capitalize'>React Js</option>
                    <option value= 'HTML' className='text-capitalize'>HTML</option>
                    <option value= 'Designer' className='text-capitalize'>Designer</option>
                    <option value= 'Vue Js' className='text-capitalize'>Vue Js</option>
                    <option value= 'Devops' className='text-capitalize'>Devops</option>
                </select>
              </div>
              <div className="col-md-4 user_role">
                <select id="Shortlist" className='form-select text-capitalize'>
                    <option value>Select Shortlist</option>
                    <option value= 'Active' className='text-capitalize'>Active</option>
                    <option value= 'Deactive' className='text-capitalize'>Deactive</option>
                </select>
              </div>
          </div>
        </div>
        <div className="card-datatable">
          <div id='DataTables_Table_0_wrapper' className='dt-container dt-bootstrap5 dt-empty-footer'>
            <div className='row my-0 justify-content-between'>
                <div className='d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto'>
                    <div className='dt-search mt-5' style={{marginLeft: '1.5rem', marginRight: '1.5rem'}}>
                      <input type="search" className="form-control" id="dt-search-0" placeholder="Search User" 
                          aria-controls="DataTables_Table_0" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
                      <label htmlFor='dt-search-0'></label>
                    </div>
                    
                </div>
                <div className="d-md-flex align-items-center dt-layout-end col-md-auto ms-auto d-flex gap-md-4 justify-content-md-between justify-content-center gap-2 flex-wrap">
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
                          <button className="btn add-new btn-primary ms-4 override-radius" tabIndex="0" aria-controls="DataTables_Table_0" onClick={()=>setShowModal(true)} type="button" style={{backgroundColor: '#7367F03D', border: 'none'}}>
                            <span>
                              <span className="d-flex align-items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 17 20" fill="none">
                                      <path d="M4 18L14 8L12 6L2 16L4 18" stroke="#7367F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M10 8L12 10" stroke="#7367F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M5.99996 6C5.99996 6.73638 6.59691 7.33333 7.33329 7.33333C6.59691 7.33333 5.99996 7.93029 5.99996 8.66667C5.99996 7.93029 5.40301 7.33333 4.66663 7.33333C5.40301 7.33333 5.99996 6.73638 5.99996 6" stroke="#7367F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M12.6667 12.6665C12.6667 13.4029 13.2637 13.9998 14 13.9998C13.2637 13.9998 12.6667 14.5968 12.6667 15.3332C12.6667 14.5968 12.0698 13.9998 11.3334 13.9998C12.0698 13.9998 12.6667 13.4029 12.6667 12.6665" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className="d-none d-sm-inline-block" style={{color: '#7367F0'}}>AI Reprocess</span>
                              </span>
                            </span>
                          </button>
                          {showModal && <AIReprocessModal setShowModal={setShowModal}/>}
                          <button className="btn add-new btn-primary ms-4 override-radius" onClick={()=>navigate('/candidates/cv-import')} tabIndex="0" aria-controls="DataTables_Table_0" type="button" style={{marginRight: '1.5rem',}}>
                            <span>
                              <span className="d-flex align-items-center gap-2">
                                  <i className="icon-base ti tabler-plus icon-xs"></i>
                                  <span className="d-none d-sm-inline-block">Add CV</span>
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
                                <col data-dt-column="1" style={{width: '15%'}} />
                                <col data-dt-column="2" style={{width: '18%'}} />
                                <col data-dt-column="3" style={{width: '12%'}} />
                                <col data-dt-column="4" style={{width: '10%'}} />
                                <col data-dt-column="5" style={{width: '15%'}} />
                                <col data-dt-column="6" style={{width: '10%'}} />
                                <col data-dt-column="7" style={{width: '10%'}} />
                            </colgroup>
                            <thead className="border-top">
                              <tr>
                                <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select">
                                  <span className="dt-column-title"></span>
                                  <input className="form-check-input custom-checkbox" type="checkbox" />
                                </th>
                                {[{columnName: 'CANDIDATE NAME', dtColumn: '1'}, {columnName: 'SKILLS', dtColumn: '2'},
                                  {columnName: 'SHORTLIST', dtColumn: '3'}, {columnName: 'CODE', dtColumn: '4'},
                                  {columnName: 'INTERVIEW', dtColumn: '5'}, {columnName: 'STATUS', dtColumn: '6'},
                                  {columnName: 'ACTIONS', dtColumn: '7'}].map((column, index) => (
                                    <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                        <span className="dt-column-title">{column.columnName}</span>
                                    </th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody>
                              {candidatesList.map((candidate) => (
                                  <tr key={candidate.id}>
                                  <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" type="checkbox" /></td>
                                  <td className="sorting_1 text-black">
                                    <div className='d-flex flex-column'>
                                        <span>{candidate.name}</span>
                                        <small>{candidate.email}</small>
                                    </div>
                                  </td>
                                  <td className='text-black'>Laravel, PHP</td>
                                  <td>
                                    <div className="form-check form-switch m-0">
                                      <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                    </div>
                                  </td>
                                  <td>238474</td>
                                  <td style={{color: '#5232C2B2', fontWeight: '600'}}>20-10-2024</td>
                                <td>
                                  <span className="badge bg-label-success">Processed</span>
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
                                            <Link to={`/candidates/${candidate.id}`} className="dropdown-item">View</Link>
                                            <button onClick={()=> handleDeleteClick(candidate.id)} className="dropdown-item">Delete</button>
                                        </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                      </table>
                      {showDeleteModal && <DeleteModal confirmDelete ={confirmDelete} setShowDeleteModal= {setShowDeleteModal} />}
                    </div>
                </div>
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} 
                  totalEntries={totalEntries} handlePageChange = {handlePageChange}
                  totalPages={totalPages}/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    <div className="content-backdrop fade"></div>
    </div>
    </>
    )
}