import React, { useEffect } from 'react'

export default function UserModel({setShowModal}) {

    useEffect(() => {
            document.body.style.overflow='hidden';
            return () => { document.body.style.overflow='auto'; }
        }, []);

  return (
    <div className="modal fade show" tabIndex="-1" role='dialog' onClick={()=>setShowModal(false)} style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <div className="modal-dialog modal-simple modal-dialog-centered" role="document" onClick={(e)=> e.stopPropagation()}>
            <div className="modal-content p-2">
                <div className="modal-body">
                    <button type="button" className="btn-close" onClick={()=> setShowModal(false)} style={{top: '-0.1rem', right: '0.3rem'}}></button>
                    <div className="mb-6">
                        <h5 className="mb-2">Invite User</h5>
                    </div>
                    <p>Fill out the email address to invite a user to your account.</p>
                    <form className="row g-5" onSubmit="return false">
                        <div className="col-12 form-control-validation">
                            <div className="input-group input-group-merge">
                                <span className="input-group-text" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M2.66675 13.3333H4.66675" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M9.33325 13.3333H13.9999" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M4.59985 10H9.19985" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M6.80005 4.20001L10.6667 13.3333" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M3.33325 13.3334L7.33325 2.66669H8.66659L13.3333 13.3334" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                                <input type="email"
                                    className="form-control"
                                    placeholder="Email Address" />
                            </div>
                        </div>
                        <div className="col-12 d-flex align-items-center justify-content-end">
                            <button type="reset" className="btn btn-label-secondary  me-3"
                                onClick={()=> setShowModal(false)}>Close
                            </button>
                            <button type="submit" className="btn btn-primary">Invite User</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
