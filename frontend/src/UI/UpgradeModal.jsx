import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../utils/Constants';

export default function UpgradeModal({setShowModal, selectedSub, setPendingTransaction}) {
    const[gateways, setGateways] = useState([]);
    const[loading, setLoading] = useState(true);
    const[gatewayId, setGatewayId] = useState("");
    const[selectedGateway, setSelectedGateway] = useState(null);
    const[paymentImg, setPaymentImg] = useState(null);
    const[note, setNote] = useState("");

     //Fetching Gateway List
    useEffect(() => {
      const handleGatewayList = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const { data } = await axios.get(`${API_BASE_URL}/offline-payment`, {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(data);
            const filtered = data.filter((g) => g.status === "active" && g.type === "offline");
            setGateways(filtered);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
      };
      handleGatewayList();
    }, []);

    const handleGatewayChange = (e) => {
        const id = e.target.value;
        setGatewayId(id);

        const gateway = gateways.find((g) => g.id.toString() === id);
        setSelectedGateway(gateway || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!gatewayId) {
            toast.error("Please select a payment gateway");
            return;
        }

        if (!paymentImg) {
            toast.error("Please upload a payment screenshot");
            return;
        }
        if (!note) {
            toast.error("Please enter a note");
            return;
        }
        try {
            const token = localStorage.getItem("authToken");

            const formData = new FormData();
            formData.append("subscription_id", selectedSub.id);
            formData.append("gateway_id", gatewayId);
            formData.append("payment_img", paymentImg); 
            formData.append("note", note);

            const res= await axios.post(`${API_BASE_URL}/transactions`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": 'multipart/form-data'
                } }
            );

            setPendingTransaction({
                id: res.data.id,                
                subscription_id: selectedSub.id,
                status: "pending",
            });
            
        toast.success("Transaction created successfully. Awaiting approval.");
        setShowModal(false);
        } catch (err) {
        console.log(err);
        toast.error("Failed to create transaction.");
        }
    };

    if(loading) return;

  return (
    <div className="modal fade show" tabIndex="-1" role='dialog' onClick={()=>setShowModal(false)} style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <div className="modal-dialog modal-simple modal-dialog-centered" role="document" onClick={(e)=> e.stopPropagation()}>
            <div className="modal-content p-2">
                <div className="modal-body">
                    <button type="button" className="btn-close" onClick={()=> setShowModal(false)} style={{top: '-0.1rem', right: '0.3rem'}}></button>
                    <div className="mb-6">
                        <h5 className="mb-2">Upgrade Plan</h5>
                    </div>
                    <form className="row g-5" onSubmit={handleSubmit}>
                        <div className="col-12 mb-3">
                            <label className="form-label">Select Payment Gateway</label>
                            <select className="form-select" value={gatewayId} onChange={handleGatewayChange}>
                                <option value="">-- Select --</option>
                                    {gateways.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Show gateway details when selected */}
                        {selectedGateway && selectedGateway.details && (
                            <div className="col-12 mb-3">
                                <div className="border rounded p-3 bg-light">
                                    <p className="mb-1">
                                        <strong>Bank Name:</strong>{" "}
                                        {JSON.parse(selectedGateway.details).bank}
                                    </p>
                                    <p className="mb-0">
                                        <strong>Account No:</strong>{" "}
                                        {JSON.parse(selectedGateway.details).account_no}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="col-12 mb-3">
                            <label className="form-label">Upload Payment Screenshot</label>
                            <input type="file" className="form-control"
                                accept="image/*" onChange={(e) => setPaymentImg(e.target.files[0])} />
                        </div>

                        <div className="col-12 mb-3">
                            <label className="form-label">Note</label>
                            <textarea className="form-control" rows="3" value={note}
                                onChange={(e) => setNote(e.target.value)} />
                        </div>

                        <div className="col-12 d-flex align-items-center justify-content-end">
                            <button type="reset" className="btn btn-label-secondary  me-3"
                                onClick={()=> setShowModal(false)}>Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">Confirm Upgrade</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
