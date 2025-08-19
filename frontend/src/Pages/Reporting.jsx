import { useState } from 'react'
import Footer from '../UI/Footer';
import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/Constants';
import Pagination from '../UI/Pagination';
import { Toaster } from 'react-hot-toast';
import Loader from '../UI/Loader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Reporting() {
    const[loading, setLoading] = useState(true);
    const[searchQuery, setSearchQuery] = useState('');
    const[currentPage, setCurrentPage] = useState(1);
    const[totalPages, setTotalPages] = useState(1);
    const[totalEntries, setTotalEntries] = useState(0);
    const[stats, setStats] = useState([]);
    const[dateRange, setDateRange] = useState([null, null]);
    const[startDate, endDate] = dateRange;
    const itemsPerPage = 10;

    useEffect(() => {
    const delayDebounce = setTimeout(() => {
        const fetchStats = async () => {
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

                if (startDate && endDate) {
                    params.append('startDate', startDate.toISOString().split('T')[0]);
                    params.append('endDate', endDate.toISOString().split('T')[0]);
                }

                const endPoint = `${API_BASE_URL}/report/stats?${params.toString()}`;

                const res = await axios.get(endPoint, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                    setStats(res.data?.interviews || []);
                    setTotalPages(Math.ceil((res?.data?.total || 0) / itemsPerPage)); 
                    setTotalEntries(res?.data?.total)
                } catch (err) {
                    console.log(err);
                }finally{
                    setLoading(false);
                }
        };
        fetchStats();
    
    }, 1000)

    return () => clearTimeout(delayDebounce);
    }, [searchQuery, currentPage, startDate, endDate]);

    const handleChange = (dates) => {
      const [start, end] = dates;
      setDateRange([start, end]);
    };


    const handlePageChange = (page) => {
      if(page >= 1 && page <= totalPages){
        setCurrentPage(page);
      }
    }

    const handleExport = async() => {
      try{
        const token = localStorage.getItem('authToken');
        const params = new URLSearchParams();

        if (searchQuery.trim()) {
            params.append('search', searchQuery.trim());
        }

        if (startDate && endDate) {
          params.append('startDate', startDate.toISOString().split('T')[0]);
          params.append('endDate', endDate.toISOString().split('T')[0]);
        }

        const response = await axios.get(`${API_BASE_URL}/report/stats/export?${params.toString()}`, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'interview_stats.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

      }catch(error){
        console.log(error);
      }
    }


  return (
    <>
    <Toaster reverseOrder={false} position='top-center' />
    <div className="content-wrapper">
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className='mb-4'>
        <p className='mb-2 text-black' style={{fontSize: '18px', fontWeight: '600'}}>Reporting</p>
        <span>Report against each interview</span>
      </div>
      <div className="card">
        <div className="card-datatable">
          <div id='DataTables_Table_0_wrapper' className='dt-container dt-bootstrap5 dt-empty-footer'>
            <div className='row my-0 justify-content-between'>
                <div className='d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto'>
                    <div className='dt-search mt-5' style={{marginLeft: '1.5rem', marginRight: '0.1rem'}}>
                      <input type="search" className="form-control" id="dt-search-0" placeholder="Search by title" 
                        aria-controls="DataTables_Table_0" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
                      <label htmlFor='dt-search-0'></label>
                    </div>
                    <DatePicker selectsRange
                        startDate={startDate} endDate={endDate}
                        onChange={handleChange}
                        isClearable
                        placeholderText="Select date range"
                        className="form-control px-5 rounded w-full ms-4" />
                </div>
                <div className="d-md-flex align-items-center dt-layout-end col-md-auto ms-auto d-flex gap-md-4 justify-content-md-between justify-content-center gap-2 flex-wrap">
                  <div className="dt-buttons btn-group flex-wrap d-flex gap-4 mb-md-0 mb-4">
                      <div className="btn-group">
                          <button className="btn buttons-collection btn-label-secondary dropdown-toggle me-5" tabIndex="0"
                              aria-controls="DataTables_Table_0" type="button" aria-haspopup="dialog" onClick={handleExport}>
                                <span>
                                    <span className="d-flex align-items-center gap-2">
                                        <i className="icon-base ti tabler-upload icon-xs"></i>
                                        <span className="d-none d-sm-inline-block">Export</span>
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
                                <col data-dt-column="2" style={{width: '15%'}} />
                                <col data-dt-column="3" style={{width: '8%'}} />
                                <col data-dt-column="4" style={{width: '12%'}} />
                                <col data-dt-column="5" style={{width: '15%'}} />
                                <col data-dt-column="6" style={{width: '15%'}} />
                            </colgroup>
                            <thead className="border-top">
                              <tr>
                                <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select">
                                  <span className="dt-column-title"></span>
                                  <input className="form-check-input custom-checkbox" type="checkbox" />
                                </th>
                                {[{columnName: 'Interview Title', dtColumn: '1'}, {columnName: 'Total Invitations sent', dtColumn: '2'},
                                  {columnName: 'SHORTLISTED', dtColumn: '3'}, {columnName: 'Total Responses', dtColumn: '4'},
                                  {columnName: 'Private Responses', dtColumn: '5'}, {columnName: 'Public Responses', dtColumn: '6'},
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
                                        <td colSpan="8" className="text-center py-5">
                                            <Loader /> 
                                        </td>
                                    </tr>
                                ) : stats?.length > 0 ? (
                                stats.map((interview) => (
                                    <tr key={interview.interview_id}>
                                        <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" 
                                            type="checkbox" /></td>
                                        <td className="text-black">{interview.title}</td>
                                        <td className='text-black'>{interview.links_sent}</td>
                                        <td className="text-black">{interview.shortlisted_count}</td>
                                        <td className='text-black'>{interview.responded_count}</td>
                                        <td className="text-black">{interview.private_responses}</td>
                                        <td className='text-black'>{interview.public_responses}</td>
                                    </tr>
                                )
                                )) : (
                                <tr>
                                    <td colSpan="8" className="text-center">No Interviews found</td>
                                </tr>
                                )}
                          </tbody>
                      </table>
                    </div>
                </div>
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} 
                  totalEntries={totalEntries} handlePageChange = {handlePageChange}
                  totalPages={totalPages} list={stats}/>
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