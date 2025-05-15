import axios from 'axios';
import React, { useRef, useState} from 'react'
import { API_BASE_URL } from '../utils/Constants';

export default function InterviewVideo({title, text, onUpload}) {
    const fileInputRef = useRef();
    const[videoUrl, setVideoUrl] = useState(null);

    const handleSelectFilesClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if(file){
            const formData = new FormData();
            formData.append('videoFile', file);

            try{
                const token = localStorage.getItem('authToken');
                const response = await axios.post(API_BASE_URL+'/interviews/upload', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                })
                const fileUploadUrl = response?.data?.path
                setVideoUrl(URL.createObjectURL(file));
                onUpload(fileUploadUrl);
                console.log(response);

            }catch(error){
                console.log(error);
            }
        }
    }

  return (
    <div className="card mb-6">
        <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0 card-title">{title}</h5>
        </div>
        <div className="card-body">
            <input type='file' ref={fileInputRef} accept='video/mp4, video/webm' style={{display: 'none'}} onChange={handleFileChange}/>
            {videoUrl ? (
                <video src={videoUrl} controls style={{width: '100%', borderRadius: '6px'}} />
            ) : (
            <div className="dropzone needsclick p-0 dz-clickable" id="dropzone-basic" onClick={handleSelectFilesClick}>
                <div className="dz-message needsclick d-flex align-items-center justify-content-center flex-column py-5" style={{border: '1px dashed lightgray', borderRadius: '6px'}}>
                    <div className='p-2' style={{backgroundColor: '#eeedf0', borderRadius: '6px'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17" stroke="#808390" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 9L12 4L17 9" stroke="#808390" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 4V16" stroke="#808390" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <p className="h4 needsclick pt-3 mb-2">{text}</p>
                    <p className='mb-2 text-black'>Supported file type: .mp4 and .webm</p>
                </div>
            </div>
            )}
        </div>
    </div>
  )
}
