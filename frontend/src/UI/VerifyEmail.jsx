import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export default function VerifyEmail() {
    const[isLoading, setIsLoading] = useState(false);
    

  return (
    <>
        <div className='container-fluid'>
            <div className='row flex-column flex-lg-row align-items-center'>
                <div className='col-lg-7 col-12' style={{ height: '100vh', backgroundImage: 'url(../../assets/img/illustrations/bg-shape-image-light.png)',
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom', backgroundSize: '100% 150px',
                    }}>
                    <img className='ms-4 my-5' src='/assets/img/logo.png' alt='auraInterview' />
                    <img className='mt-4 img-fluid' src="/assets/img/illustrations/auth-verify-email-illustration-light.png" alt='User Img'  style={{ height: '500px', width: '900px', objectFit: 'contain' }}/>
                </div>
                <div className='col-lg-5 col-12 mt-lg-0 mt-5'>
                    <div className="card px-4 py-5 mb-0" style={{height: '100vh', backgroundColor: 'white'}}>
                                <div className="card-body">
                                    <h2 className="fw-bold mb-0" style={{fontSize: '22px'}}>Verify your email ✉️</h2>
                                    <p>Account activation link sent to your email address: john.doe@email.com Please follow the link inside to continue.</p>

        
                                    <div className="mt-3 d-flex justify-content-center align-items-center">
                                        <button type='submit' className="btn btnTheme1 fw-bold px-4 py-2 w-100" onClick={()=>setIsLoading(true)} style={{backgroundColor: '#7367F0', color: 'white'}} disabled={ isLoading}>
                                            {isLoading ? (
                                                <div className="spinner-border text-light"></div>
                                                ) : (
                                                'Skip For Now'
                                            )}
                                        </button> 
                                    </div>
                                    <div className='mt-3 text-center'>
                                       Didn't get the email? <Link className='ms-2'>Resend</Link>
                                    </div>
                            
                                </div>
                        </div>
                </div>
            </div>
        </div>
    </>
  )
}
