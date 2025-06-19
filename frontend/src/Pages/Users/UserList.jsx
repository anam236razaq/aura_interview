import { useState } from 'react'
import { Link } from 'react-router-dom';
import Footer from '../../UI/Footer';
import UserModel from '../../UI/UserModel';
import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Constants';
import { Toaster } from 'react-hot-toast';
import Pagination from '../../UI/Pagination';
import Loader from '../../UI/Loader';
import UpdateUser from '../../UI/UpdateUser';

export default function UserList() {
  const[open, setOpen] = useState(false);
  const[showModal, setShowModal] = useState(false);
  const[showUpdateModal, setShowUpdateModal] = useState(false);
  const[selectedUserId, setSelectedUserId] = useState(null);
  const[userList, setUserList] = useState([]);
  const[loading, setLoading] = useState(true);
  const[searchQuery, setSearchQuery] = useState('');
  const[currentPage, setCurrentPage] = useState(1);
  const[totalPages, setTotalPages] = useState(1);
  const[totalEntries, setTotalEntries] = useState(0);
  const[userType, setUserType] = useState('');
  const[status, setStatus] = useState('');
  const[allRoles, setAllRoles] = useState([]);
  const itemsPerPage = 10;

  const toggleDropdown = () => setOpen(!open);

   //Fetching user List
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const handleUserList = async () => {
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

            if (userType) {
              params.append('type', userType);
            }

            if (status) {
              params.append('status', status);
            }

            const endPoint = `${API_BASE_URL}/users?${params.toString()}`;

            const response = await axios.get(endPoint, {
                headers: {
                  "Content-Type": 'application/json',
                  Authorization: `Bearer ${token}`
                }
            });

            setUserList(response?.data?.users || []);
            setTotalPages(Math.ceil((response?.data?.total || 0) / itemsPerPage)); 
            setTotalEntries(response?.data?.total)
          } catch (error) {
            console.log(error);
          }finally{
            setLoading(false);
          }
      };

      handleUserList();
    }, 1000);

      return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage, status, userType]);


    const handlePageChange = (page) => {
      if(page >= 1 && page <= totalPages){
        setCurrentPage(page);
      }
    }

    const handleAddedUser = (newUser) => {
      setUserList(prev => [newUser, ...prev]);
    }

    const handleStatusToggle = async (userId, currentStatus) => {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      try{
        const token = localStorage.getItem('authToken');
        await axios.put(`${API_BASE_URL}/users/${userId}/status`, {status: newStatus}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUserList((prevList) => 
          prevList.map((user) => user.id === userId ? {...user, status: newStatus} : user)
        )

      }catch(error){
        console.log(error);
      }
    }

    useEffect(() => {
      const fetchRoles = async () => {
        try{
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/roles`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAllRoles(response?.data);
        }catch(error){
          console.log(error);
        }
      }
      fetchRoles();
    }, []);

  const columns = [
  { columnName: 'Full name', dtColumn: '1' },
  { columnName: 'email', dtColumn: '2' },
  { columnName: 'active/deactive', dtColumn: '3' },
  { columnName: 'type', dtColumn: '4' },
  { columnName: 'ACTIONS', dtColumn: '5' }
  ];

  const roleId = parseInt(localStorage.getItem('roleId'), 10);
  const isManager = roleId === 2;

  const visibleColumns = isManager
  ? columns.filter(col => col.columnName !== 'ACTIONS')
  : columns;

  return (
    <>
    <Toaster reverseOrder={false} position='top-center' />
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
                        <select id="FilterTransaction" className='form-select text-capitalize' value={status}
                            onChange={(e)=> setStatus(e.target.value)}>
                            <option value = "">Select Status</option>
                            <option value= 'Active' className='text-capitalize'>Active</option>
                            <option value= 'Inactive' className='text-capitalize'>Inactive</option>
                        </select>
                      </div>
                      <div className="col-md-6 user_role">
                        <select id="UserRole" className='form-select text-capitalize' value={userType} 
                          onChange={(e)=>setUserType(e.target.value)}>
                            <option value ="">User Type</option>
                            {allRoles.map((role) => (
                                <option key={role.id} value= {role.name} >{role.name}</option>
                            ))}
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
                                aria-controls="DataTables_Table_0" value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)} />
                              <label htmlFor='dt-search-0'></label>
                            </div>
                            
                        </div>
                        <div className="d-md-flex align-items-center dt-layout-end col-md-auto ms-auto d-flex gap-md-4 justify-content-md-between justify-content-center gap-2 flex-wrap">
                          <div className="dt-buttons btn-group flex-wrap d-flex gap-4 mb-md-0 mb-4">
                              <div className="btn-group">
                                  <button className="btn buttons-collection btn-label-secondary dropdown-toggle" tabIndex="0"  onClick={toggleDropdown}
                                      aria-controls="DataTables_Table_0" type="button" aria-haspopup="dialog" aria-expanded={open} style={{marginRight: '1.5rem',}}>
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
                                  {!isManager && <button className="btn add-new btn-primary override-radius" tabIndex="0" aria-controls="DataTables_Table_0" type="button" onClick={()=>setShowModal(true)} style={{marginRight: '1.5rem',}}>
                                    <span>
                                      <span className="d-flex align-items-center gap-2">
                                          <i className="icon-base ti tabler-plus icon-xs"></i>
                                          <span className="d-none d-sm-inline-block">Add User</span>
                                      </span>
                                    </span>
                                  </button>}
                                  {showModal && <UserModel setShowModal={setShowModal} onAddedUser = {handleAddedUser}/> }
                              </div>
                          </div>
                        </div>
                        <div className="justify-content-between dt-layout-table">
                            <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                              <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                                aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                                    <colgroup>
                                        <col data-dt-column="0" style={{ width: '10%' }} /> 
                                        <col data-dt-column="1" style={{ width: isManager ? '25%' : '20%' }} />
                                        <col data-dt-column="2" style={{ width: isManager ? '25%' : '20%' }} />
                                        <col data-dt-column="3" style={{ width: isManager ? '20%' : '18%' }} />
                                        <col data-dt-column="4" style={{ width: isManager ? '20%' : '12%' }} />
                                        {!isManager && <col data-dt-column="5" style={{ width: '15%' }} />}
                                    </colgroup>
                                    <thead className="border-top"> 
                                      <tr>
                                        <th data-dt-column="0" rowSpan="1" colSpan="1">
                                          <span className="dt-column-title"></span>
                                          <input className="form-check-input custom-checkbox" type="checkbox" />
                                        </th>

                                        {visibleColumns.map((column, index) => (
                                            <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                                <span className="dt-column-title">{column.columnName}</span>
                                            </th>
                                        ))}                                      \
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {loading ? (
                                          <tr>
                                            <td colSpan={isManager ? 5 : 6} className="text-center py-5">
                                                <Loader /> 
                                            </td>
                                          </tr>
                                      ) : userList.length > 0 ? (
                                        userList.map((user) => (
                                      <tr key={user.id}>
                                        <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" type="checkbox" /></td>
                                        <td className="sorting_1 text-black">{user.first_name} {user.last_name}</td>
                                        <td className='text-black'>{user.email}</td>
                                        <td>
                                          <div className="form-check form-switch m-0">
                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" 
                                              checked={user.status === 'active'} onChange={()=> !isManager && handleStatusToggle(user.id, user.status)}/>
                                          </div>
                                        </td>
                                        <td>
                                          <span className={`badge text-capitalize ${user.status === 'active' ? 'bg-label-success' : 'bg-label-danger'
                                                  }`}>{user.role_name}</span>
                                        </td>
                                        {!isManager && <td className="dtr-hidden">
                                          <div className="d-flex align-items-center">
                                              <button onClick={()=>{setSelectedUserId(user.id);setShowUpdateModal(true);}} className="btn btn-text-secondary rounded-pill waves-effect btn-icon delete-record">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 38 38" fill="none">
                                                      <path d="M16.25 14.4167H13.5C12.4874 14.4167 11.6666 15.2375 11.6666 16.25V24.5C11.6666 25.5125 12.4874 26.3334 13.5 26.3334H21.75C22.7625 26.3334 23.5833 25.5125 23.5833 24.5V21.75" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                      <path d="M16.25 21.75H19L26.7917 13.9583C27.5511 13.1989 27.5511 11.9677 26.7917 11.2083C26.0323 10.4489 24.8011 10.4489 24.0417 11.2083L16.25 19V21.75" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                      <path d="M22.6666 12.5833L25.4166 15.3333" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                  </svg>
                                              </button>
                                          </div>
                                        </td>}
                                      </tr>
                                      ))) : (
                                        <tr>
                                            <td colSpan={isManager ? 5 : 6} className="text-center">No users found</td>
                                        </tr>
                                      )}
                                  </tbody>
                              </table>
                              {showUpdateModal && <UpdateUser setShowModal={setShowUpdateModal} userId={selectedUserId} 
                                onAddedUser = {(updatedUser) => {setUserList((prevUser) =>
                                  prevUser.map((user) => user.id === updatedUser.id ? updatedUser : user))}}/>}
                            </div>
                        </div>
                        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} 
                          totalEntries ={totalEntries} handlePageChange = {handlePageChange}
                          totalPages={totalPages} list={userList}/>
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
