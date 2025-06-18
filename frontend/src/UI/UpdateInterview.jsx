import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../utils/Constants';
import {toast} from 'react-hot-toast'


export default function UpdateInterview({setShowModal, interviewId, onAddedInterview}) {
    const[questions, setQuestions] = useState([{ type: 'Text Question', text: '', time_limit: 2 }]);
    const[title, setTitle] = useState('');
    const[description, setDescription] = useState('');
    const[expiryDate, setExpiryDate] = useState('');
 
    useEffect(() => {
            document.body.style.overflow='hidden';

            const fetchInterviewDetails = async () => {
                try {
                    const token = localStorage.getItem('authToken');
                    const response =await axios.get(`${API_BASE_URL}/interviews/${interviewId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    console.log(response)
                    const {title, description, expiry_date, questions} = response.data;
                    setTitle(title || '');
                    setDescription(description || '');
                    setExpiryDate(expiry_date ? new Date(expiry_date).toISOString().slice(0, 16) : '');
                    setQuestions(questions || []);
                }catch(error){
                    console.log(error);
                }
            };

            if(interviewId){
                    fetchInterviewDetails();
            }

            return () => { document.body.style.overflow='auto'; }
        }, [interviewId]);

    const handleUpdateInterview = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                title,
                description,
                expiry_date: expiryDate,
                questions,
            };

            const token = localStorage.getItem('authToken');
            const response = await axios.put(`${API_BASE_URL}/interviews/${interviewId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response)
            onAddedInterview(response.data)
            toast.success('Interview updated successfully');
            setShowModal(false);
        } catch (error) {
            console.error('Error updating interview:', error);
            toast.error(error.response?.data?.message || 'Failed to update interview');
        }
    };
    
  return (
    <div className="modal fade show" tabIndex="-1" role='dialog' onClick={()=>setShowModal(false)} style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <div className="modal-dialog modal-simple modal-dialog-centered" role="document" onClick={(e)=> e.stopPropagation()}>
            <div className="modal-content p-2">
                <div className="modal-body">
                    <button type="button" className="btn-close" onClick={()=> setShowModal(false)} style={{top: '-0.1rem', right: '0.3rem'}}></button>
                    <div className="mb-6">
                        <h5 className="mb-2">Update Interview</h5>
                    </div>
                    <form onSubmit={handleUpdateInterview} className="mt-3 border-top pt-3">
                        <div className="col-12 mb-3">
                            <label className="form-label" htmlFor="title">Title</label>
                            <input type="text" id="title" name="title" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="col-12 mb-3">
                                <label className="form-label" htmlFor="description">Description</label>
                                <textarea type="text" id="description" name="description" rows="4" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>
                        <div className='col-12 mb-3'>
                            {questions.map((question, index) => (
                                    <div className='mb-3' style={{border: '1px solid gray', borderRadius: '6px'}} key={index}>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <h4 className='mt-3 mb-3 ms-3'>{index+1}.</h4>
                                            <div className='d-flex'>
                                                <div className='d-flex align-items-center me-2'>
                                                    <select className='question-selection' value={question.type} onChange={(e) => {
                                                        const newQuestions = [...questions];
                                                        newQuestions[index].type = e.target.value;
                                                        setQuestions(newQuestions)
                                                    }}>
                                                        <option value="video">Video Recording</option>
                                                        <option value="text">Text Questions</option>
                                                        <option value="file">File Upload</option>
                                                    </select>
                                                </div>
                                                <div className='d-flex align-items-center'  style={{borderLeft: '1px dashed black'}}>
                                                    <svg className='ms-2' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <circle cx="12" cy="13" r="7" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M12 10V13H14" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M7 4L4.25 6" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M17 4L19.75 6" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span className='text-black'>
                                                        <input type='number' className='question-selection' style={{width: '40px'}} value={question.time_limit} onChange={(e)=> {
                                                            const newQuestions = [...questions];
                                                            newQuestions[index].time_limit = e.target.value;
                                                            setQuestions(newQuestions);
                                                        }} />
                                                    </span>
                                                </div>
                                                <div  className='d-flex align-items-center me-2' style={{borderLeft: '1px dashed black'}}>
                                                    <svg className='ms-2' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M19.2067 11.0974C19.2605 11.5081 19.6371 11.7974 20.0478 11.7436C20.4585 11.6897 20.7478 11.3132 20.6939 10.9025L19.2067 11.0974ZM20.1471 15.2775C20.3003 14.8927 20.1126 14.4565 19.7278 14.3032C19.343 14.1499 18.9068 14.3376 18.7535 14.7224L20.1471 15.2775ZM19.2002 20C19.2002 20.4142 19.536 20.75 19.9502 20.75C20.3644 20.75 20.7002 20.4142 20.7002 20H19.2002ZM19.9502 15H20.7002C20.7002 14.5858 20.3644 14.25 19.9502 14.25V15ZM14.9502 14.25C14.536 14.25 14.2002 14.5858 14.2002 15C14.2002 15.4142 14.536 15.75 14.9502 15.75V14.25ZM20.6939 10.9025C20.1217 6.53695 16.3948 3.27655 11.992 3.28971L11.9965 4.78971C15.6445 4.7788 18.7325 7.48027 19.2067 11.0974L20.6939 10.9025ZM11.992 3.28971C7.58915 3.30288 3.88183 6.58551 3.33572 10.9544L4.82414 11.1404C5.27663 7.52051 8.34841 4.80061 11.9965 4.78971L11.992 3.28971ZM3.33572 10.9544C2.78962 15.3232 5.57483 19.4174 9.83896 20.514L10.2125 19.0612C6.6794 18.1527 4.37165 14.7603 4.82414 11.1404L3.33572 10.9544ZM9.83896 20.514C14.1031 21.6105 18.5179 19.3678 20.1471 15.2775L18.7535 14.7224C17.4036 18.1116 13.7457 19.9698 10.2125 19.0612L9.83896 20.514ZM20.7002 20V15H19.2002V20H20.7002ZM19.9502 14.25H14.9502V15.75H19.9502V14.25Z" fill="#2F2B3D" fillOpacity="0.9"/>
                                                    </svg>
                                                    <span className='text-black'>5</span>
                                                </div>
                                                <div className='d-flex align-items-center me-2' style={{borderLeft: '1px dashed black'}}>
                                                    <svg className='ms-2' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                                        <path d="M3.6665 6.41671H18.3332" stroke="black" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M9.16683 10.0834V15.5834" stroke="black" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M12.8333 10.0834V15.5834" stroke="black" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M4.5835 6.41663L5.50016 17.4166C5.50016 18.4291 6.32097 19.25 7.3335 19.25H14.6668C15.6794 19.25 16.5002 18.4291 16.5002 17.4166L17.4168 6.41663" stroke="black" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M8.25 6.41667V3.66667C8.25 3.16041 8.66041 2.75 9.16667 2.75H12.8333C13.3396 2.75 13.75 3.16041 13.75 3.66667V6.41667" stroke="black" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>  
                                                </div>
                                            </div>
                                        </div>
                                        <div className='d-flex align-items-center mb-3 ms-3'>
                                            <input className='form-control me-2 px-2 pt-1 mt-2' placeholder='Question Text' value={question.text}
                                            style={{border: '1px solid gray', borderRadius: '6px', width: '95%', paddingBottom: '5rem'}} 
                                            onChange={(e)=> {
                                                const newQuestions = [...questions];
                                                newQuestions[index].text = e.target.value;
                                                setQuestions(newQuestions)
                                            }}/>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M16 4H20V8" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M14 10L20 4" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M8 20H4V16" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M4 20L10 14" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M16 20H20V16" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M14 14L20 20" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M8 4H4V8" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M4 4L10 10" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className='col-12 mb-3 '>
                                <label className='form-label'>Expired Date & Time</label>
                                <input className='form-control' type='datetime-local' value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}/>
                        </div>

                        <button type="submit" className="btn btn-primary">Update</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
