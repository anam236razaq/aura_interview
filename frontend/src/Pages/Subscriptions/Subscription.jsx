import { useState } from 'react'
import { Link} from 'react-router-dom';
import Footer from '../../UI/Footer';
import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Constants';
import DeleteModal from '../../UI/DeleteModal';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../../UI/Loader';
import SubscriptionModal from '../../UI/SubscriptionModal';
import PaymentModal from '../../UI/PaymentModal';

export default function Subscription() {
    const[showModal, setShowModal] = useState(false);
    const[showEditModal, setShowEditModal] = useState(false);
    const[showDeleteModal, setShowDeleteModal] = useState(false);
    const[loading, setLoading] = useState(true);
    const[selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);
    const[subscriptionList, setSubscriptionList] = useState([]);
    const[subscriptionToEdit, setSubscriptionToEdit] = useState(null);
    const[activeTab, setActiveTab] = useState("plans");
    const[gatewayList, setGatewayList] = useState([]);
    const[gatewayToEdit, setGatewayToEdit] = useState(null);
    const[showGatewayModal, setShowGatewayModal] = useState(false);
    const[showGatewayEditModal, setShowGatewayEditModal] = useState(false);
    const[showGatewayDeleteModal, setShowGatewayDeleteModal] = useState(false);
    const[selectedGatewayId, setSelectedGatewayId] = useState(null);

    //Fetching Subscription List
    useEffect(() => {
      const handleSubscriptionList = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_BASE_URL}/subscription`, {
                  headers: {
                      "Content-Type": 'application/json',
                      Authorization: `Bearer ${token}`
                  }
              });
              console.log(response);
              setSubscriptionList(response?.data);
          } catch (error) {
            console.log(error);
          }finally{
            setLoading(false);
          }
      };
      handleSubscriptionList();
    }, []);

     //Fetching Gateway List
    useEffect(() => {
      const handleGatewayList = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_BASE_URL}/offline-payment`, {
                  headers: {
                      "Content-Type": 'application/json',
                      Authorization: `Bearer ${token}`
                  }
              });
              setGatewayList(response?.data);
          } catch (error) {
            console.log(error);
          }finally{
            setLoading(false);
          }
      };
      handleGatewayList();
    }, []);

    //Add Subscription
    const handleAddSubscription = (newSubscription) => {
      setSubscriptionList(prev => [newSubscription, ...prev]);
    }

    //Add Gateway
    const handleAddGateway = (newGateway) => {
      setGatewayList(prev => [newGateway, ...prev]);
    }


    //method for handling id for delete
    const handleDeleteClick = (id) => {
      setSelectedSubscriptionId(id);
      setShowDeleteModal(true);
    }

    //method for handling id for deletetion of gateway
    const handleDeleteGatewayClick = (id) => {
      setSelectedGatewayId(id);
      setShowGatewayDeleteModal(true);
    }

    //Deleting specific subscription
    const confirmDelete = async () => {
      try{
        const token = localStorage.getItem('authToken');
        const response = await axios.delete(`${API_BASE_URL}/subscription/${selectedSubscriptionId}`, {
          headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        setSubscriptionList(prevList => prevList.filter(item => item.id !== selectedSubscriptionId));

        setShowDeleteModal(false);
        toast.success(response.data.message);

      }catch(error){
        console.log(error);
        toast.error(error.response?.data?.message || 'An unexpected error occured');
      }
    }

    //Deleting specific gateway
    const confirmGatewayDelete = async () => {
      try{
        const token = localStorage.getItem('authToken');
        const response = await axios.delete(`${API_BASE_URL}/offline-payment/${selectedGatewayId}`, {
          headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        setGatewayList(prevList => prevList.filter(item => item.id !== selectedGatewayId));

        setShowGatewayDeleteModal(false);
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
      <div className="nav-align-top">
        <ul className="nav nav-pills flex-column flex-md-row mb-6">
          <li className="nav-item">
            <Link className={`nav-link waves-effect waves-light ${activeTab === 'plans' ? 'active' : ''}`}  onClick={() => setActiveTab("plans")}>
              <i className="icon-base ti tabler-bookmark icon-sm me-1_5"></i> 
              Subscription Plans
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link waves-effect waves-light ${activeTab === 'gateways' ? 'active' : ''}`} onClick={() => setActiveTab("gateways")}>
              <i className="icon-base ti tabler-credit-card icon-sm me-1_5"></i> 
              Offline Payment Gateways
            </Link>
          </li>
        </ul>
      </div>
      {activeTab === 'plans' &&
      <>
      <div className='mb-4'>
        <p className='mb-2 text-black' style={{fontSize: '18px', fontWeight: '600'}}>Subscription List</p>
        <span>Here you can view and manage all active subscriptions</span>
      </div>
      <div className="card">
        <div className="card-datatable">
          <div id='DataTables_Table_0_wrapper' className='dt-container dt-bootstrap5 dt-empty-footer'>
            <div className='row justify-content-between'>
                <div className="d-md-flex align-items-center my-5 dt-layout-end col-md-auto ms-auto d-flex gap-md-4 justify-content-md-between justify-content-center gap-2 flex-wrap">
                  <div className="dt-buttons btn-group flex-wrap d-flex gap-4 mb-md-0 mb-4">
                      <div className="btn-group">
                          <button className="btn add-new btn-primary ms-4 override-radius" onClick={()=>setShowModal(true)} tabIndex="0" aria-controls="DataTables_Table_0" type="button" style={{marginRight: '1.5rem',}}>
                            <span>
                              <span className="d-flex align-items-center gap-2">
                                  <i className="icon-base ti tabler-plus icon-xs"></i>
                                  <span className="d-none d-sm-inline-block">Add Subscription</span>
                              </span>
                            </span>
                          </button>
                          {showModal && <SubscriptionModal setShowModal={setShowModal} onAddedSubscription = {handleAddSubscription} />}
                      </div>
                  </div>
                </div>
                <div className="justify-content-between dt-layout-table">
                    <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                      <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                        aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                            <colgroup>
                                <col data-dt-column="0" style={{width: '7%'}} />
                                <col data-dt-column="1" style={{width: '13%'}} />
                                <col data-dt-column="2" style={{width: '10%'}} />
                                <col data-dt-column="3" style={{width: '10%'}} />
                                <col data-dt-column="4" style={{width: '10%'}} />
                                <col data-dt-column="5" style={{width: '10%'}} />
                                <col data-dt-column="6" style={{width: '8%'}} />
                                <col data-dt-column="7" style={{width: '8%'}} />
                                <col data-dt-column="8" style={{width: '8%'}} />
                                <col data-dt-column="9" style={{width: '8%'}} />
                                <col data-dt-column="10" style={{width: '8%'}} />
                            </colgroup>
                            <thead className="border-top">
                              <tr>
                                <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select">
                                  <span className="dt-column-title"></span>
                                  <input className="form-check-input custom-checkbox" type="checkbox" />
                                </th>
                                {[{columnName: 'Title', dtColumn: '1'}, {columnName: 'Price', dtColumn: '2'},
                                  {columnName: 'Duration (months)', dtColumn: '3'}, {columnName: 'Max Users', dtColumn: '4'},
                                  {columnName: 'Max Cvs', dtColumn: '5'}, {columnName: 'Max Interviews', dtColumn: '6'},
                                  {columnName: 'Max Companies', dtColumn: '7'},{columnName: 'Max Processed CVs', dtColumn: '8'},
                                  {columnName: 'Max Conducted Interviews', dtColumn: '9'}, {columnName: 'ACTIONS', dtColumn: '10'}].map((column, index) => (
                                    <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                        <span className="dt-column-title">{column.columnName}</span>
                                    </th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody>
                              {loading? (
                                  <tr>
                                      <td colSpan="11" className="text-center py-5">
                                          <Loader /> 
                                      </td>
                                  </tr>
                                ) : subscriptionList.length > 0 ? (
                                subscriptionList.map((subscription) => (
                                <tr key={subscription.id}>
                                  <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" 
                                      type="checkbox" /></td>
                                  <td className=" text-black">{subscription.title}</td>
                                  <td className='text-black'>PKR {subscription.price}</td>
                                  <td className='text-center text-black'>{subscription.duration_months}</td>
                                  <td className="text-black">{subscription.max_users}</td>
                                  <td className="text-black">{subscription.max_cvs}</td>
                                  <td className="text-black">{subscription.max_interviews}</td>
                                  <td className="text-black">{subscription.no_of_companies}</td>
                                  <td className="text-black">{subscription.max_processed_cvs}</td>
                                  <td className="text-black">{subscription.no_of_conducted_interviews}</td>
                                  <td className="dtr-hidden">
                                    <div className="d-flex align-items-center">
                                        <button onClick={() => {setSubscriptionToEdit(subscription); setShowEditModal(true)}} className="btn btn-text-secondary rounded-pill waves-effect btn-icon delete-record">
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
                                            <button onClick={()=> handleDeleteClick(subscription.id)} className="dropdown-item">Delete</button>
                                        </div>
                                    </div>
                                  </td>
                                </tr>
                                ))) : (
                                <tr>
                                      <td colSpan="11" className="text-center">No Subscriptions found</td>
                                </tr>
                                )}
                          </tbody>
                      </table>
                      {showEditModal && <SubscriptionModal setShowModal={setShowEditModal} onAddedSubscription = {(updatedSubscription) => {
                        setSubscriptionList(prevSubscription => prevSubscription.map((sub) => sub.id === updatedSubscription.id ? updatedSubscription : sub))
                        }} subscriptionToEdit ={subscriptionToEdit}/>}
                      {showDeleteModal && <DeleteModal confirmDelete ={confirmDelete} setShowDeleteModal= {setShowDeleteModal} />}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      </>}
      {activeTab === 'gateways' && 
      <>
        <div className='mb-4'>
          <p className='mb-2 text-black' style={{fontSize: '18px', fontWeight: '600'}}>Payment Gateways List</p>
          <span>Here you can view, add, and manage all available payment gateways for your application.</span>
        </div>
        <div className="card">
        <div className="card-datatable">
          <div id='DataTables_Table_0_wrapper' className='dt-container dt-bootstrap5 dt-empty-footer'>
            <div className='row justify-content-between'>
                <div className="d-md-flex align-items-center my-5 dt-layout-end col-md-auto ms-auto d-flex gap-md-4 justify-content-md-between justify-content-center gap-2 flex-wrap">
                  <div className="dt-buttons btn-group flex-wrap d-flex gap-4 mb-md-0 mb-4">
                      <div className="btn-group">
                          <button className="btn add-new btn-primary ms-4 override-radius" onClick={()=>setShowGatewayModal(true)} tabIndex="0" aria-controls="DataTables_Table_0" type="button" style={{marginRight: '1.5rem',}}>
                            <span>
                              <span className="d-flex align-items-center gap-2">
                                  <i className="icon-base ti tabler-plus icon-xs"></i>
                                  <span className="d-none d-sm-inline-block">Add offline Payment Gateway</span>
                              </span>
                            </span>
                          </button>
                          {showGatewayModal && <PaymentModal setShowModal={setShowGatewayModal} onAddedGateway = {handleAddGateway} />}
                      </div>
                  </div>
                </div>
                <div className="justify-content-between dt-layout-table">
                    <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                      <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                        aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                            <colgroup>
                                <col data-dt-column="0" style={{width: '7%'}} />
                                <col data-dt-column="1" style={{width: '18%'}} />
                                <col data-dt-column="2" style={{width: '15%'}} />
                                <col data-dt-column="3" style={{width: '30%'}} />
                                <col data-dt-column="4" style={{width: '15%'}} />
                                <col data-dt-column="5" style={{width: '15%'}} />
                            </colgroup>
                            <thead className="border-top">
                              <tr>
                                <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select">
                                  <span className="dt-column-title"></span>
                                  <input className="form-check-input custom-checkbox" type="checkbox" />
                                </th>
                                {[{columnName: 'Name', dtColumn: '1'}, {columnName: 'type', dtColumn: '2'},
                                  {columnName: 'Details', dtColumn: '3'}, {columnName: 'Status', dtColumn: '4'},
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
                                      <td colSpan="8" className="text-center py-5">
                                          <Loader /> 
                                      </td>
                                  </tr>
                                ) : gatewayList.length > 0 ? (
                                gatewayList.map((gateway) => {
                                    const details = gateway.details ? JSON.parse(gateway.details) : {};
                                return(
                                <tr key={gateway.id}>
                                  <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" 
                                      type="checkbox" /></td>
                                  <td className=" text-black">{gateway.name}</td>
                                  <td className='text-black'>{gateway.type}</td>
                                  <td className="text-black">
                                    <span>
                                        Account No: {details.account_no} <br />
                                        Bank: {details.bank}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={`badge text-capitalize ${gateway.status === "inactive" ? "bg-warning" : "bg-primary"}`}>
                                      {gateway.status}
                                    </span>
                                  </td>
                                  <td className="dtr-hidden">
                                    <div className="d-flex align-items-center">
                                        <button onClick={() => {setGatewayToEdit(gateway); setShowGatewayEditModal(true)}} className="btn btn-text-secondary rounded-pill waves-effect btn-icon delete-record">
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
                                            <button onClick={()=> handleDeleteGatewayClick(gateway.id)} className="dropdown-item">Delete</button>
                                        </div>
                                    </div>
                                  </td>
                                </tr>
                                )})) : (
                                <tr>
                                      <td colSpan="8" className="text-center">No Payment gateways found</td>
                                </tr>
                                )}
                          </tbody>
                      </table>
                      {showGatewayEditModal && <PaymentModal setShowModal={setShowGatewayEditModal} onAddedGateway = {(updatedGateway) => {
                        setGatewayList(prevGateway => prevGateway.map((sub) => sub.id === updatedGateway.id ? updatedGateway : sub))
                        }} gatewayToEdit ={gatewayToEdit}/>}
                      {showGatewayDeleteModal && <DeleteModal confirmDelete ={confirmGatewayDelete} setShowDeleteModal= {setShowGatewayDeleteModal} />}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      </>}
    </div>
    <Footer />
    <div className="content-backdrop fade"></div>
    </div>
    </>
    )
}