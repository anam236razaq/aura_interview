import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Constants';
import DeviceSelection from '../../UI/DeviceSelection';
import toast, { Toaster } from 'react-hot-toast';

const InterviewInvitation = () => {
    const { interviewId, token } = useParams();
    const [loading, setLoading] = useState(true);
    const [candidate, setCandidate] = useState(null);
    const [currentStep, setCurrentStep] = useState(1); // Track the current step
    const [interview, setInterview] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentTextResponse, setCurrentTextResponse] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [responses, setResponses] = useState({}); // Track submission status per question
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [recorder, setRecorder] = useState(null);
    const [recording, setRecording] = useState(false);
    const [stream, setStream] = useState(null);
    const [blobUrl, setBlobUrl] = useState(null); 
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [selectedDevices, setSelectedDevices] = useState(null); // Add state for selected devices
    const currentQuestion = questions?.[currentQuestionIndex]; 
    const [timeLeft, setTimeLeft] = useState(currentQuestion?.time_limit || 0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInterview = async () => {
            setLoading(true);

            try {
                const response = await axios.get(`${API_BASE_URL}/responses/private/invitation/${token}`);
                setInterview(response.data.interview);
                setQuestions(response.data.questions);
                // Initialize responses state with submission status (or null) for each question
                const initialResponses = {};
                response.data.questions.forEach(q => initialResponses[q.id] = null);
                setResponses(initialResponses);
            } catch (err) {
                console.error('Error fetching interview:', err);
                toast.error('Failed to load interview details.');
            } finally {
                setLoading(false);
            }
        };

        fetchInterview();
    }, [token]);

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
                toast.error('Failed to access selected camera and microphone. Please check permissions or try different devices.');
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

        const privateToken = token;
        const config = { headers: { Authorization: `Bearer ${privateToken}` } };
        let payload = {
            invitationToken: token,
            questionId: questionId,
            responseType: questionType,            
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
            } 
            else if (questionType === 'video') {
                if (!blobUrl && !allowEmpty) {
                    setSubmitError('Please record a video response.');
                    setSubmitLoading(false);
                    isSubmittingRef.current = false;
                    return;
                }
                
                if(blobUrl){
                const videoBlob = await fetch(blobUrl).then(r => r.blob());
                const videoFile = new File([videoBlob], `response-${questionId}.webm`, { type: 'video/webm' });
                const formData = new FormData();
                formData.append('responseFile', videoFile);
                formData.append('invitationToken', token);
                formData.append('questionId', questionId);
                formData.append('responseType', questionType);
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
                formData.append('invitationToken', token);
                formData.append('questionId', questionId);
                formData.append('responseType', questionType);
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

            await axios.post(`${API_BASE_URL}/responses/invitation`, payload, config);

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
    }, [blobUrl, clearBlobUrl, currentQuestionIndex, currentTextResponse, token, questions, selectedFile]);

    useEffect(() => {
    const validateToken = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const res = await axios.get(`${API_BASE_URL}/interviews/invitation/${interviewId}/${token}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            }
        });
        setCandidate(res.data);
      } catch (err) {
        console.log(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [interviewId, token]);

    const goToNextQuestion = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setCurrentStep(4)
        }
    }, [currentQuestionIndex, questions.length]);


    const handleDevicesSelected = (devices) => {
        setSelectedDevices(devices);
        setCurrentStep(3); //
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

  if (loading) return

  return (
     <>
        <Toaster position='top-center' reverseOrder={false} />
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
                                <h5>Welcome {candidate?.candidateName}</h5>
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
                <DeviceSelection onDevicesSelected={handleDevicesSelected} />
            )}

            {currentStep === 3 && interview && questions && questions.length > 0 && (
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
                                        Time left:{timeLeft}{' '}
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
                                                Drag and drop image file here, or click to select:
                                            </label>
                                            <input
                                                type="file"
                                                id="fileUpload"
                                                className="form-control"
                                                onChange={(e) => setSelectedFile(e.target.files[0])}
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
                                
                                    <div>
                                    {!questionSubmitted && (
                                        <button onClick={async() => {await handleSubmitResponse(true); goToNextQuestion();}} disabled={submitLoading} className='btn btn-warning' style={{ marginRight: '1rem' }}>
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
                    </div>
                
            )}
            {currentStep === 4 && (
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
};

export default InterviewInvitation;
