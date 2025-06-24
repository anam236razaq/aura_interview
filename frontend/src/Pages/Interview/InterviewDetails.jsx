import { useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Constants';
import Footer from '../../UI/Footer';
import {toast, Toaster} from 'react-hot-toast';
import AddQuestionModel from '../../UI/AddQuestionModel';
import AddCandidateModal from '../../UI/AddCandidateModal';
import Pagination from '../../UI/Pagination';
import { useCallback } from 'react';

export default function InterviewDetails() {
    const [interview, setInterview] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [invitationToken, setInvitationToken] = useState('');
    const [responsesData, setResponsesData] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
    const {id} = useParams();

    useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const from = queryParams.get('from');
      if (from) {
        localStorage.setItem('interviewFrom', from);
      }
    }, []);

     // Callback function to update questions list when a new one is added
    const handleQuestionAdded = (newQuestion) => {
        setQuestions(prevQuestions => [...prevQuestions, newQuestion].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))); // Add and re-sort
    };

    //Fetching Interview Details
    useEffect(() => {
    const fetchInterviewData = async () => {
        setLoading(true);

        try{
            const token = localStorage.getItem('authToken');
            if(!token) return;

            const config ={
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            //Fetch interview Details and questions Details
            const [interviewRes, questionRes] = await Promise.all([
                axios.get(API_BASE_URL+`/interviews/${id}`, config),
                axios.get(API_BASE_URL+`/interviews/${id}/questions`, config)
            ])

            setInterview(interviewRes?.data);
            setQuestions(questionRes?.data || []);

            // Fetch invitation token
            const invitationRes = await axios.get(API_BASE_URL+`/interviews/${id}/invitation-token`, config);
            setInvitationToken(invitationRes.data.token);

            }catch(err){
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    toast.error('Unauthorized or session expired. Please log in again.');
                } else if (err.response && err.response.status === 404) {
                    toast.error('Interview not found or access denied.');
                } else {
                    toast.error('Failed to load interview details.');
                }
                setInterview(null);
                setQuestions([]);
            }finally{
                setLoading(false);
            }
        }
            fetchInterviewData();
    }, [id]);

    //Fetching number of Candidates List
    useEffect(() => {
        const fetchResponses = async () => {
            setLoading(true);

            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error('Authentication token not found.');
                setLoading(false);
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };

            try {
                const response = await axios.get(`${API_BASE_URL}/interviews/${id}/all-responses`, config);
                setResponsesData(response.data.candidates || []);

            } catch (err) {
                console.error('Error fetching responses:', err);
                toast.error('Failed to load responses. ' + (err.response?.data?.message || ''));
            } finally {
                setLoading(false);
            }
        };

        fetchResponses();
    }, [id]);

    //Updating Status of interviews
    const handleUpdateStatus = async () => {
        setStatusUpdateLoading(true);
        try{
            const token = localStorage.getItem('authToken');
            if(!token) return;

             const config ={
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            await axios.patch(API_BASE_URL+`/interviews/${id}/status`, {status: newStatus}, config);
            setInterview(prev => ({ ...prev, status: newStatus }));
            setNewStatus('');

        }catch(err){
            toast.error('Failed to update status. ' + (err.response?.data?.message || ''));
        }finally{
            setStatusUpdateLoading(false);
        }
    }

    if(loading) return
    const publicLink = `${window.location.origin}/interview/public/${invitationToken}`;

  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <div className="content-wrapper">
    <div className="container-xxl flex-grow-1 container-p-y">
        <div className='d-flex flex-column align-items-start align-items-md-center flex-md-row justify-content-between'>
            <h4 className='text-black'>{interview?.title}</h4>
            <div className="d-flex gap-2">
                <Link to="/interviewed/interview-list" className="btn py-3" style={{backgroundColor: 'rgba(115, 103, 240, 0.24)', color: '#646cff'}}>Back to Interview List</Link>
                <Link to={`/interviewed/interview/${id}/responses`} className="btn ms-2 text-white py-3" style={{backgroundColor: '#646cff'}}>View Responses ({responsesData?.length})</Link>
            </div>
        </div> 
        <div className="row mt-4">
            <div className="col-12 col-lg-4">

                <div className="card mb-6">
                    <div className="card-header">
                        <h5 className="card-title m-0">Public Link</h5>
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-start align-items-center mb-4">
                            <div className="d-flex flex-column">
                                {invitationToken ? (
                                    <>
                                        <p className='mb-2'>Share this link with candidates:</p>
                                        <p className='text-break'>{publicLink}</p>
                                    </>
                                    ) : (
                                        <p>No public link generated yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-6">
                    <div className="card-header">
                        <h5 className="card-title m-0">Details</h5>
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-start flex-column mb-4">
                            <div className="d-flex flex-column">
                                <p><strong>Description:</strong> {interview?.description || 'N/A'}</p>
                                <p><strong>Responded Candidates:</strong> {responsesData?.length}</p>
                                <p><strong>Status:</strong> {interview?.status}</p>
                            </div>
                            <div className="mt-1 mb-3 d-flex flex-column justify-conten-start">
                                <label htmlFor="statusSelect" className="form-label mb-2" style={{fontWeight: '600'}}>Change Status:</label>
                                <select id="statusSelect" className="form-select mb-2" style={{ width: 'auto' }} 
                                    value={newStatus || interview?.status} onChange={(e) => setNewStatus(e.target.value)}>
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="archived">Archived</option>
                                </select>
                                <button className="btn btn-primary btn-sm py-2" onClick={handleUpdateStatus} 
                                    disabled={statusUpdateLoading || !newStatus || newStatus === interview.status}>
                                        {statusUpdateLoading ? 'Saving...' : 'Save Status'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {interview?.job && (
                    <div className="card mb-6">
                        <div className="card-header">
                            <h5 className="card-title m-0">Job Details</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-start flex-column mb-4">
                                <div className="d-flex flex-column">
                                    <p><strong>Title:</strong> {interview?.job?.title}</p>
                                    <p><strong>Description:</strong> {interview?.job?.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <AssignmentList interviewId={id} />
            </div>
            <div className="col-12 col-lg-8">
                <QuestionList 
                        questions={questions} 
                        interviewId={id} 
                        onQuestionAdded={handleQuestionAdded} 
                />

                <InvitationList interviewId={id} />
                </div>
            </div>
    </div>
    <Footer />
    <div className="content-backdrop fade"></div>
    </div>
    </>
    )
}

function QuestionList({ questions, interviewId, onQuestionAdded }){
    const [showModal, setShowModal] = useState(false);

    return (

        <div className="card mb-6">
            <div className="card-datatable">
                <div id="DataTables_Table_0_wrapper" className="dt-container dt-bootstrap5 dt-empty-footer">
                    <div className="row card-header border-bottom mx-0 px-3">
                        <div className="d-flex justify-content-between align-items-center dt-layout-start col-auto me-auto">
                            <h5 className="card-title mb-0">Questions</h5>
                        </div>
                        <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-auto ms-auto">
                            <button className="btn text-white" style={{backgroundColor: '#646cff'}} onClick={()=> setShowModal(true)}>
                                <span className="d-flex align-items-center gap-2">
                                    <i className="icon-base ti tabler-plus icon-xs"></i>
                                    <span className="d-none d-sm-inline-block">Add Question</span>
                                </span>
                            </button>
                            {showModal && <AddQuestionModel setShowModal={setShowModal} interviewId={interviewId}
                                onQuestionAdded ={onQuestionAdded}/>}
                        </div>
                    </div>
                     <div className="justify-content-between dt-layout-table">
                            <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                              <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                                aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                                    <colgroup>
                                        <col data-dt-column="0" style={{width: '15%'}} />
                                        <col data-dt-column="1" style={{width: '35%'}} />
                                        <col data-dt-column="2" style={{width: '25%'}} />
                                        <col data-dt-column="3" style={{width: '25%'}} />
                                    </colgroup>
                                    <thead className="border-top">
                                      <tr>
                                        <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select" aria-label="">
                                          <span className="dt-column-title"></span>
                                          <input className="form-check-input custom-checkbox" type="checkbox" />
                                        </th>
                                        {[{columnName: 'QUESTIONS', dtColumn: '1'}, {columnName: 'TYPE', dtColumn: '2'},
                                            {columnName: 'TIME LIMIT(Secs)', dtColumn: '3'}].map((column, index) => (
                                                <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                                    <span className="dt-column-title">{column.columnName}</span>
                                                </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                        {questions.length > 0 ? (
                                            questions.map((question) => (
                                            <tr key={question.id}>
                                                <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" type="checkbox" /></td>
                                                <td>{question.text}</td>
                                                <td>{question.type}</td>
                                                <td>{question.time_limit}</td>
                                            </tr>
                                        ))) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">No questions found</td>
                                        </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );

}

function AssignmentList({interviewId}){
    const [assignments, setAssignments] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchAssignmentsAndUsers = useCallback(async () => {
        setLoadingAssignments(true);
        setLoadingUsers(true);
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            const [assignRes, usersRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/interviews/${interviewId}/assignments`, config),
                axios.get(`${API_BASE_URL}/users`, config)
            ]);
            setAssignments(assignRes.data || []);
            setAllUsers(usersRes.data.users || []);
            if (usersRes.data.users && usersRes.data.users.length > 0) {
                const assignedIds = new Set((assignRes.data || []).map(a => a.user_id));
                const firstAvailable = usersRes.data.users.find(u => !assignedIds.has(u.id));
                setSelectedUserId(firstAvailable ? firstAvailable.id : '');
            } else {
                setSelectedUserId('');
            }
        } catch (err) {
            console.log('Failed to load assignment data. ' + (err.response?.data?.message || ''));
        } finally {
            setLoadingAssignments(false);
            setLoadingUsers(false);
        }
    }, [interviewId]);
 
    useEffect(() => {
        fetchAssignmentsAndUsers();
    }, [interviewId, fetchAssignmentsAndUsers]);

    const handleAddAssignment = async (event) => {
        event.preventDefault();
        if (!selectedUserId) {
            toast.error('Please select a user to assign.');
            return;
        }
        setActionLoading(true);
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            await axios.post(`${API_BASE_URL}/interviews/${interviewId}/assignments`, { userId: selectedUserId }, config);
            fetchAssignmentsAndUsers();
        } catch (err) {
            toast.error('Failed to assign user. ' + (err.response?.data?.message || ''));
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveAssignment = async (userIdToRemove) => {        
        setActionLoading(true);
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            await axios.delete(`${API_BASE_URL}/interviews/${interviewId}/assignments/${userIdToRemove}`, config);
            fetchAssignmentsAndUsers(); 
        } catch (err) {
            toast.error('Failed to unassign user. ' + (err.response?.data?.message || ''));
        } finally {
            setActionLoading(false);
        }
    };

    const assignedUserIds = new Set(assignments.map(a => a.user_id));
    const availableUsers = allUsers.filter(u => !assignedUserIds.has(u.id));
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const isHr = roleId === 3;

    return (

    <div className="card mb-6">
        <div className="card-header d-flex justify-content-between">
          <h5 className="card-title mb-0">Assigned Reviewers</h5>
        </div>
        <div className="card-body">
              {loadingAssignments ? <p>Loading assignments...</p> : (
                assignments.length === 0 ? (
                    <p>No users assigned yet.</p>
                ) : (
                    <ul className="list-group">
                        {assignments.map(a => (
                            <li key={a.user_id} className="list-group-item d-flex flex-column">
                                {a.first_name || ''} {a.last_name || ''} ({a.email})
                                {!isHr && <button onClick={() => handleRemoveAssignment(a.user_id)} disabled={actionLoading} className="btn btn-danger btn-sm mt-2">
                                    <i className="bi bi-x-circle me-1"></i> Unassign
                                </button>}
                            </li>
                        ))}
                    </ul>
                )
            )}

            {!isHr && <form onSubmit={handleAddAssignment} className="mt-3 border-top pt-3">
                <h5 className='card-title my-3'>Assign New Reviewer</h5>
                {loadingUsers ? <p>Loading users...</p> : (
                    availableUsers.length === 0 ? (
                        <p>No available users to assign.</p>
                    ) : (
                        <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} required className="form-select">
                            <option value="">-- Select User --</option>
                            {availableUsers.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.first_name || ''} {u.last_name || ''} ({u.email})
                                </option>
                            ))}
                        </select>
                    )
                )}
                <button type="submit" disabled={actionLoading || loadingUsers || availableUsers.length === 0 || !selectedUserId} className="btn btn-primary mt-2 w-100">
                    {actionLoading ? 'Assigning...' : 'Assign User'}
                </button>
            </form>}
        </div>
    </div>

    );
}

const InvitationList = ({ interviewId }) => {
    const [invitations, setInvitations] = useState([]);
    const [loadingInvites, setLoadingInvites] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);
    const itemsPerPage = 10;
    
    const [showModal, setShowModal] = useState(false);

    const fetchInvitations = useCallback(async () => {
        setLoadingInvites(true);
        const token = localStorage.getItem('authToken');
        const params = new URLSearchParams({
          page: currentPage,
          limit: itemsPerPage
        });

        const endPoint = `${API_BASE_URL}/interviews/${interviewId}/invitations?${params.toString()}`;
        
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            const response = await axios.get(endPoint, config);
            setInvitations(response.data.invitations || []);
            setTotalPages(Math.ceil((response?.data?.total || 0) / itemsPerPage)); 
            setTotalEntries(response?.data?.total)
        } catch (err) {
            console.log('Failed to load invitations. ' + (err.response?.data?.message || ''));
        } finally {
            setLoadingInvites(false);
        }
    }, [currentPage, interviewId]);

    useEffect(() => {
        fetchInvitations();
    }, [interviewId, fetchInvitations]);

    if(loadingInvites) return;

    const handlePageChange = (page) => {
      if(page >= 1 && page <= totalPages){
        setCurrentPage(page);
      }
    }

    return (
        <div className="card mb-6">
            <div className="card-datatable">
                <div id="DataTables_Table_0_wrapper" className="dt-container dt-bootstrap5 dt-empty-footer">
                    <div className="row card-header border-bottom mx-0 px-3">
                        <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-auto me-auto">
                            <h5 className="card-title mb-0">Candidate Invitations</h5>
                        </div>
                        <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-auto ms-auto">
                            <button className="btn text-white" style={{backgroundColor: '#646cff'}} onClick={()=> setShowModal(true)}>
                                <span className="d-flex align-items-center gap-2">
                                    <i className="icon-base ti tabler-plus icon-xs"></i>
                                    <span className="d-none d-sm-inline-block">Add Candidate</span>
                                </span>
                            </button>
                            {showModal && <AddCandidateModal setShowModal={setShowModal} interviewId={interviewId}
                                fetchInvitations ={fetchInvitations}/>}
                        </div>
                    </div>
                     <div className="justify-content-between dt-layout-table">
                            <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                              <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                                aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                                    <colgroup>
                                        <col data-dt-column="0" style={{width: '10%'}} />
                                        <col data-dt-column="1" style={{width: '20%'}} />
                                        <col data-dt-column="2" style={{width: '25%'}} />
                                        <col data-dt-column="3" style={{width: '25%'}} />
                                        <col data-dt-column="4" style={{width: '20%'}} />
                                    </colgroup>
                                    <thead className="border-top">
                                      <tr>
                                        <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select" aria-label="">
                                          <span className="dt-column-title"></span>
                                          <input className="form-check-input custom-checkbox" type="checkbox" />
                                        </th>
                                        {[{columnName: 'Email', dtColumn: '1'}, {columnName: 'name', dtColumn: '2'},
                                            {columnName: 'status', dtColumn: '3'}, {columnName: 'sent', dtColumn: '4'}].map((column, index) => (
                                                <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                                    <span className="dt-column-title">{column.columnName}</span>
                                                </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                        {invitations.length > 0 ? (
                                            invitations.map((inv) => (
                                            <tr key={inv.id}>
                                                <td className="dt-select"><input aria-label="Select row" className="form-check-input custom-checkbox" type="checkbox" /></td>
                                                 <td>{inv.email}</td>
                                                <td>{inv.first_name || ''} {inv.last_name || ''}</td>
                                                <td>{inv.status}</td>
                                                <td>{new Date(inv.created_at).toLocaleString()}</td>
                                            </tr>
                                        ))) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">No invitations found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} 
                            totalEntries ={totalEntries} handlePageChange = {handlePageChange}
                            totalPages={totalPages} list={invitations}/>
                    </div>
                </div>
            </div>
    );
};