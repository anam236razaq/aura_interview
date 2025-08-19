import { useState } from 'react'
import { Link} from 'react-router-dom';
import Footer from '../../UI/Footer';
import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Constants';
import DeleteModal from '../../UI/DeleteModal';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../../UI/Loader';
import Pagination from '../../UI/Pagination';

export default function Transactions() {
    const[showDeleteModal, setShowDeleteModal] = useState(false);
    const[loading, setLoading] = useState(true);
    const[searchQuery, setSearchQuery] = useState('');
    const[selectedtransactionId, setSelectedtransactionId] = useState(null);
    const[transactionList, setTransactionList] = useState([]);
    const[currentPage, setCurrentPage] = useState(1);
    const[totalPages, setTotalPages] = useState(1);
    const[totalEntries, setTotalEntries] = useState(0);
    const [previewImg, setPreviewImg] = useState(null);
    const itemsPerPage = 10;

    //Fetching Transaction List
    useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const handleTransactionList = async () => {
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

              const endPoint = `${API_BASE_URL}/transactions?${params.toString()}`;

              const response = await axios.get(endPoint, {
                  headers: {
                      "Content-Type": 'application/json',
                      Authorization: `Bearer ${token}`
                  }
              });
              console.log(response);
              setTransactionList(response?.data?.transactions || []);
              setTotalPages(Math.ceil((response?.data?.total || 0) / itemsPerPage)); 
              setTotalEntries(response?.data?.total)
          } catch (error) {
            console.log(error);
          }finally{
            setLoading(false);
          }
      };

      handleTransactionList();
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
      setSelectedtransactionId(id);
      setShowDeleteModal(true);
    }

    //Deleting specific transaction
    const confirmDelete = async () => {
      try{
        const token = localStorage.getItem('authToken');
        const response = await axios.delete(`${API_BASE_URL}/transactions/${selectedtransactionId}`, {
          headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        setShowDeleteModal(false);
        const updatedList = transactionList.filter(item => item.id !== selectedtransactionId);
        setTransactionList(updatedList);

        setTotalEntries(prevTotal => prevTotal - 1);
        setTotalPages(Math.ceil((totalEntries - 1) / itemsPerPage));

         //if current page becomes empty, go back one page
        if ((updatedList.length === 0) && currentPage > 1) {
          handlePageChange(currentPage - 1);
        }
        toast.success(response.data.message);

      }catch(error){
        console.log(error);
        toast.error(error.response?.data?.message || 'An unexpected error occured');
      }
    }

    async function handleApproveTransaction(id){
      try{
        const token = localStorage.getItem('authToken');
        const response = await axios.patch(`${API_BASE_URL}/transactions/${id}/approve`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      setTransactionList(prevList => prevList.map(transaction => transaction.id === id ? 
        {...transaction, status: 'approved'} : transaction));
      toast.success(response.data.message);
      }catch(error){
        console.log(error);
        toast.error(error.response?.data?.message || 'An unexpected error occured');

      }
    }

  return (
    <>
    <Toaster reverseOrder={false} position='top-center' />
    <div className="content-wrapper">
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className='mb-4'>
        <p className='mb-2 text-black' style={{fontSize: '18px', fontWeight: '600'}}>Transaction List</p>
        <span>View and track all transactions related to active transactions</span>
      </div>
      <div className="card">
        <div className="card-datatable">
          <div id='DataTables_Table_0_wrapper' className='dt-container dt-bootstrap5 dt-empty-footer'>
            <div className='row justify-content-between'>
                <div className='d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto'>
                  <div className='dt-search mt-5' style={{marginLeft: '1.5rem', marginRight: '1.5rem'}}>
                    <input type="search" className="form-control" id="dt-search-0" placeholder="Search Transaction" 
                      aria-controls="DataTables_Table_0" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
                    <label htmlFor='dt-search-0'></label>
                  </div>
                </div>
                <div className="justify-content-between dt-layout-table">
                    <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                      <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                        aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                            <colgroup>
                                <col data-dt-column="0" style={{width: '5%'}} />
                                <col data-dt-column="1" style={{width: '10%'}} />
                                <col data-dt-column="2" style={{width: '10%'}} />
                                <col data-dt-column="3" style={{width: '13%'}} />
                                <col data-dt-column="4" style={{width: '10%'}} />
                                <col data-dt-column="5" style={{width: '10%'}} />
                                <col data-dt-column="6" style={{width: '12%'}} />
                                <col data-dt-column="7" style={{width: '12%'}} />
                                <col data-dt-column="8" style={{width: '10%'}} />
                                <col data-dt-column="9" style={{width: '8%'}} />
                            </colgroup>
                            <thead className="border-top">
                              <tr>
                                <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select">
                                  <span className="dt-column-title"></span>
                                  <input className="form-check-input custom-checkbox" type="checkbox" />
                                </th>
                                {[{columnName: 'User', dtColumn: '1'}, {columnName: 'Orgnization', dtColumn: '2'},
                                  {columnName: 'subscription Title', dtColumn: '3'}, {columnName: 'Price', dtColumn: '4'},
                                  {columnName: 'Status', dtColumn: '5'}, {columnName: 'Payment Date', dtColumn: '6'},
                                  {columnName: 'Payment Img', dtColumn: '7'}, {columnName: 'Note', dtColumn: '8'},
                                  {columnName: 'ACTIONS', dtColumn: '9'}].map((column, index) => (
                                    <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                        <span className="dt-column-title">{column.columnName}</span>
                                    </th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody>
                              {loading? (
                                  <tr>
                                      <td colSpan="10" className="text-center py-5">
                                          <Loader /> 
                                      </td>
                                  </tr>
                                ) : transactionList.length > 0 ? (
                                transactionList.map((transaction) => (
                                <tr key={transaction.id}>
                                  <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" 
                                      type="checkbox" /></td>
                                  <td className=" text-black text-capitalize">{transaction.first_name} {transaction.last_name}</td>
                                  <td className='text-black text-capitalize'>{transaction.organization_name}</td>
                                  <td className='text-center text-black'>{transaction.subscription_title}</td>
                                  <td className="text-black">PKR {transaction.amount}</td>
                                  <td className="text-black">
                                    <span className={`badge text-capitalize ${transaction.status === 'approved' ? 'bg-label-success' : 'bg-label-danger'
                                                  }`}>{transaction.status}</span>
                                  </td>
                                  <td className="text-black">{new Date(transaction.payment_date).toLocaleDateString()}</td>
                                  <td className="text-black">
                                    <img src={transaction.file}  alt="Payment Screenshot" 
                                        style={{height: '100px', cursor: 'pointer'}} 
                                        onClick={() => setPreviewImg(transaction.file)} 
                                    />
                                  </td>
                                  <td className="text-black">{transaction.note}</td>

                                  <td className="dtr-hidden">
                                    <div className="d-flex align-items-center">
                                        <button onClick={()=> handleApproveTransaction(transaction.id)} className="btn btn-text-secondary rounded-pill waves-effect btn-icon delete-record">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" role="img" aria-label="Approve">
                                                <path fill="#2F2B3D" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.25 14.25L6.5 12l1.06-1.06 3.19 3.19L16.44 8.38 17.5 9.44 10.75 16.25z"/>
                                            </svg>
                                        </button>
                                        <Link to="#" className="btn btn-text-secondary rounded-pill waves-effect btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                          <i className="icon-base ti tabler-dots-vertical icon-22px"></i>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-end m-0">
                                            <button onClick={()=> handleDeleteClick(transaction.id)} className="dropdown-item">Delete</button>
                                        </div>
                                    </div>
                                  </td>
                                </tr>
                                ))) : (
                                <tr>
                                      <td colSpan="10" className="text-center">No transactions found</td>
                                </tr>
                                )}
                          </tbody>
                      </table>
                      {showDeleteModal && <DeleteModal confirmDelete ={confirmDelete} setShowDeleteModal= {setShowDeleteModal} />}
                      {previewImg && (
                        <div className="modal fade show" style={{display: "block", backgroundColor: "rgba(0,0,0,0.5)"}} 
                            onClick={() => setPreviewImg(null)} >
                          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content bg-transparent border-0 shadow-none">
                              <div className="modal-body p-0">
                                <img src={previewImg} alt="Preview" style={{width: "100%", height: "auto", borderRadius: "8px"}} />
                              </div>
                              <button type="button" className="btn-close position-absolute top-0 end-0 m-3" 
                                onClick={() => setPreviewImg(null)}></button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                </div>
                  <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} 
                    totalEntries ={totalEntries} handlePageChange = {handlePageChange}
                    totalPages={totalPages} list={transactionList}/>
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