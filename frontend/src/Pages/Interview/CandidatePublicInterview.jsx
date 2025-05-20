import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/Constants';
import toast from 'react-hot-toast';
import DeviceSelection from '../../UI/DeviceSelection';

export default function CandidatePublicInterview() {
    const { invitationToken } = useParams();
    const [currentStep, setCurrentStep] = useState(1); // Track the current step
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [interview, setInterview] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentTextResponse, setCurrentTextResponse] = useState('');
    const [currentVideoFile, setCurrentVideoFile] = useState(null);
    const [responses, setResponses] = useState({}); // Track submission status per question
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [recorder, setRecorder] = useState(null);
    const [recording, setRecording] = useState(false);
    const [stream, setStream] = useState(null);
    const [blobUrl, setBlobUrl] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [cvId, setCvId] = useState(null);
    const [selectedDevices, setSelectedDevices] = useState(null); // Add state for selected devices
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
            if (currentStep !== 3 || !selectedDevices) return;

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

    const clearBlobUrl = () => {
        if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
            setBlobUrl(null);
        }
    };

    const handleTextResponseChange = (event) => {
        setCurrentTextResponse(event.target.value);
    };

    const handleVideoFileChange = (event) => {
        setCurrentVideoFile(event.target.files[0]);
    };

    const handleSubmitResponse = async () => {
        if (!questions || questions.length === 0) {
            console.warn('No questions available to submit.');
            return;
        }
        console.log('Submitting response for question:', questions);

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
                payload.responseText = currentTextResponse;
            } else if (questionType === 'video') {
                if (!blobUrl) {
                    setSubmitError('Please record a video response.');
                    setSubmitLoading(false);
                    return;
                }
                const videoBlob = await fetch(blobUrl).then(r => r.blob());
                const videoFile = new File([videoBlob], `response-${questionId}.webm`, { type: 'video/webm' });
                const formData = new FormData();
                formData.append('responseFile', videoFile);
                formData.append('invitationToken', invitationToken);
                formData.append('questionId', questionId);
                formData.append('responseType', questionType);
                formData.append('cvId', cvId);
                payload = formData;
                config.headers = { 'Content-Type': 'multipart/form-data' };
            } else if (questionType === 'file') {
                console.warn(`Submission logic for type 'file' not implemented yet.`);
                setSubmitError(`Submission for 'file' is not yet implemented.`);
                setSubmitLoading(false);
                return;
            } else {
                console.warn(`Unknown question type: ${questionType}`);
                setSubmitError(`Cannot submit response for unknown type '${questionType}'.`);
                setSubmitLoading(false);
                return;
            }

            await axios.post(`${API_BASE_URL}/responses`, payload, config);

            setResponses(prev => ({ ...prev, [questionId]: 'submitted' })); 
            setCurrentTextResponse(''); 
            setCurrentVideoFile(null);
            clearBlobUrl();

        } catch (err) {
            console.error(`Error submitting response for question ${questionId}:`, err);
            setSubmitError('Failed to submit response. ' + (err.response?.data?.message || ''));
        } finally {
            setSubmitLoading(false);
        }
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            navigate('/login');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!fullName || !email || !phoneNumber || !cvFile || !agreeTerms) {
            toast.error('Please fill in all fields and agree to the terms.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('fullName', fullName);
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

            console.log('CV uploaded successfully. CV ID:', response.data.cvId);
            setCvId(response.data.cvId);
            setCurrentStep(3);
        } catch (error) {
            console.error('Error uploading CV:', error);
            setUploadError('Failed to upload CV. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDevicesSelected = (devices) => {
        console.log('Devices selected:', devices);
        setSelectedDevices(devices);
        setCurrentStep(4); // Move to Step 3: Questions
    };

    if (loading && currentStep !== 1) return <p>Loading interview...</p>; // Show loading only after form submission
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    // Conditional rendering for interview/questions check should happen in Step 3

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const questionSubmitted = responses[currentQuestion?.id] === 'submitted';

    return (
        <div className="container">
            {currentStep === 4 && (
                <div className="card m-5">
                    <div className="row">
                        <div className="col-12 col-lg-7 card-body">
                            <h6 className="text-center">Video Intro</h6>
                            <img src="/assets/img/image 1.png" alt="Video Intro" style={{width: '100%'}} />
                        </div>
                        <div className="col-12 col-lg-5 card-body border-start">
                            <h5 style={{fontWeight: '600'}}>Video Interview</h5>
                            <h2 className="mb-5 custom-heading">Sales Associate at Example Company</h2>
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
                            <h2 className="mb-5 custom-heading" style={{fontSize: '34px'}}>Sales Associate at Example Company</h2>
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
                                    <label className="form-label">Upload CV (PDF)</label>
                                    <input type="file" className="form-control" onChange={(e) => setCvFile(e.target.files[0])} accept=".pdf" required />
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

            {currentStep === 1 && interview && questions && questions.length > 0 && (
                <div class="card m-5">
                        <div class="row">
                            <div class="col-12 col-lg-7 card-body">
                                <img src="/assets/img/image 2.png" alt="Video Intro" style={{width: '100%', borderRadius: '8px'}}/>
                            </div>
                            <div class="col-12 col-lg-5 card-body d-flex flex-column border-start">
                                <h4>Question {currentQuestionIndex + 1} of {questions.length}</h4>
                                                        <p>{currentQuestion.text}</p>
                                                        <p>{/*<FontAwesomeIcon icon={faClock} />*/} Time limit: {currentQuestion.time_limit} seconds</p>
                                
                                                        {currentQuestion.type === 'text' && (
                                                            <div>
                                                                <textarea
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
                                                                    Drag and drop image here, or click to select:
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    id="fileUpload"
                                                                    className="form-control"
                                                                    onChange={handleVideoFileChange}
                                                                    disabled={questionSubmitted}
                                                                    accept="image/*"
                                                                />
                                                            </div>
                                                        )}
                                
                                                        {currentQuestion.type === 'video' && (
                                                            <div>
                                                                <div style={{ marginBottom: '10px' }}>
                                                                    <video id="liveFeed" width="320" height="240" style={{ marginBottom: '10px', border: '1px solid #ccc' }} />
                                                                    {!recording && !blobUrl && (
                                                                        <button onClick={startRecording} disabled={recording || questionSubmitted} style={{ marginRight: '10px' }}>
                                                                            {/*<FontAwesomeIcon icon={faVideo} />*/} Start Recording
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
                                
                                                        {!questionSubmitted ? (
                                                            <button onClick={handleSubmitResponse} disabled={submitLoading} style={{ marginRight: '10px' }}>
                                                                {submitLoading ? 'Submitting...' : 'Submit Response'}
                                                            </button>
                                                        ) : (
                                                            <p style={{ color: 'green' }}>{/*<FontAwesomeIcon icon={faCheckCircle} />*/} Submitted</p>
                                                        )}
                                
                                                        <button onClick={goToNextQuestion} disabled={submitLoading || !questionSubmitted}>
                                                            {isLastQuestion ? 'Finish Interview' : 'Next Question'}
                                                        </button>
                                                
                            </div>
                        </div>
                    </div>
                
            )}
            {currentStep === 5 && (!interview || !questions || questions.length === 0) && !loading && (
                <p>Interview details or questions could not be loaded.</p>
            )}
        </div>
    );
}
