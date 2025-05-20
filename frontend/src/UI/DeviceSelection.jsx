
import React, { useState, useEffect, useRef } from 'react';

const DeviceSelection = ({ onDevicesSelected }) => {
    const [videoDevices, setVideoDevices] = useState([]);
    const [audioInputDevices, setAudioInputDevices] = useState([]);
    const [audioOutputDevices, setAudioOutputDevices] = useState([]);
    const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
    const [selectedAudioInputDevice, setSelectedAudioInputDevice] = useState('');
    const [selectedAudioOutputDevice, setSelectedAudioOutputDevice] = useState('');
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const getDevices = async () => {
            try {
                // Request permissions first
                await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoInputs = devices.filter(device => device.kind === 'videoinput');
                const audioInputs = devices.filter(device => device.kind === 'audioinput');
                const audioOutputs = devices.filter(device => device.kind === 'audiooutput');

                setVideoDevices(videoInputs);
                setAudioInputDevices(audioInputs);
                setAudioOutputDevices(audioOutputs);

                // Set default selections
                if (videoInputs.length > 0) setSelectedVideoDevice(videoInputs[0].deviceId);
                if (audioInputs.length > 0) setSelectedAudioInputDevice(audioInputs[0].deviceId);
                if (audioOutputs.length > 0) setSelectedAudioOutputDevice(audioOutputs[0].deviceId);

            } catch (err) {
                console.error('Error enumerating devices:', err);
                setError('Could not access media devices. Please check permissions.');
            }
        };

        getDevices();

        // Cleanup function to stop stream when component unmounts
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []); // Run only once on mount

    useEffect(() => {
        // Start video stream when a video device is selected
        const startStream = async () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop()); // Stop previous stream
            }
            if (selectedVideoDevice) {
                try {
                    const constraints = {
                        video: { deviceId: { exact: selectedVideoDevice } },
                        audio: selectedAudioInputDevice ? { deviceId: { exact: selectedAudioInputDevice } } : false
                    };
                    const newStream = await navigator.mediaDevices.getUserMedia(constraints);
                    setStream(newStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = newStream;
                    }
                } catch (err) {
                    console.error('Error starting video stream:', err);
                    setError('Could not start video stream with selected device.');
                }
            }
        };

        startStream();
    }, [selectedVideoDevice, selectedAudioInputDevice]); // Re-run when selected devices change

    const handleStartInterview = () => {
        if (selectedVideoDevice && selectedAudioInputDevice) {
            onDevicesSelected({
                videoDeviceId: selectedVideoDevice,
                audioInputDeviceId: selectedAudioInputDevice,
                audioOutputDeviceId: selectedAudioOutputDevice,
            });
        } else {
            setError('Please select a webcam and microphone.');
        }
    };

    return (
        <>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="card m-5">
            <div className="row">
                <div className="col-12 col-lg-7 card-body">
                    <video ref={videoRef} autoPlay playsInline muted width="100%" style={{ border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div className="col-12 col-lg-5 card-body d-flex align-items-start justify-content-center flex-column border-start">
                    <h5  style={{fontWeight: '600'}}>Audio and Video Test</h5>
                    <div className="d-flex align-items-center gap-2 w-100">
                        <div style={{backgroundColor: '#00BAD129', borderRadius: '6px', padding: '0.6rem'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <circle cx="15" cy="12.5" r="8.75" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="15" cy="12.5" r="3.75" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 20L7.38626 24.3575C7.15494 24.7435 7.14899 25.2241 7.37068 25.6158C7.59237 26.0074 8.00747 26.2496 8.45751 26.25H21.5425C21.9925 26.2496 22.4076 26.0074 22.6293 25.6158C22.851 25.2241 22.8451 24.7435 22.6138 24.3575L20 20" stroke="#00BAD1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="flex-grow-1">
                            <label className="form-label">Web Camera</label>
                            <select
                                id="videoDevice"
                                className="form-select"
                                value={selectedVideoDevice}
                                onChange={(e) => setSelectedVideoDevice(e.target.value)}
                                    disabled={videoDevices.length === 0}
                            >
                                {videoDevices.map(device => (
                                    <option key={device.deviceId} value={device.deviceId}>{device.label || `Camera ${device.deviceId.substring(0, 6)}`}</option>
                                ))}
                                {videoDevices.length === 0 && <option>No cameras found</option>}
                            </select>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-4 w-100">
                        <div style={{backgroundColor: '#28C76F29', borderRadius: '6px', padding: '0.6rem'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <path d="M18.7526 16.1246C21.4556 16.6747 24.1995 15.3878 25.5048 12.9578C26.8102 10.5279 26.3682 7.52956 24.4173 5.57961C22.4663 3.62966 19.4678 3.18923 17.0385 4.4958C14.6092 5.80237 13.3237 8.54696 13.8751 11.2496" stroke="#28C76F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M18.7525 16.1247L13.875 11.251L4.48374 21.981C3.85182 22.6122 3.60467 23.5326 3.83539 24.3955C4.06611 25.2584 4.73964 25.9326 5.60227 26.1643C6.46489 26.3959 7.38557 26.1497 8.01748 25.5185L18.7525 16.1247V16.1247Z" stroke="#28C76F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="flex-grow-1">
                            <label className="form-label">Microphone</label>
                            <select
                                id="audioInputDevice"
                                className="form-select"
                                value={selectedAudioInputDevice}
                                onChange={(e) => setSelectedAudioInputDevice(e.target.value)}
                                    disabled={audioInputDevices.length === 0}
                            >
                                {audioInputDevices.map(device => (
                                    <option key={device.deviceId} value={device.deviceId}>{device.label || `Microphone ${device.deviceId.substring(0, 6)}`}</option>
                                ))}
                                {audioInputDevices.length === 0 && <option>No microphones found</option>}
                            </select>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 my-4 w-100">
                        <div style={{backgroundColor: '#FF4C5129', borderRadius: '6px', padding: '0.6rem'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <path d="M18.75 10C20.3238 11.1803 21.25 13.0328 21.25 15C21.25 16.9672 20.3238 18.8197 18.75 20" stroke="#FF4C51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7.5 18.7504H5C4.30964 18.7504 3.75 18.1908 3.75 17.5004V12.5004C3.75 11.8101 4.30964 11.2504 5 11.2504H7.5L11.875 5.62542C12.1007 5.18694 12.6124 4.97852 13.0803 5.13447C13.5482 5.29043 13.8325 5.76419 13.75 6.25042V23.7504C13.8325 24.2366 13.5482 24.7104 13.0803 24.8664C12.6124 25.0223 12.1007 24.8139 11.875 24.3754L7.5 18.7504" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="flex-grow-1">
                            <label className="form-label">Speaker/Headphone</label>
                            <select
                                id="audioOutputDevice"
                                className="form-select"
                                value={selectedAudioOutputDevice}
                                onChange={(e) => setSelectedAudioOutputDevice(e.target.value)}
                                    disabled={audioOutputDevices.length === 0}
                            >
                                {audioOutputDevices.map(device => (
                                    <option key={device.deviceId} value={device.deviceId}>{device.label || `Speaker ${device.deviceId.substring(0, 6)}`}</option>
                                ))}
                                {audioOutputDevices.length === 0 && <option>No speakers found</option>}
                            </select>
                        </div>
                    </div>
                    <span>Make sure you take the interview in a quiet place with good lighting and a good internet speed.</span>
                    <button className="btn btn-primary w-100 mt-4"  onClick={handleStartInterview}
                        disabled={!selectedVideoDevice || !selectedAudioInputDevice}>Start Interview</button>
                </div>
            </div>
        </div>
        </>
    );
};

export default DeviceSelection;