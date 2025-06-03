import React, { useState } from 'react'
import { Link} from 'react-router-dom';
import Footer from '../../UI/Footer';
import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Constants';
import Pagination from '../../UI/Pagination';
import DeleteModal from '../../UI/DeleteModal';
import toast, { Toaster } from 'react-hot-toast';

export default function ShortlistedCandidates() {
    const[showDeleteModal, setShowDeleteModal] = useState(false);
    const[selectedCandidateId, setSelectedCandidateId] = useState(null);
    const[searchQuery, setSearchQuery] = useState('');
    const[candidatesList, setCandidatesList] = useState([]);
    const[currentPage, setCurrentPage] = useState(1);
    const[totalPages, setTotalPages] = useState(1);
    const[totalEntries, setTotalEntries] = useState(0);
    const[shortlistedFilter, setShortlistedFilter] = useState(false)

  
    const itemsPerPage = 10;

    //Fetching Candidate List
    useEffect(() => {
    setShortlistedFilter(true)
    const delayDebounce = setTimeout(() => {
      const handleCandidateList = async () => {
        try {
            const token = localStorage.getItem('authToken');
              const params = new URLSearchParams({
                  page: currentPage,
                  limit: itemsPerPage,
              });

              if (searchQuery.trim()) {
                  params.append('search', searchQuery.trim());
              }

              if (shortlistedFilter) {  // <-- Make sure you have shortlistedFilter state somewhere
                    params.append('shortlisted', shortlistedFilter);
                }

              const endPoint = `${API_BASE_URL}/cv?${params.toString()}`;

              const response = await axios.get(endPoint, {
                  headers: {
                      "Content-Type": 'application/json',
                      Authorization: `Bearer ${token}`
                  }
              });

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
  }, [searchQuery, currentPage, shortlistedFilter]);

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
        <p className='mb-2 text-black' style={{fontSize: '18px', fontWeight: '600'}}>Shortlisted Candidates</p>
        <span>List of shortlisted candidates</span>
      </div>
      <div className="card">
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
                <div className="justify-content-between dt-layout-table">
                    <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                      <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                        aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                            <colgroup>
                                <col data-dt-column="0" style={{width: '10%'}} />
                                <col data-dt-column="1" style={{width: '15%'}} />
                                <col data-dt-column="2" style={{width: '32%'}} />
                                <col data-dt-column="3" style={{width: '20%'}} />
                                <col data-dt-column="4" style={{width: '13%'}} />
                            </colgroup>
                            <thead className="border-top">
                              <tr>
                                <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select">
                                  <span className="dt-column-title"></span>
                                  <input className="form-check-input custom-checkbox" type="checkbox" />
                                </th>
                                {[{columnName: 'CANDIDATE NAME', dtColumn: '1'}, {columnName: 'SKILLS', dtColumn: '2'},
                                  {columnName: 'STATUS', dtColumn: '3'},
                                  {columnName: 'ACTIONS', dtColumn: '4'}].map((column, index) => (
                                    <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                        <span className="dt-column-title">{column.columnName}</span>
                                    </th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody>
                              {candidatesList.length > 0 ? (
                                candidatesList.map((candidate) => (
                                  <tr key={candidate.id}>
                                  <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" type="checkbox" /></td>
                                  <td className="sorting_1 text-black">
                                    <div className='d-flex flex-column'>
                                        <span>{candidate.name}</span>
                                        <small>{candidate.email}</small>
                                    </div>
                                  </td>
                                  <td className='text-black'>{candidate.skills}</td>
                                <td>
                                  <span className="badge bg-label-success">{candidate.status}</span>
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
                                ))) : (
                                <tr>
                                      <td colSpan="6" className="text-center">No Candidates found</td>
                                </tr>
                                )}
                          </tbody>
                      </table>
                      {showDeleteModal && <DeleteModal confirmDelete ={confirmDelete} setShowDeleteModal= {setShowDeleteModal} />}
                    </div>
                </div>
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} 
                  totalEntries={totalEntries} handlePageChange = {handlePageChange}
                  totalPages={totalPages} list ={candidatesList}/>
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