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
import Select from 'react-select';
import Loader from '../../UI/Loader';

export default function CandidateList() {
    const[open, setOpen] = useState(false);
    const[showDeleteModal, setShowDeleteModal] = useState(false);
    const[loading, setLoading] = useState(true);
    const[selectedCandidateId, setSelectedCandidateId] = useState(null);
    const[searchQuery, setSearchQuery] = useState('');
    const[candidatesList, setCandidatesList] = useState([]);
    const[currentPage, setCurrentPage] = useState(1);
    const[totalPages, setTotalPages] = useState(1);
    const[totalEntries, setTotalEntries] = useState(0);
    const[skills, setSkills] = useState([]);
    const[selectedSkill, setSelectedSkill] = useState([]);
    const [shortlisted, setShortlisted] = useState('');
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const toggleDropdown = () => setOpen(!open);

    //Fetching Candidate List
    useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const handleCandidateList = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
              const params = new URLSearchParams({
                  page: currentPage,
                  limit: itemsPerPage,
                  status: 'processed',
                  shortlisted,
                  skills: selectedSkill.join(','),
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

              setCandidatesList(response?.data?.cvs || []);
              setTotalPages(Math.ceil((response?.data?.total || 0) / itemsPerPage)); 
              setTotalEntries(response?.data?.total)
          } catch (error) {
            console.log(error);
          }finally{
            setLoading(false);
          }
      };

      handleCandidateList();
    }, 1000);

      return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage, shortlisted, selectedSkill]);

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
      setCandidatesList(prev =>
        prev.map(c =>
          c.id === cvId ? { ...c, shortlisted: updatedShortlisted } : c
        )
      );
 
  } catch (err) {
    console.error('Error toggling shortlist:', err);
  }
};

    useEffect(()=> {
        const skillQuery = selectedSkill.length > 0? selectedSkill.join(',') : "";

        const fetchSkills = async () => {
        try{
          const token = localStorage.getItem('authToken');
          const response = await axios.get(API_BASE_URL+ '/skills', {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": 'application/json'
            },
            params: {
                skills: skillQuery

            }
          })
          setSkills(response?.data);
        }catch(error){
          console.log(error);
        } 
    }

    fetchSkills();

    }, [selectedSkill]);

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
              <div className="col-md-6 user_role">
                
                  <Select options={skills?.skills?.map(skill => ({ label: skill, value: skill }))}
                      isMulti name="skills" className="basic-multi-select" classNamePrefix="select skills"
                        value={skills?.skills?.map(skill => ({ label: skill, value: skill }))
                          .filter(option => selectedSkill.includes(option.value))}
                              onChange={(selectedOptions) =>{
                                const selectedValues= selectedOptions.map(option => option.value);
                                    setSelectedSkill(selectedValues);
                  }}/>
              </div>
              <div className="col-md-6 user_role">
                <select id="Shortlist" className='form-select text-capitalize' 
                  value={shortlisted} onChange={(e) => setShortlisted(e.target.value)}>
                    <option value="">Select Shortlist</option>
                    <option value= 'true' className='text-capitalize'>Active</option>
                    <option value= 'false' className='text-capitalize'>Deactive</option>
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
                                ) : candidatesList.length > 0 ? (
                                candidatesList.map((candidate) => (
                                  <tr key={candidate.id} onClick={()=>{navigate(`/candidates/${candidate.id}?from=list`); localStorage.setItem('candidateFrom', 'list');}} style={{cursor: 'pointer'}}>
                                  <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" 
                                      type="checkbox" onClick={(e)=>e.stopPropagation()} /></td>
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
                                        <Link to="#" onClick={(e)=>e.stopPropagation()} className="btn btn-text-secondary rounded-pill waves-effect btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                          <i className="icon-base ti tabler-dots-vertical icon-22px"></i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-end m-0" onClick={(e)=>e.stopPropagation()}>
                                            <button className="dropdown-item"
                                              onClick={() => {
                                                  localStorage.setItem('candidateFrom', 'list');
                                                  navigate(`/candidates/${candidate.id}?from=list`);}}>View
                                            </button>
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