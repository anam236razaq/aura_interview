import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Constants';
import Footer from '../../UI/Footer';
import Pagination from '../../UI/Pagination';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../../UI/Loader';

export default function InterviewResponses() {
    const { interviewId } = useParams();
    const[open, setOpen] = useState(false);
    const[responsesData, setResponsesData] = useState(null);
    const[interviewTitle, setInterviewTitle] = useState('');
    const[loading, setLoading] = useState(true);
    const[searchQuery, setSearchQuery] = useState('');
    const[currentPage, setCurrentPage] = useState(1);
    const[totalPages, setTotalPages] = useState(1);
    const[totalEntries, setTotalEntries] = useState(0);
    const[shortlisted, setShortlisted] = useState('');
    const itemsPerPage = 10;
    
    const toggleDropdown = () => setOpen(!open);
    const navigate = useNavigate();

    //Fetching Candidates List who responded to the interview
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
        const fetchResponses = async () => {
            try {
            setLoading(true);
            setShortlisted('');
            const token = localStorage.getItem('authToken');
            const params = new URLSearchParams({
                page: currentPage,
                limit: itemsPerPage,
                shortlisted
            });

            if (searchQuery.trim()) {
                params.append('search', searchQuery.trim());
            }

            if (!token) {
                toast.error('Authentication token not found.');
                setLoading(false);
                return;
            }

            const endPoint = `${API_BASE_URL}/interviews/${interviewId}/all-responses?${params.toString()}`;

            const response = await axios.get(endPoint, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
            });

            setInterviewTitle(response.data.interviewTitle || 'Interview Responses');
            setResponsesData(response.data.candidates || []);
            setTotalPages(Math.ceil((response?.data?.total || 0) / itemsPerPage)); 
            setTotalEntries(response?.data?.total)

            } catch (err) {
                console.error('Error fetching responses:', err);
                toast.error('Failed to load responses. ' + (err.response?.data?.message || ''));
            } finally {
                setLoading(false);
            }
        };

        fetchResponses();
    }, 500)
    
    return () => clearTimeout(delayDebounce);
    }, [interviewId, currentPage, searchQuery, shortlisted]);

    if(loading) return

    const handlePageChange = (page) => {
      if(page >= 1 && page <= totalPages){
        setCurrentPage(page);
      }
    }

     //Toggle shortlist candidate
    const handleShortlistToggle = async (cvId, currentlyShortlisted) => {
        try {
            const updatedShortlisted = currentlyShortlisted === 1 ? 0 : 1;
            const token = localStorage.getItem('authToken');

            await axios.post(`${API_BASE_URL}/interviews/${interviewId}/shortlist`, 
            { cvId, shortlisted: updatedShortlisted },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            
            // Ideally, update the local state to reflect change
            setResponsesData(prev =>
            prev.map(c =>
                c.cvId === cvId ? { ...c, shortlisted: updatedShortlisted } : c
            ));

        } catch (err) {
            console.error('Error toggling shortlist:', err);
        }
    };

  return (
    <>
    <Toaster position='top-center' reverseOrder={false} />
    <div className="content-wrapper">
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className='mb-4 d-flex align-items-center justify-content-between'>
            <h4 className='text-black'>{interviewTitle}</h4>
            <Link to={`/interviewed/interview-list/${interviewId}`} className="btn text-white mb-3 py-3" style={{backgroundColor: '#7367f0'}}>Back to Interview Details</Link>
      </div>
      <div className="card">
        <div className="card-datatable">
          <div id='DataTables_Table_0_wrapper' className='dt-container dt-bootstrap5 dt-empty-footer'>
            <div className='row my-0 justify-content-between'>
                <div className='d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto'>
                    <div className='dt-search mt-5' style={{marginLeft: '1.5rem', marginRight: '1.5rem'}}>
                      <input type="search" className="form-control" id="dt-search-0" placeholder="Search User" 
                          aria-controls="DataTables_Table_0" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
                      <label htmlFor='dt-search-0'></label>
                    </div>
                    
                </div>
                <div className="d-md-flex align-items-center dt-layout-end col-md-auto ms-auto d-flex gap-md-4 justify-content-md-between justify-content-center gap-2 flex-wrap">
                  <div className="dt-buttons btn-group flex-wrap d-flex gap-4 mb-md-0 mb-4">
                      <div className="btn-group">
                          <button className="btn buttons-collection btn-label-secondary dropdown-toggle me-5" tabIndex="0"  onClick={toggleDropdown}
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
                      </div>
                  </div>
                </div>
                <div className="justify-content-between dt-layout-table">
                    <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                      <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                        aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                            <colgroup>
                                <col data-dt-column="0" style={{width: '10%'}} />
                                <col data-dt-column="1" style={{width: '30%'}} />
                                <col data-dt-column="2" style={{width: '30%'}} />
                                <col data-dt-column="3" style={{width: '10%'}} />
                                <col data-dt-column="4" style={{width: '20%'}} />
                            </colgroup>
                            <thead className="border-top">
                              <tr>
                                <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select">
                                  <span className="dt-column-title"></span>
                                  <input className="form-check-input custom-checkbox" type="checkbox" />
                                </th>
                                {[{columnName: 'CANDIDATE NAME', dtColumn: '1'}, {columnName: 'EMAIL', dtColumn: '2'},
                                    {columnName: 'SHORTLIST', dtColumn: '3'},
                                    {columnName: 'ACTIONS', dtColumn: '4'}].map((column, index) => (
                                    <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                        <span className="dt-column-title">{column.columnName}</span>
                                    </th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <Loader /> 
                                        </td>
                                    </tr>
                                ) : responsesData?.length > 0 ? (
                                responsesData.map((candidate) => (
                                <tr key={candidate.cvId} onClick={() => navigate(`/interview/${interviewId}/responses/${candidate.cvId}`, {state: {candidate}})} style={{cursor: 'pointer'}}>
                                    <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" 
                                        type="checkbox" onClick={(e)=>e.stopPropagation()}/></td>
                                    <td className='text-black'>{candidate.name}</td>
                                    <td className='text-black'>{candidate.email}</td>
                                    <td>
                                    <div className="form-check form-switch m-0">
                                      <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onClick={(e)=>e.stopPropagation()}
                                          checked={candidate.shortlisted === 1} onChange={() => handleShortlistToggle(candidate.cvId, candidate.shortlisted)}/>
                                    </div>
                                  </td>

                                    <td className="dtr-hidden">
                                        <div className="d-flex align-items-center">
                                            <Link to="#" onClick={(e) => e.stopPropagation()} className="btn btn-text-secondary rounded-pill waves-effect btn-icon delete-record">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 38 38" fill="none">
                                                    <path d="M16.25 14.4167H13.5C12.4874 14.4167 11.6666 15.2375 11.6666 16.25V24.5C11.6666 25.5125 12.4874 26.3334 13.5 26.3334H21.75C22.7625 26.3334 23.5833 25.5125 23.5833 24.5V21.75" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M16.25 21.75H19L26.7917 13.9583C27.5511 13.1989 27.5511 11.9677 26.7917 11.2083C26.0323 10.4489 24.8011 10.4489 24.0417 11.2083L16.25 19V21.75" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M22.6666 12.5833L25.4166 15.3333" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </Link>
                                            <Link to="#" onClick={(e) => e.stopPropagation()} className="btn btn-text-secondary rounded-pill waves-effect btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                <i className="icon-base ti tabler-dots-vertical icon-22px"></i>
                                            </Link>
                                            <div className="dropdown-menu dropdown-menu-end m-0" onClick={(e)=>e.stopPropagation()}>
                                                <Link to={`/interview/${interviewId}/responses/${candidate.cvId}`} 
                                                    className="dropdown-item" state={{candidate}}>View</Link>
                                            </div>
                                        </div>
                                    </td>
                                    </tr>
                                ))) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">No responses found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} 
                  list ={responsesData} handlePageChange = {handlePageChange}
                  totalPages={totalPages} totalEntries={totalEntries}/>
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