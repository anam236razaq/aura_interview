import { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../utils/Constants';
import Pagination from '../UI/Pagination';
import Footer from '../UI/Footer';
import Loader from '../UI/Loader';
import DeleteModal from '../UI/DeleteModal';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function RecentActivities() {
  const[showDeleteModal, setShowDeleteModal] = useState(false);
  const[selectedActivityId, setSelectedActivityId] = useState(null);
  const[activityList, setActivityList] = useState([]);
  const[loading, setLoading] = useState(true);
  const[searchQuery, setSearchQuery] = useState('');
  const[currentPage, setCurrentPage] = useState(1);
  const[totalPages, setTotalPages] = useState(1);
  const[totalEntries, setTotalEntries] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const itemsPerPage = 10;

   //Fetching activity List
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const handleActivityList = async () => {
        try {
              setLoading(true);
              const token = localStorage.getItem('authToken');
              const params = new URLSearchParams({
                page: currentPage,
                limit: itemsPerPage
              });

            if (searchQuery.trim()) {
              params.append('search', searchQuery.trim());
            }

            if (startDate) {
              const startOfDay = new Date(startDate);
              startOfDay.setHours(0, 0, 0, 0);
              params.append('start_date', startOfDay.toISOString());
            }

            if (endDate) {
              const endOfDay = new Date(endDate);
              endOfDay.setHours(23, 59, 59, 999);
              params.append('end_date', endOfDay.toISOString());
            }

            const endPoint = `${API_BASE_URL}/activity-logs?${params.toString()}`;

            const response = await axios.get(endPoint, {
                headers: {
                  "Content-Type": 'application/json',
                  Authorization: `Bearer ${token}`
                }
            });
            console.log(response);

            setActivityList(response?.data?.logs || []);
            setTotalPages(Math.ceil((response?.data?.total || 0) / itemsPerPage)); 
            setTotalEntries(response?.data?.total)
          } catch (error) {
            console.log(error);
          }finally{
            setLoading(false);
          }
      };

      handleActivityList();
    }, 1000);

      return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage, startDate, endDate]);


    const handlePageChange = (page) => {
      if(page >= 1 && page <= totalPages){
        setCurrentPage(page);
      }
    }

    //Delete activity
    const handleDeleteClick = (id) => {
      setSelectedActivityId(id);
      setShowDeleteModal(true);
    }

    const confirmDelete = async ()=> {
      try{
        const token = localStorage.getItem('authToken');
        const response = await axios.delete(`${API_BASE_URL}/activity-logs/${selectedActivityId}`, {
          headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        setShowDeleteModal(false);
        const updatedList = activityList.filter(item => item.id !== selectedActivityId);
        setActivityList(updatedList);

        setTotalEntries(prevTotal => prevTotal - 1);
        setTotalPages(Math.ceil((totalEntries - 1) / itemsPerPage));

         //if current page becomes empty, go back one page
        if ((updatedList.length === 0) && currentPage > 1) {
          handlePageChange(currentPage - 1);
        }
        toast.success(response.data.message);

      }catch(error){
          toast.error(error.response?.data?.message || 'An unexpected error occured');
          console.log(error);
      }
    }

  return (
    <>
    <Toaster reverseOrder={false} position='top-center' />
    <div className="content-wrapper">
      <div className="container-xxl flex-grow-1 container-p-y">
          <div className='mb-4'>
              <p className='mb-2 text-black' style={{fontSize: '18px', fontWeight: '600'}}>Recent Activities</p>
              <span>View the latest actions you have performed across the platform.</span>
          </div>
              <div className="card">
                <div className="card-header border-bottom">
                  <h5 className="card-title mb-0">Filters</h5>
                  <div className="row pt-4 gap-4 gap-md-0">
                    <div className="col-md-6">
                      <div className='dt-search'>
                          <input type="search" className="form-control" id="dt-search-0" placeholder="Search anything" 
                            aria-controls="DataTables_Table_0" value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)} />
                          <label htmlFor='dt-search-0'></label>
                      </div>
                    </div>
                    <div className="col-md-6">
                        <DatePicker selectsRange className="form-control" isClearable={true} 
                          startDate={startDate} endDate={endDate} onChange={(date) => setDateRange(date)}
                          placeholderText="Select date range"
                          dateFormat="MMM d, yyyy"/>
                      </div>
                  </div>
                </div>
                <div className="card-datatable">
                  <div id='DataTables_Table_0_wrapper' className='dt-container dt-bootstrap5 dt-empty-footer'>
                    <div className='row my-0 justify-content-between'>
                        <div className="justify-content-between dt-layout-table">
                            <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                              <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                                aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                                    <colgroup>
                                        <col data-dt-column="0" style={{width: '10%'}} />
                                        <col data-dt-column="1" style={{width: '20%'}} />
                                        <col data-dt-column="2" style={{width: '20%'}} />
                                        <col data-dt-column="3" style={{width: '20%'}} />
                                        <col data-dt-column="4" style={{width: '20%'}} />
                                        <col data-dt-column="5" style={{width: '10%'}} />
                                        
                                    </colgroup>
                                    <thead className="border-top"> 
                                      <tr>
                                        <th data-dt-column="0" rowSpan="1" colSpan="1">
                                          <span className="dt-column-title"></span>
                                          <input className="form-check-input custom-checkbox" type="checkbox" />
                                        </th>

                                        {[{columnName: 'Performed By', dtColumn: '1'}, {columnName: 'Action', dtColumn: '2'},
                                            {columnName: 'Description', dtColumn: '3'}, {columnName: 'Date', dtColumn: '4'},
                                            {columnName: 'ACTIONS', dtColumn: '5'}].map((column, index) => (
                                              <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                                <span className="dt-column-title text-uppercase">{column.columnName}</span>
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
                                      ) : activityList.length > 0 ? (
                                        activityList.map((activity) => (
                                      <tr key={activity.id}>
                                        <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" type="checkbox" /></td>
                                        <td className="sorting_1 text-black">{activity.first_name} {activity.last_name}</td>
                                        <td><span className='badge bg-primary py-2'>{activity.action}</span></td>
                                        <td className='text-black'>{activity.description}</td>
                                        <td className='text-black'>{new Date(activity.created_at).toLocaleDateString("en-US", {
                                          year: "numeric", month: "short", day: 'numeric'})}</td>
                                        <td className="dtr-hidden">
                                          <div className="d-flex align-items-center">
                                              <Link to="#" className="btn btn-text-secondary rounded-pill waves-effect btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                  <i className="icon-base ti tabler-dots-vertical icon-22px"></i>
                                              </Link>
                                              <div className="dropdown-menu dropdown-menu-end m-0">
                                                  <button onClick={()=> handleDeleteClick(activity.id)} className="dropdown-item">Delete</button>
                                              </div>
                                          </div>
                                        </td>
                                      </tr>
                                      ))) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">No activities found</td>
                                        </tr>
                                      )}
                                  </tbody>
                              </table>
                              {showDeleteModal && <DeleteModal confirmDelete={confirmDelete}  setShowDeleteModal={setShowDeleteModal}/>}
                            </div>
                        </div>
                        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} 
                          totalEntries ={totalEntries} handlePageChange = {handlePageChange}
                          totalPages={totalPages} list={activityList}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer/>
          <div className="content-backdrop fade"></div>
    </div>
     </>
  )
}
