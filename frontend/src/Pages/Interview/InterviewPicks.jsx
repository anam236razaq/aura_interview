import { useCallback, useState } from 'react'
import Footer from '../../UI/Footer';
import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Constants';
import Pagination from '../../UI/Pagination';
import { Toaster } from 'react-hot-toast';
import Loader from '../../UI/Loader';

export default function InterviewPicks() {
    const[loading, setLoading] = useState(true);
    const[searchQuery, setSearchQuery] = useState('');
    const[candidatesList, setCandidatesList] = useState([]);
    const[currentPage, setCurrentPage] = useState(1);
    const[totalPages, setTotalPages] = useState(1);
    const[totalEntries, setTotalEntries] = useState(0);
  
    const itemsPerPage = 10;

    const handleRespondedCandidateList = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
              const params = new URLSearchParams({
                  page: currentPage,
                  limit: itemsPerPage,
              });

              if (searchQuery.trim()) {
                  params.append('search', searchQuery.trim());
              }

              const endPoint = `${API_BASE_URL}/all-responses-org?${params.toString()}`;

              const response = await axios.get(endPoint, {
                  headers: {
                      "Content-Type": 'application/json',
                      Authorization: `Bearer ${token}`
                  }
              });
              console.log(response);

              setCandidatesList(response?.data?.candidates || []);
              setTotalPages(Math.ceil((response?.data?.total || 0) / itemsPerPage)); 
              setTotalEntries(response?.data?.total)
          } catch (error) {
            console.log(error);
          }finally{
            setLoading(false);
          }
      }, [currentPage, searchQuery]);

    //Fetching Candidate List
    useEffect(() => {
    const delayDebounce = setTimeout(() => {
        handleRespondedCandidateList();
    }, 1000);

      return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage, handleRespondedCandidateList]);

    const handlePageChange = (page) => {
      if(page >= 1 && page <= totalPages){
        setCurrentPage(page);
      }
    }

     //Toggle shortlist candidate
    const handleShortlistToggle = async (cvId, interviewId, currentlyShortlisted) => {
        try {
            const updatedShortlisted = currentlyShortlisted ? 0 : 1;
            const token = localStorage.getItem('authToken');

            const response = await axios.post(`${API_BASE_URL}/interviews/${interviewId}/shortlist`, 
                {cvId,  shortlisted: updatedShortlisted },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  },
            });
            console.log(response)
            // Ideally, update the local state to reflect change
            handleRespondedCandidateList();

          } catch (err) {
              console.error('Error toggling shortlist:', err);
          }
        };

  return (
    
    <>
    <Toaster reverseOrder={false} position='top-center' />
    <div className="content-wrapper">
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className='mb-4'>
        <p className='mb-2 text-black' style={{fontSize: '18px', fontWeight: '600'}}>Picked Candidates</p>
        <span>List of candidates picked after interviews</span>
      </div>
      <div className="card">
        <div className="card-datatable">
          <div id='DataTables_Table_0_wrapper' className='dt-container dt-bootstrap5 dt-empty-footer'>
            <div className='row my-0 justify-content-between'>
                <div className='d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto'>
                    <div className='dt-search mt-5' style={{marginLeft: '0.2rem', marginRight: '1.5rem'}}>
                        <div className='dt-search mt-5' style={{marginLeft: '1.5rem', marginRight: '1.5rem'}}>
                            <input type="search" className="form-control" id="dt-search-0" placeholder="Search by title" 
                                aria-controls="DataTables_Table_0" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
                            <label htmlFor='dt-search-0'></label>
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
                                <col data-dt-column="3" style={{width: '25%'}} />
                                <col data-dt-column="4" style={{width: '15%'}} />
                            </colgroup>
                            <thead className="border-top">
                              <tr>
                                <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select">
                                  <span className="dt-column-title"></span>
                                  <input className="form-check-input custom-checkbox" type="checkbox" />
                                </th>
                                {[{columnName: 'Interview Title', dtColumn: '1'}, {columnName: 'candidate name', dtColumn: '2'},
                                  {columnName: 'email', dtColumn: '3'}, {columnName: 'SHORTLIST', dtColumn: '4'}
                                 ].map((column, index) => (
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
                                  <tr key={candidate.cvId} >
                                  <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" 
                                      type="checkbox" /></td>
                                    <td className='text-black'>{candidate.interviewTitle}</td>
                                  <td className="sorting_1 text-black"><span>{candidate.name}</span></td>
                                  <td className='text-black'>{candidate.email}</td>
                                  <td>
                                    <div className="form-check form-switch m-0">
                                      <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onClick={(e)=>e.stopPropagation()}
                                          checked={!!candidate.shortlisted} onChange={() => handleShortlistToggle(candidate.cvId, candidate.interviewId, candidate.shortlisted)}/>
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