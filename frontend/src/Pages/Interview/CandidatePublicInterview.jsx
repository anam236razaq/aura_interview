import axios from 'axios';
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/Constants';
import toast, { Toaster } from 'react-hot-toast';
import DeviceSelection from '../../UI/DeviceSelection';
import { useRef } from 'react';

export default function CandidatePublicInterview() {
    const { invitationToken } = useParams();
    const [currentStep, setCurrentStep] = useState(1); // Track the current step
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [interview, setInterview] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentTextResponse, setCurrentTextResponse] = useState('');
    const [responses, setResponses] = useState({}); // Track submission status per question
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [recorder, setRecorder] = useState(null);
    const [recording, setRecording] = useState(false);
    const [stream, setStream] = useState(null);
    const [blobUrl, setBlobUrl] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [cvId, setCvId] = useState(null);
    const[cvError, setCVError] = useState('');
    const [selectedDevices, setSelectedDevices] = useState(null); // Add state for selected devices
    const currentQuestion = questions?.[currentQuestionIndex]; // ✅ declare this first
    const [timeLeft, setTimeLeft] = useState(currentQuestion?.time_limit || 0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInterview = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await axios.get(`${API_BASE_URL}/responses/invitation/${invitationToken}`);
                setInterview(response.data.interview);
                setQuestions(response.data.questions);
                // Initialize responses state with submission status (or null) for each question
                const initialResponses = {};
                response.data.questions.forEach(q => initialResponses[q.id] = null);
                setResponses(initialResponses);
            } catch (err) {
                console.error('Error fetching interview:', err);
                setError('Failed to load interview details.');
            } finally {
                setLoading(false);
            }
        };

        fetchInterview();
    }, [invitationToken]);

    useEffect(() => {
        const initRecorder = async () => {
            // Only initialize when on the question step and devices are selected
            if (currentStep !== 4 || !selectedDevices) return;

            try {
                const constraints = {
                    video: { deviceId: { exact: selectedDevices.videoDeviceId } },
                    audio: { deviceId: { exact: selectedDevices.audioInputDeviceId } }
                };
                const newStream = await navigator.mediaDevices.getUserMedia(constraints);
                setStream(newStream);
                // Initialize MediaRecorder with the new stream
                const newRecorder = new MediaRecorder(newStream);
                setRecorder(newRecorder);
            } catch (err) {
                console.error('Error initializing media recorder with selected devices:', err);
                setError('Failed to access selected camera and microphone. Please check permissions or try different devices.');
            }
        };

        initRecorder();

        // Cleanup function: Stop stream when step changes or component unmounts
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null); // Clear stream state
            }
            if (recorder) {
                // Optional: Clean up recorder instance if needed
                setRecorder(null);
            }
        };
    }, [currentStep, selectedDevices]); // Rerun when step changes or devices are selected
 
    useEffect(() => {
        if (!recorder) return;

        const handleDataAvailable = (event) => {
            setBlobUrl(URL.createObjectURL(event.data));
        };

        recorder.ondataavailable = handleDataAvailable;

        if (recording) {
            recorder.start();
        } else {
            recorder.stop();
        }

        return () => {
            recorder.ondataavailable = null;
        };
    }, [recorder, recording]);

    useEffect(() => {
        let intervalId;

        if (isRunning && timer > 0) {
            intervalId = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else if (timer === 0 && isRunning) {
            setIsRunning(false);
            if (recording) {
                stopRecording();
            }
        }

        return () => clearInterval(intervalId);
    }, [isRunning, timer, recording]);

    useEffect(() => {
        if (interview && questions && questions.length > 0) {
            const currentQuestion = questions[currentQuestionIndex];
            setTimer(currentQuestion.time_limit);
            setIsRunning(true);
        }
    }, [currentQuestionIndex, questions, interview]);

    const startRecording = () => {
        setRecording(true);
        if (stream) {
            const videoElement = document.getElementById('liveFeed');
            if (videoElement) {
                videoElement.srcObject = stream;
                videoElement.style.display = 'block'; // Show the live feed
                videoElement.play();
            }
        }
    };

    const stopRecording = () => {
        setRecording(false);
        const videoElement = document.getElementById('liveFeed');
        if (videoElement) {
            videoElement.pause();
            videoElement.srcObject = null;
            videoElement.style.display = 'none'; // Hide the live feed
        }
    };

    const clearBlobUrl = useCallback(() => {
        if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
            setBlobUrl(null);
        }
    }, [blobUrl]);

    const getVideoDuration = (blob) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = URL.createObjectURL(blob);
            video.onloadedmetadata = () => {
                URL.revokeObjectURL(video.src);
                resolve(video.duration);
            };
        });
    };


    const handleTextResponseChange = (event) => {
        setCurrentTextResponse(event.target.value);
    };

    const isSubmittingRef = useRef(false);
    const handleSubmitResponse = useCallback(async (allowEmpty = false) => {
        if (isSubmittingRef.current) {
        console.warn('Submission already in progress...');
        return;
        }

        isSubmittingRef.current = true; 

        if (!questions || questions.length === 0) {
            console.warn('No questions available to submit.');
            return;
        }

        const questionId = questions[currentQuestionIndex].id;
        const questionType = questions[currentQuestionIndex].type;

        setSubmitLoading(true);
        setSubmitError('');

        const token = invitationToken;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        let payload = {
            invitationToken: invitationToken,
            questionId: questionId,
            responseType: questionType,
            cvId: cvId,
        };

        try {
            if (questionType === 'text') {
                if(!currentTextResponse && !allowEmpty){
                    setSubmitError('Please enter a response.');
                    setSubmitLoading(false);
                    isSubmittingRef.current = false;
                    return;
                }
                payload.responseText = currentTextResponse?.trim() || null;

            } else if (questionType === 'video') {
                if (!blobUrl && !allowEmpty) {
                    setSubmitError('Please record a video response.');
                    setSubmitLoading(false);
                    isSubmittingRef.current = false;
                    return;
                }

            if(blobUrl){
                const videoBlob = await fetch(blobUrl).then(r => r.blob());
                const videoFile = new File([videoBlob], `response-${questionId}.webm`, { type: 'video/webm' });
                const duration = await getVideoDuration(videoBlob); 
                const formData = new FormData();
                formData.append('responseFile', videoFile);
                formData.append('invitationToken', invitationToken);
                formData.append('questionId', questionId);
                formData.append('responseType', questionType);
                formData.append('cvId', cvId);
                 formData.append('duration', duration);
                payload = formData;
                config.headers = { 'Content-Type': 'multipart/form-data' };
            }else{
                payload.responseFile = null
            }
                
            } else if (questionType === 'file') {
                if (!selectedFile && !allowEmpty) {
                console.warn(`Submission logic for type 'file' not implemented yet.`);
                setSubmitError(`Submission for 'file' is not yet implemented.`);
                setSubmitLoading(false);
                isSubmittingRef.current = false;
                return;
            }

                if (selectedFile) {
                const formData = new FormData();
                formData.append('responseFile', selectedFile);
                formData.append('invitationToken', invitationToken);
                formData.append('questionId', questionId);
                formData.append('responseType', questionType);
                formData.append('cvId', cvId);
                payload = formData;
                config.headers = { 'Content-Type': 'multipart/form-data' };
                }

            } else {
                console.warn(`Unknown question type: ${questionType}`);
                setSubmitError(`Cannot submit response for unknown type '${questionType}'.`);
                setSubmitLoading(false);
                isSubmittingRef.current = false;
                return;
            }

            await axios.post(`${API_BASE_URL}/responses`, payload, config);

            setResponses(prev => ({ ...prev, [questionId]: 'submitted' })); 
            setCurrentTextResponse(''); 
            setSelectedFile(null);
            clearBlobUrl();
            setSubmitError('');

        } catch (err) {
            console.error(`Error submitting response for question ${questionId}:`, err);
            if(!allowEmpty){
                setSubmitError('Failed to submit response. ' + (err.response?.data?.message || ''));
            }
        } finally {
            setSubmitLoading(false);
            isSubmittingRef.current = false;
        }
    }, [blobUrl, clearBlobUrl, currentQuestionIndex, currentTextResponse, cvId, invitationToken, questions, selectedFile]);

    const goToNextQuestion = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setCurrentStep(5)
        }
    }, [currentQuestionIndex,questions.length ]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!fullName || !email || !phoneNumber || !cvFile || !agreeTerms) {
            toast.error('Please fill in all fields and agree to the terms.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('name', fullName);
        formData.append('email', email);
        formData.append('phoneNumber', phoneNumber);
        formData.append('cvFile', cvFile);
        formData.append('invitationToken', invitationToken);

        try {
            const response = await axios.post(`${API_BASE_URL}/users/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setCvId(response.data.cvId);
            setCurrentStep(3);
        } catch (error) {
            console.error('Error uploading CV:', error);
            if(error.response.status === 413){
                setCVError(error.response.data.message);
            }else if(error.response.status === 409){
                setCVError(error.response.data.message)
            }else{
            toast.error('Failed to upload CV. Please try again.');
            }
        } finally {
            setUploading(false);
        }
    };

    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const questionSubmitted = responses[currentQuestion?.id] === 'submitted';
    const timerInitializedFor = useRef(null);

    useEffect(() => {
  if (
    !questionSubmitted &&
    currentStep === 4 &&
    currentQuestion?.time_limit &&
    currentQuestion.id !== timerInitializedFor.current
  ) {
    setTimeLeft(currentQuestion.time_limit); // reset timer
    timerInitializedFor.current = currentQuestion.id;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitResponse(true).then(() => {
            goToNextQuestion();
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // clean up when question changes
  }
}, [currentQuestion?.id, currentStep, questionSubmitted, currentQuestion?.time_limit]);

    useEffect(() => {
        setSubmitError('');
    }, [currentQuestionIndex]);

    const handleDevicesSelected = (devices) => {
        setSelectedDevices(devices);
        setCurrentStep(4); // Move to Step 3: Questions
    };

    const handleCvFileChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setCVError('File too large. Max allowed is 5MB.');
                setCvFile(null);
            } else {
                setCVError('');
                setCvFile(file);
            }
        }
    }

    if (loading && currentStep !== 1) return <p>Loading interview...</p>; // Show loading only after form submission
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <>
        <Toaster reverseOrder={false} position='top-center' />
        <div className="container">
            {currentStep === 1 && (
                <div className="card m-5">
                    <div className="row">
                        <div className="col-12 col-lg-7 card-body">
                            <h6 className="text-center">Video Intro</h6>
                            <img src="/assets/img/image 1.png" alt="Video Intro" style={{width: '100%'}} />
                        </div>
                        <div className="col-12 col-lg-5 card-body border-start">
                            <h5 style={{fontWeight: '600'}}>Video Interview</h5>
                            <h2 className="mb-5 custom-heading">{interview?.title}</h2>
                            <div className="d-flex flex-column align-items-center justify-conetnt-center p-4 mb-5 card-video-description">
                                <span className="mb-3">Here you can start your interview.</span>
                                <h4>Total 5 Questions</h4>
                                <button className="btn btn-primary w-100" onClick={()=> setCurrentStep(2)}>Start Interview</button>
                            </div>
                            <p style={{fontSize: '14px'}}>By continuing, you accept to our Terms of Services and Privacy Policy.</p>
                        </div>
                    </div>
                </div>
            )}
                
            {currentStep === 2 && (
                <div className="card m-5">
                    <div className="row">
                        <div className="col-12 col-lg-7 card-body">
                            <h6 className="text-center">Video Intro</h6>
                            <img src="/assets/img/image 1.png" alt="Video Intro" style={{width: '100%'}} />
                        </div>
                        <div className="col-12 col-lg-5 card-body border-start">
                            <h5  style={{fontWeight: '600'}}>Video Interview</h5>
                            <h2 className="mb-5 custom-heading" style={{fontSize: '34px'}}>{interview?.title}</h2>
                            <form onSubmit={handleFormSubmit}>
                                <div className="mt-3">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-control" placeholder='Enter your Full Name' value={fullName} onChange={(e) => setFullName(e.target.value)} required /> 
                                </div>
                                <div className="mt-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="mt-3">
                                    <label className="form-label">Phone Number</label>
                                    <div className="input-group">
                                        <span className="input-group-text">PK (+92)</span>
                                        <input type="text" className="form-control" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required/>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label className="form-label">Upload CV (PDF) (Max Size: 5MB)</label>
                                    <input type="file" className="form-control" onChange={handleCvFileChange} accept=".pdf" required />
                                    <span className='text-danger small'>{cvError}</span>
                                </div>
                                <div className="form-check my-5">
                                    <input className="form-check-input" type='checkbox' checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} required/>
                                    <label className="form-check-label" style={{fontSize: '14px'}}>
                                        I agree to <a href="#">Privacy policy & terms</a>
                                    </label>
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={uploading}>
                                    {uploading ? 'Uploading...' : 'Start Interview'}
                                </button>
                            </form>
                            <p className="mt-5" style={{fontSize: '14px'}}>By continuing, you accept to our Terms of Services and Privacy Policy.</p>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <DeviceSelection onDevicesSelected={handleDevicesSelected} />
            )}

            {currentStep === 4 && interview && questions && questions.length > 0 && (
                <div className="card m-5">
                        <div className="row">
                            <div className="col-12 col-lg-7 card-body">
                                <img src="/assets/img/image 2.png" alt="Video Intro" style={{width: '100%', borderRadius: '8px'}}/>
                            </div>
                            <div className="col-12 col-lg-5 card-body d-flex flex-column border-start">
                                <h5 className="mb-2" style={{fontWeight: '600'}}>Question {currentQuestionIndex + 1} of {questions.length}</h5>
                                    <p className='mb-2'>{currentQuestion.text}</p>

                                    <p>
                                        <i className="bi bi-clock me-2"></i>
                                        Time left:{' '}
                                        {Math.floor(timeLeft / 60) > 0 && `${Math.floor(timeLeft / 60)} minute${Math.floor(timeLeft / 60) > 1 ? 's' : ''} `}
                                        {timeLeft % 60 > 0 && `${timeLeft % 60} second${timeLeft % 60 !== 1 ? 's' : ''}`}
                                    </p>
                                
                                    {currentQuestion.type === 'text' && (
                                        <div>
                                            <textarea className='form-control'
                                                value={currentTextResponse}
                                                onChange={handleTextResponseChange}
                                                placeholder="Type your answer here..."
                                                style={{ width: '100%', minHeight: '100px' }}
                                                disabled={questionSubmitted}
                                            />
                                        </div>
                                    )}
                                
                                    {currentQuestion.type === 'file' && (
                                        <div>
                                            <label htmlFor="fileUpload" className="form-label">
                                                Drag and drop file here, or click to select:
                                            </label>
                                            <input
                                                type="file"
                                                id="fileUpload"
                                                className="form-control"
                                                onChange={(e) => setSelectedFile(e.target.files[0])}
                                                disabled={questionSubmitted}
                                                accept="image/*, video/*, .pdf, .doc, .docx"
                                            />
                                        </div>
                                    )}
                                
                                    {currentQuestion.type === 'video' && (
                                        <div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <video id="liveFeed" width="320" height="240" style={{ marginBottom: '10px', border: '1px solid #ccc' }} />
                                                {!recording && !blobUrl && (
                                                    <button onClick={startRecording} disabled={recording || questionSubmitted} style={{ marginRight: '10px' }}>
                                                        <i className="bi bi-camera-video"></i>Start Recording
                                                    </button>
                                                )}
                                                {recording && (
                                                    <button onClick={stopRecording} disabled={!recording || questionSubmitted} style={{ marginRight: '10px' }}>
                                                        Stop Recording
                                                    </button>
                                                )}
                                                {blobUrl && (
                                                    <button onClick={clearBlobUrl} style={{ marginRight: '10px' }}>Clear</button>
                                                )}
                                            </div>
                                
                                            {blobUrl && (
                                                <video src={blobUrl} controls width="320" height="240" style={{ marginBottom: '10px' }} />
                                            )}
                                        </div>
                                    )}
                                
                                    {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
                                
                                    <div className='d-flex align-items-center justify-content-between mt-5'>
                                    {!questionSubmitted ? (
                                        <button onClick={handleSubmitResponse} disabled={submitLoading} className='btn btn-primary' style={{ marginRight: '10px' }}>
                                            {submitLoading ? 'Submitting...' : 'Submit Response'}
                                        </button>
                                    ) : (
                                        <p style={{ color: 'green' }}><i className="bi bi-check-circle"></i> Submitted</p>
                                    )}

                                    {!questionSubmitted && (
                                        <button onClick={async() => {await handleSubmitResponse(true); goToNextQuestion();}} disabled={submitLoading} className='btn btn-warning' style={{ marginRight: '10px' }}>
                                            Skip
                                        </button>
                                    )}
                                    <button onClick={goToNextQuestion} className='btn btn-secondary' disabled={submitLoading || !questionSubmitted}>
                                        {isLastQuestion ? 'Finish Interview' : 'Next Question'}
                                    </button>
                                    </div>
                            </div>
                        </div>
                    </div>
                
            )}
            {currentStep === 5 && (
                <div className="card px-3">
                    <div className="row">
                        <div className="col-12 col-lg-7 card-body">
                            <h6 className="text-center">Video Outro</h6>
                            <img src="/assets/img/image 1.png" alt="Video Outro" style={{width: '100%'}}/>
                        </div>
                        <div className="col-12 col-lg-5 card-body border-start">
                            <h5  style={{fontWeight: '600'}}>Thank you for Interview</h5>
                            <h2 className="mb-5 custom-heading">{interview?.title}</h2>
                            <div className="d-flex flex-column align-items-center justify-conetnt-center p-5 card-video-description">
                                <button className="btn btn-secondary w-100 mb-3" onClick={()=>navigate('/login')}>Done</button>
                                <span className="mb-3 text-center">Thank you for completing interview, we will contact you shortly..</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>
    );
}

