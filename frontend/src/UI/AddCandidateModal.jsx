import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../utils/Constants';
import {toast} from 'react-hot-toast'

export default function AddCandidateModal({setShowModal, interviewId, fetchInvitations}) {
    const [newInviteEmail, setNewInviteEmail] = useState('');
    const [newInviteFirstName, setNewInviteFirstName] = useState('');
    const [newInviteLastName, setNewInviteLastName] = useState('');
    const [sendingInvite, setSendingInvite] = useState(false);
    const [sendSuccess, setSendSuccess] = useState('');

    useEffect(() => {
            document.body.style.overflow='hidden';
            return () => { document.body.style.overflow='auto'; }
        }, []);

     const handleSendInvite = async (event) => {
        event.preventDefault();
        if (!newInviteEmail.trim()) {
            toast.error('Email is required to send an invitation.');
            return;
        }
        setSendingInvite(true);
        setSendSuccess('');
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            await axios.post(
                `${API_BASE_URL}/interviews/${interviewId}/invitations`,
                {
                    email: newInviteEmail,
                    first_name: newInviteFirstName,
                    last_name: newInviteLastName,
                },
                config
            );
            setSendSuccess(`Invitation sent successfully to ${newInviteEmail}.`);
            // Reset form
            setNewInviteEmail('');
            setNewInviteFirstName('');
            setNewInviteLastName('');
            fetchInvitations(); // Refresh the list
        } catch (err) {
            console.error('Error sending invitation:', err);
            toast.error('Failed to send invitation. ' + (err.response?.data?.message || ''));
        } finally {
            setSendingInvite(false);
        }
    };

  return (
    <div className="modal fade show" tabIndex="-1" role='dialog' onClick={()=>setShowModal(false)} style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <div className="modal-dialog modal-simple modal-dialog-centered" role="document" onClick={(e)=> e.stopPropagation()}>
            <div className="modal-content p-2">
                <div className="modal-body">
                    <button type="button" className="btn-close" onClick={()=> setShowModal(false)} style={{top: '-0.1rem', right: '0.3rem'}}></button>
                    <div className="mb-6">
                        <h5 className="mb-2">Invite New Candidate</h5>
                    </div>
                     <form onSubmit={handleSendInvite} className="mt-3 border-top pt-3">
                <div className="mb-3">
                    <label htmlFor="inviteEmail" className="form-label">Email:</label>
                    <input 
                        type="email" 
                        id="inviteEmail" 
                        value={newInviteEmail} 
                        onChange={(e) => setNewInviteEmail(e.target.value)} 
                        required 
                        placeholder="candidate@example.com"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="inviteFName" className="form-label">First Name (Optional):</label>
                    <input 
                        type="text" 
                        id="inviteFName" 
                        value={newInviteFirstName} 
                        onChange={(e) => setNewInviteFirstName(e.target.value)} 
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="inviteLName" className="form-label">Last Name (Optional):</label>
                    <input 
                        type="text" 
                        id="inviteLName" 
                        value={newInviteLastName} 
                        onChange={(e) => setNewInviteLastName(e.target.value)} 
                        className="form-control"
                    />
                </div>
                {sendSuccess && <p className="text-success">{sendSuccess}</p>}
                <button type="submit" disabled={sendingInvite} className="btn btn-primary">
                    {sendingInvite ? 'Sending...' : 'Send Invitation'}
                </button>
            </form>
                </div>
            </div>
        </div>
    </div>
  )
}
