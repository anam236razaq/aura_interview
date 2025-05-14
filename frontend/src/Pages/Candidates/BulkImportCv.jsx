import React, { useRef } from 'react'
import Footer from '../../UI/Footer';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Constants';
import { useState } from 'react';

export default function BulkImportCv() {
    const[uploadProgressList, setUploadProgressList] = useState([]);
    const fileInputRef = useRef(null);
    
    const handleSelectFilesClick = () => {
        fileInputRef.current.click();
    }
    
    const handleFileChange = async(event) => {
        const files = event.target.files;
        const token = localStorage.getItem('authToken');
        const updatedProgressList =[];

        for(let i = 0; i<files.length; i++){
            const file = files[i]
            const formData = new FormData();
            formData.append('cvFile', file);

            updatedProgressList.push({name: file.name, progress: 0});
            setUploadProgressList([...updatedProgressList]);

            try{
                const response = await axios.post(API_BASE_URL+ '/cv/upload', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }, 

                    onUploadProgress: (progressEvent) => {
                        const percent = Math.min(Math.round((progressEvent.loaded * 100) / progressEvent.total), 95);
                        updatedProgressList[i].progress = percent;
                        setUploadProgressList([...updatedProgressList])
                    }
                });

                updatedProgressList[i].progress = 100;
                setUploadProgressList([...updatedProgressList])
                console.log(response);
            }catch(error){
                console.log(error);
                updatedProgressList[i].progress = 'Failed';
                setUploadProgressList([...updatedProgressList]);
            }
        }
    }


  return (
     <div className="content-wrapper">
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className='mb-4'>
          <p className='mb-2 text-black' style={{fontSize: '18px', fontWeight: '600'}}>Candidate CV List</p>
          <span>Import bulk CV AI Sorted</span>
        </div>
        <div className="card mb-6">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 card-title">Upload Cvs</h5>
            </div>
            <div className="card-body">
                <input type='file' ref={fileInputRef} multiple accept='.doc,.docx,.pdf,.txt' style={{display: 'none'}} onChange={handleFileChange} />
                <div className="dropzone needsclick p-0 dz-clickable" id="dropzone-basic" onClick={handleSelectFilesClick}>
                    <div className="dz-message needsclick d-flex align-items-center justify-content-center flex-column" style={{border: '1px dashed lightgray', borderRadius: '6px', padding: '3rem 0'}}>
                        <div className='p-2' style={{backgroundColor: '#eeedf0', borderRadius: '6px'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17" stroke="#808390" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7 9L12 4L17 9" stroke="#808390" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 4V16" stroke="#808390" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <p className="h4 needsclick pt-3 mb-2">Drag and drop your CVs here</p>
                        <p className='mb-2 text-black'>Supported file type: .docx, doc and pdf</p>
                        <p className='mb-2 text-black'>Max 20 files at once, 10MB each.</p>
                        <p className="h6 text-body-secondary d-block fw-normal mb-2">or</p>
                        <span className="needsclick btn btn-sm btn-label-primary waves-effect" id="btnBrowse" onClick={(e)=> {e.stopPropagation(); handleSelectFilesClick()}}>Select Files</span>
                    </div>
                </div>
            </div>
        </div>
        {uploadProgressList.length > 0 && (<div className="card mb-6">
            <div className="card-header d-flex flex-column pb-0">
                <h5 className="mb-0 card-title">Uploading in Progress</h5>
                <span>Don’t close browser, uploading will stop..</span>
            </div>
            <div className="card-body">
                {uploadProgressList.map((file, index) => (
                    <div key={index} className="pb-0 pt-5">
                        <div className="d-flex align-items-center justify-content-between">
                            <h6 className="fw-normal mb-2">{file.name}</h6>
                            <p className="text-body mb-1">{typeof file.progress === 'number' ? `${file.progress}%` : file.progress}</p>
                        </div>
                        <div className="progress" style={{height: '6px'}}>
                            <div className={`progress-bar ${file.progress === 'Failed' ? 'bg-danger' : ''}`} role="progressbar" style={{width: `${file.progress}%`}}
                                aria-valuenow={file.progress} aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                ))} 
            </div>
        </div>
        )}
      </div>
      <Footer />
      <div className="content-backdrop fade"></div>
    </div>
  )
}
