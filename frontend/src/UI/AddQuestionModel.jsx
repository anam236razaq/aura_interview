import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../utils/Constants';
import {toast} from 'react-hot-toast'

export default function AddQuestionModel({setShowModal, interviewId, onQuestionAdded}) {
    const [newQuestionText, setNewQuestionText] = useState('');
    const [newQuestionType, setNewQuestionType] = useState('video'); 
    const [newQuestionTimeLimit, setNewQuestionTimeLimit] = useState(60);
    const [addingQuestion, setAddingQuestion] = useState(false);

    useEffect(() => {
            document.body.style.overflow='hidden';
            return () => { document.body.style.overflow='auto'; }
        }, []);

    const handleAddQuestion = async (event) => {
        event.preventDefault();
        if (!newQuestionText.trim()) {
            toast.error('Question text cannot be empty.');
            return;
        }
        setAddingQuestion(true);
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            const response = await axios.post(
                `${API_BASE_URL}/interviews/${interviewId}/questions`,
                {
                    text: newQuestionText,
                    type: newQuestionType,
                    time_limit: newQuestionTimeLimit || null, 
                },
                config
            );
            onQuestionAdded(response.data);
            setNewQuestionText('');
            setNewQuestionType('video');
            setNewQuestionTimeLimit(60);
            setShowModal(false);
        } catch (err) {
            toast.error('Failed to add question. ' + (err.response?.data?.message || ''));
        } finally {
            setAddingQuestion(false);
        }
    };

  return (
    <div className="modal fade show" tabIndex="-1" role='dialog' onClick={()=>setShowModal(false)} style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <div className="modal-dialog modal-simple modal-dialog-centered" role="document" onClick={(e)=> e.stopPropagation()}>
            <div className="modal-content p-2">
                <div className="modal-body">
                    <button type="button" className="btn-close" onClick={()=> setShowModal(false)} style={{top: '-0.1rem', right: '0.3rem'}}></button>
                    <div className="mb-6">
                        <h5 className="mb-2">Add New Question</h5>
                    </div>
                    <form onSubmit={handleAddQuestion} className="mt-3 border-top pt-3">
                        <div className="mb-3">
                            <label htmlFor="qText" className="form-label">Text:</label>
                            <textarea id="qText" value={newQuestionText}  onChange={(e) => setNewQuestionText(e.target.value)} 
                                required rows={2} className="form-control"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="qType" className="form-label">Type:</label>
                            <select id="qType" value={newQuestionType} onChange={(e) => setNewQuestionType(e.target.value)} className="form-select">
                                <option value="video">Video</option>
                                <option value="text">Text</option>
                                <option value="file">File Upload</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="qTime" className="form-label">Time Limit (seconds):</label>
                            <input id="qTime" type="number" value={newQuestionTimeLimit} 
                                onChange={(e) => setNewQuestionTimeLimit(e.target.value)} min="0" className="form-control"/>
                        </div>
                        <button type="submit" disabled={addingQuestion} className="btn btn-primary">
                            {addingQuestion ? 'Adding...' : 'Add Question'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
