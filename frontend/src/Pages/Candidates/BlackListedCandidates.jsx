import React, { useCallback, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom';
import Footer from '../../UI/Footer';
import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Constants';
import Pagination from '../../UI/Pagination';
import DeleteModal from '../../UI/DeleteModal';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../../UI/Loader';

export default function BlacklistedCandidates() {
    const[showDeleteModal, setShowDeleteModal] = useState(false);
    const[loading, setLoading] = useState(true);
    const[selectedCandidateId, setSelectedCandidateId] = useState(null);
    const[searchQuery, setSearchQuery] = useState('');
    const[candidatesList, setCandidatesList] = useState([]);
    const[currentPage, setCurrentPage] = useState(1);
    const[totalPages, setTotalPages] = useState(1);
    const[totalEntries, setTotalEntries] = useState(0);
    const[shortlistedFilter, setShortlistedFilter] = useState(true);
    const navigate = useNavigate();
  
    const itemsPerPage = 10;

    const handleCandidateList = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
              const params = new URLSearchParams({
                  page: currentPage,
                  limit: itemsPerPage,
                  status: 'processed'
              });

              if (searchQuery.trim()) {
                  params.append('search', searchQuery.trim());
              }

                params.append('shortlisted', shortlistedFilter);
                

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
          }finally{
            setLoading(false);
          }
      }, [currentPage, searchQuery, shortlistedFilter]);

    //Fetching Candidate List
    useEffect(() => {
    setShortlistedFilter(false);
    const delayDebounce = setTimeout(() => {
      handleCandidateList();
    }, 1000);

      return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage, shortlistedFilter, handleCandidateList]);

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

     //Toggle shortlist candidate
    const handleShortlistToggle = async (cvId, currentlyShortlisted) => {
        try {
            const updatedShortlisted = currentlyShortlisted === 1 ? 0 : 1;
            const token = localStorage.getItem('authToken');

            await axios.post(`${API_BASE_URL}/cv/${cvId}/shortlist`, 
                { shortlisted: updatedShortlisted },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  },
            });

            // Ideally, update the local state to reflect change
            handleCandidateList(currentPage);
 
          } catch (err) {
              console.error('Error toggling shortlist:', err);
          }
        };

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
        <p className='mb-2 text-black' style={{fontSize: '18px', fontWeight: '600'}}>Blacklisted Candidates</p>
        <span>List of blacklisted candidates</span>
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
                                <col data-dt-column="3" style={{width: '8%'}} />
                                <col data-dt-column="4" style={{width: '12%'}} />
                                <col data-dt-column="5" style={{width: '13%'}} />
                            </colgroup>
                            <thead className="border-top">
                              <tr>
                                <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select">
                                  <span className="dt-column-title"></span>
                                  <input className="form-check-input custom-checkbox" type="checkbox" />
                                </th>
                                {[{columnName: 'CANDIDATE NAME', dtColumn: '1'}, {columnName: 'SKILLS', dtColumn: '2'},
                                  {columnName: 'SHORTLIST', dtColumn: '3'}, {columnName: 'STATUS', dtColumn: '4'},
                                  {columnName: 'ACTIONS', dtColumn: '5'}].map((column, index) => (
                                    <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                        <span className="dt-column-title">{column.columnName}</span>
                                    </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {loading? (
                                  <tr>
                                      <td colSpan="6" className="text-center py-5">
                                          <Loader /> 
                                      </td>
                                  </tr>
                              ) :candidatesList.length > 0 ? (
                                candidatesList.map((candidate) => (
                                  <tr key={candidate.id} onClick={()=>navigate(`/candidates/${candidate.id}`)} style={{cursor: 'pointer'}}>
                                  <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" 
                                      type="checkbox" onClick={(e)=>e.stopPropagation()}  /></td>
                                  <td className="sorting_1 text-black">
                                    <div className='d-flex flex-column'>
                                        <span>{candidate.name}</span>
                                        <small>{candidate.email}</small>
                                    </div>
                                  </td>
                                  <td className='text-black'>{candidate.skills}</td>
                                  <td>
                                    <div className="form-check form-switch m-0">
                                      <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onClick={(e)=>e.stopPropagation()} 
                                          checked={candidate.shortlisted === 1} onChange={() => handleShortlistToggle(candidate.id, candidate.shortlisted)}/>
                                    </div>
                                  </td>
                                <td>
                                  <span className="badge bg-label-success">{candidate.status}</span>
                                </td>
                                <td className="dtr-hidden">
                                    <div className="d-flex align-items-center">
                                        <Link to="#" onClick={(e)=>e.stopPropagation()}  className="btn btn-text-secondary rounded-pill waves-effect btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
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