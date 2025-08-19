import React, { useEffect, useState } from 'react'
import Footer from '../UI/Footer'
import axios from 'axios';
import { API_BASE_URL } from '../utils/Constants';
import toast, { Toaster } from 'react-hot-toast';
import UpgradeModal from '../UI/UpgradeModal';

export default function Billing() {
    const[subscriptionList, setSubscriptionList] = useState([]);
    const[currentPlan, setCurrentPlan]= useState(null);
    const[loading, setLoading] = useState(true);
    const[showModal, setShowModal] = useState(false);
    const[selectedSub, setSelectedSub] = useState(null);
    const [pendingTransaction, setPendingTransaction] = useState(null);

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
              setSubscriptionList(response?.data);
          } catch (error) {
            console.log(error);
          }finally{
            setLoading(false);
          }
      };
      handleSubscriptionList();
    }, []);

    useEffect(() => {
        const fetchPending = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get(`${API_BASE_URL}/transactions/pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingTransaction(res.data);
            } catch (err) {
                console.log(err);
                toast.error("Error fetching pending transaction");
            }
        };

        fetchPending();
    }, []);

     //Fetching Current Plan
    useEffect(() => {
            const handleCurrentPlan = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_BASE_URL}/transactions/current-plan`, {
                  headers: {
                      "Content-Type": 'application/json',
                      Authorization: `Bearer ${token}`
                  }
              });
              setCurrentPlan(response?.data?.currentPlan);
          } catch (error) {
            console.log(error);
          }finally{
            setLoading(false);
          }
      };
        handleCurrentPlan();
     }, []);

    const startDate = new Date(currentPlan?.transaction_date);
    const totalDays = currentPlan?.duration_months * 30;
    const today = new Date();

    const elapsedDays = Math.min(Math.floor((today - startDate) / (1000 * 60 * 60 * 24)), totalDays);
    const remainingDays = totalDays - elapsedDays;
    const progressPercent = Math.min((elapsedDays / totalDays) * 100, 100);

    //Cancel subscription
    const handleCancelSubscription = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${API_BASE_URL}/transactions/cancel`,{},  {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );
        toast.success(response?.data?.message);
        window.location.reload();    
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const handleUpgradeClick = (sub) => {
        // prevent downgrades
        if (currentPlan && sub.price <= currentPlan.price) {
            toast.error("You can only upgrade to a higher priced plan.");
            return;
        }
        setSelectedSub(sub);
        setShowModal(true);
    };

    if(loading) return;

  return (
    <>
    <Toaster reverseOrder={false} position='top-center' />
    <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    {currentPlan ? (
                        <div className="card mb-6">
                        <h5 className="card-header">Current Plan</h5>
                        <div className="card-body">
                            <div className="row row-gap-6">
                                <div className="col-md-6 mb-1">
                                    <div className="mb-6">
                                        <h6 className="mb-1">Your Current Plan is {currentPlan.subscription_name}</h6>
                                        <p>{currentPlan.subscription_desc}</p>
                                    </div>
                                    <div className="mb-6">
                                        <h6 className="mb-1">
                                            Active until{" "}
                                            {new Date(
                                            new Date(currentPlan.transaction_date).setMonth(
                                            new Date(currentPlan.transaction_date).getMonth() + currentPlan.duration_months
                                            )).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "2-digit"})}
                                        </h6>
                                        <p>We will send you a notification upon Subscription expiration</p>
                                    </div>
                                    <div>
                                        <h6 className='mb-1'>Features</h6>
                                        <ul>
                                            <li className="mb-4">Max uploaded CVs: {currentPlan.max_cvs}</li>
                                            <li className="mb-4">Max AI processed CVs: {currentPlan.max_processed_cvs}</li>
                                            <li className="mb-4">Max created interviews: {currentPlan.max_interviews}</li>
                                            <li className="mb-4">Max conducted interviews: {currentPlan.no_of_conducted_interviews}</li>
                                            <li className="mb-0">Max no of companies: {currentPlan.no_of_companies}</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h6 className='mb-1'>Price</h6>
                                        <span className="mb-1">
                                            PKR {Number(currentPlan.price).toLocaleString()} Per{" "}
                                            {currentPlan.duration_months > 1
                                            ? `${currentPlan.duration_months} Months`
                                            : "Month"}
                                        </span>
                                    </div>

                                </div>
                                <div className="col-md-6">
                                    <div className="alert alert-warning mb-6" role="alert">
                                        <h5 className="alert-heading mb-1 d-flex align-items-center">
                                            <span className="alert-icon rounded"><i className="icon-base ti tabler-alert-triangle icon-md"></i></span>
                                            <span>We need your attention!</span>
                                        </h5>
                                        <span className="ms-11 ps-1">Your plan requires update</span>
                                    </div>
                                    <div className="plan-statistics">
                                        <div className="d-flex justify-content-between">
                                            <h6 className="mb-1">Days</h6>
                                            <h6 className="mb-1">{elapsedDays} of {totalDays} Days</h6>
                                        </div>
                                        <div className="progress rounded mb-1">
                                            <div className="progress-bar rounded" style={{ width: `${progressPercent}%` }}
                                                role="progressbar" aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <small>  {remainingDays} days remaining until your plan requires update</small>
                                    </div>
                                </div>
                                <div className="col-12 d-flex gap-2 flex-wrap">
                                    <button className="btn btn-label-danger cancel-subscription waves-effect" onClick={handleCancelSubscription}>Cancel Subscription</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    ) : (
                        <div className='bg-danger text-white rounded py-4'>
                            <span className='ms-3'>No Active subscription found</span>
                        </div>
                    )}

                    <div className="container my-5">
                        <div className="rounded-top">
                            <h4 className="text-center mb-2">Pricing Plans</h4>
                            <p className="text-center mb-2">Choose the best plan to fit your needs.</p>

                            <div className="row gy-6">
                                {subscriptionList.length ? (
                                    subscriptionList.map((subscription) => (
                                        <div key={subscription.id} className="col-xl mb-md-0">
                                            <div className="card border rounded shadow-none">
                                                <div className="card-body pt-12 p-5">
                                                    <h4 className="card-title text-center text-capitalize mb-1">{subscription.title}</h4>
                                                    <p className="text-center mb-5">{subscription.description}</p>
                                                    <div className="text-center h-px-50">
                                                        <div className="d-flex justify-content-center">
                                                            <sup className="h6 text-body pricing-currency mt-2 mb-0 me-1">PKR</sup>
                                                                <h1 className="mb-0 text-primary">{subscription.price}</h1>
                                                            <sub className="h6 text-body pricing-duration mt-auto mb-1">
                                                                /{subscription.duration_months} {subscription.duration_months > 1 ? 'months' : 'month'}
                                                            </sub>
                                                        </div>
                                                    </div>

                                                    <ul className="list-group ps-6 my-5 pt-9">
                                                        <li className="mb-4">Max uploaded CVs: {subscription.max_cvs}</li>
                                                        <li className="mb-4">Max AI processed CVs: {subscription.max_processed_cvs}</li>
                                                        <li className="mb-4">Max created interviews: {subscription.max_interviews}</li>
                                                        <li className="mb-4">Max conducted interviews: {subscription.no_of_conducted_interviews}</li>
                                                        <li className="mb-0">Max no of companies: {subscription.no_of_companies}</li>
                                                    </ul>

                                                    {currentPlan?.status === 'approved' && currentPlan?.subscription_id === subscription.id ? (
                                                    <button type="button"
                                                        className="btn btn-label-success d-grid w-100 waves-effect" disabled>
                                                        Your Current Plan
                                                    </button> ) : pendingTransaction?.subscription_id === subscription.id ? (
                                                    <button type="button" className="btn btn-warning d-grid w-100 waves-effect" disabled>
                                                        Pending Approval
                                                    </button>
                                                    )  : (
                                                    <button type="button" className="btn btn-primary d-grid w-100 waves-effect waves-light" onClick={()=>handleUpgradeClick(subscription)}>
                                                        Upgrade</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
                {showModal && <UpgradeModal setShowModal={setShowModal} selectedSub={selectedSub} setPendingTransaction ={setPendingTransaction}/>}
            </div>
        </div>
        <Footer />
        <div className="content-backdrop fade"></div>
    </div>
    </>
  )
}
