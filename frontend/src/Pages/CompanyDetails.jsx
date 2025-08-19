import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Footer from '../UI/Footer';
import Pagination from '../UI/Pagination';
import axios from 'axios';
import { API_BASE_URL } from '../utils/Constants';
import AddCompanyModal from '../UI/addCompanyModal';
import DeleteModal from '../UI/DeleteModal';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../UI/Loader';

export default function CompanyDetails() {
    const[showModal, setShowModal] = useState(false);
    const[showDeleteModal, setShowDeleteModal] = useState(false);
    const[loading, setLoading] = useState(true);
    const[showEditModal, setShowEditModal] = useState(false);
    const[selectedCompanyId, setSelectedCompanyId] = useState(null);
    const[companyToEdit, setCompanyToEdit] = useState(null);
    const[searchQuery, setSearchQuery] = useState('');
    const[companyList, setCompanyList] = useState([]);
    const[currentPage, setCurrentPage] = useState(1);
    const[totalPages, setTotalPages] = useState(1);
    const[totalEntries, setTotalEntries] = useState(0);
    const itemsPerPage = 10;

    //Fetching Candidate List
    useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const handleCompanyList = async () => {
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

              const endPoint = `${API_BASE_URL}/companies?${params.toString()}`;

              const response = await axios.get(endPoint, {
                  headers: {
                      "Content-Type": 'application/json',
                      Authorization: `Bearer ${token}`
                  }
              });
              setCompanyList(response?.data?.companies || []);
              setTotalPages(Math.ceil((response?.data?.total || 0) / itemsPerPage)); 
              setTotalEntries(response?.data?.total)
          } catch (error) {
            console.log(error);
          }finally{
            setLoading(false);
          }
      };

      handleCompanyList();
    }, 1000);

      return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage]);

  
    const handlePageChange = (page) => {
      if(page >= 1 && page <= totalPages){
        setCurrentPage(page);
      }
    }

    //Add company
    const handleAddCompany = (newCompany) => {
      const updatedList = [newCompany, ...companyList];
      setCompanyList(updatedList);

        // Update total entries
      const newTotalEntries = totalEntries + 1;
      setTotalEntries(newTotalEntries);

      // Update total pages
      const newTotalPages = Math.ceil(newTotalEntries / itemsPerPage);
      setTotalPages(newTotalPages);

      // If the current page is no longer valid (e.g., adding to a new page), adjust
      if (currentPage > newTotalPages) {
        handlePageChange(newTotalPages);
      }
    }

    //Delete Company
    const handleDeleteClick = (id) => {
      setSelectedCompanyId(id);
      setShowDeleteModal(true);
    }

    const confirmDelete = async ()=> {
      try{
        const token = localStorage.getItem('authToken');
        const response = await axios.delete(`${API_BASE_URL}/companies/${selectedCompanyId}`, {
          headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        setShowDeleteModal(false);
        const updatedList = companyList.filter(item => item.id !== selectedCompanyId);
        setCompanyList(updatedList);

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
                <p className='mb-2 text-black' style={{fontSize: '18px', fontWeight: '600'}}>Company List</p>
                <span>List of companies</span>
              </div>
              <div className="card">
                <div className="card-datatable">
                  <div id='DataTables_Table_0_wrapper' className='dt-container dt-bootstrap5 dt-empty-footer'>
                    <div className='row my-0 justify-content-between'>
                        <div className='d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto'>
                            <div className='dt-search mt-5' style={{marginLeft: '1.5rem', marginRight: '1.5rem'}}>
                              <input type="search" className="form-control" id="dt-search-0" placeholder="Search Company" 
                                  aria-controls="DataTables_Table_0" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
                              <label htmlFor='dt-search-0'></label>
                            </div>
                        </div>
                        <div className="d-md-flex align-items-center dt-layout-end col-md-auto ms-auto d-flex gap-md-4 justify-content-md-between justify-content-center gap-2 flex-wrap">
                          <div className="dt-buttons btn-group flex-wrap d-flex gap-4 mb-md-0 mb-4">
                              <div className="btn-group">
                                  <button className="btn add-new btn-primary ms-4 override-radius" tabIndex="0" aria-controls="DataTables_Table_0" type="button" onClick={()=>setShowModal(true)} style={{marginRight: '1.5rem',}}>
                                    <span>
                                      <span className="d-flex align-items-center gap-2">
                                          <i className="icon-base ti tabler-plus icon-xs"></i>
                                          <span className="d-none d-sm-inline-block">Add Company</span>
                                      </span>
                                    </span>
                                  </button>
                                  {showModal && <AddCompanyModal setShowModal={setShowModal} onAddedCompany = {handleAddCompany} /> }
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
                                        <col data-dt-column="3" style={{width: '15%'}} />
                                        <col data-dt-column="4" style={{width: '18%'}} />
                                        <col data-dt-column="5" style={{width: '12%'}} />
                                        <col data-dt-column="6" style={{width: '15%'}} />
                                    </colgroup>
                                    <thead className="border-top">
                                      <tr>
                                        <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select" aria-label="">
                                          <span className="dt-column-title"></span>
                                          <input className="form-check-input custom-checkbox" type="checkbox" />
                                        </th>
                                        {[{columnName: 'COMPANY NAME', dtColumn: '1'}, {columnName: 'LOGO', dtColumn: '2'},
                                            {columnName: 'ADDRESS', dtColumn: '3'}, {columnName: 'COUNTRY', dtColumn: '4'},
                                            {columnName: 'PHONE NO', dtColumn: '5'}, {columnName: 'TITLE', dtColumn: '6'},
                                            {columnName: 'ACTIONS', dtColumn: '7'}].map((column, index) => (
                                                <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                                    <span className="dt-column-title">{column.columnName}</span>
                                                </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="8" className="text-center py-5">
                                                    <Loader /> 
                                                </td>
                                            </tr>
                                          ) :companyList.length > 0 ? (
                                          companyList.map((company) => (
                                            <tr key={company.id}>
                                                <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" type="checkbox" /></td>
                                                <td className="sorting_1 text-black">
                                                    <div className='d-flex flex-column'>
                                                        <span>{company.company_name}</span>
                                                        <small>{company.email}</small>
                                                    </div>
                                                </td>
                                                <td className='text-black'>
                                                    <img src={company.logo} alt='Company Logo' style={{height: '50px', width: '80px'}} />
                                                </td>
                                                <td>{company.address}, {company.city}, {company.state}</td>
                                                <td>{company.country}</td>
                                                <td>{company.phone_number}</td>
                                                <td>{company.title}</td>
                                                <td className="dtr-hidden">
                                                    <div className="d-flex align-items-center">
                                                        <button onClick={()=> {setCompanyToEdit(company); setShowEditModal(true)}} className="btn btn-text-secondary rounded-pill waves-effect btn-icon delete-record">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 38 38" fill="none">
                                                                <path d="M16.25 14.4167H13.5C12.4874 14.4167 11.6666 15.2375 11.6666 16.25V24.5C11.6666 25.5125 12.4874 26.3334 13.5 26.3334H21.75C22.7625 26.3334 23.5833 25.5125 23.5833 24.5V21.75" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                                <path d="M16.25 21.75H19L26.7917 13.9583C27.5511 13.1989 27.5511 11.9677 26.7917 11.2083C26.0323 10.4489 24.8011 10.4489 24.0417 11.2083L16.25 19V21.75" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                                <path d="M22.6666 12.5833L25.4166 15.3333" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </button>
                                                        <Link to="#" className="btn btn-text-secondary rounded-pill waves-effect btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                            <i className="icon-base ti tabler-dots-vertical icon-22px"></i>
                                                        </Link>
                                                        <div className="dropdown-menu dropdown-menu-end m-0">
                                                            <button onClick={()=> handleDeleteClick(company.id)} className="dropdown-item">Delete</button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))) : (
                                          <tr>
                                            <td colSpan="8" className="text-center">No Companies found</td>
                                          </tr>
                                        )}
                                    </tbody>
                                </table>
                                {showEditModal && <AddCompanyModal setShowModal={setShowEditModal} onAddedCompany={(updatedCompany) => {
                                  setCompanyList(prevCompanies => prevCompanies.map((comp) => comp.id === updatedCompany.id ? updatedCompany: comp));
                                }} companyToEdit={companyToEdit}/>}
                                {showDeleteModal && <DeleteModal confirmDelete={confirmDelete}  setShowDeleteModal={setShowDeleteModal}/>}
                            </div>
                        </div>
                        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} 
                            totalEntries ={totalEntries} handlePageChange = {handlePageChange}
                            totalPages={totalPages} list={companyList}/>
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
