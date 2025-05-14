import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export default function TwoStepVerification() {
    const[isLoading, setIsLoading] = useState(false);
    const{handleSubmit} = useForm();
    
    const onSubmit = async (data) => {
        setIsLoading(true);
        console.log(data);
    }
    
    return (
      <>
          <div className='container-fluid'>
              <div className='row flex-column flex-lg-row align-items-center'>
                  <div className='col-lg-7 col-12' style={{ height: '100vh', backgroundImage: 'url(../../assets/img/illustrations/bg-shape-image-light.png)',
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom', backgroundSize: '100% 150px',
                    }}>
                      <img className='ms-4 my-5' src='/assets/img/logo.png' alt='auraInterview' />
                      <img className='mt-4 img-fluid' src="/assets/img/illustrations/auth-two-step-illustration-light.png" alt='User Img' style={{height: '500px', width: '900px', objectFit: 'contain'}} />
                  </div>
                  <div className='col-lg-5 col-12 mt-lg-0 mt-5'>
                      <form action="" className="card px-4 py-5 mb-0 signUpForm" onSubmit={handleSubmit(onSubmit)} style={{height: '100vh', backgroundColor: 'white'}}>
                                  <div className="card-body">
                                      <h2 className="fw-bold mb-0" style={{fontSize: '22px'}}>Two Step Verification 💬</h2>
                                      <p className='mb-0'>We sent a verification code to your mobile. Enter the code from the mobile in the field below.</p>
                                      <span>******1234</span>

                                    <div className='mt-2'>
                                        <p>Type your 6 digit security code</p>
                                        <div className="d-flex justify-content-between mt-3">
                                            <input type="text" maxLength="1" className="form-control text-center" style={{ width: '45px', height: '45px', fontSize: '20px', borderRadius: '8px' }} />
                                            <input type="text" maxLength="1" className="form-control text-center" style={{ width: '45px', height: '45px', fontSize: '20px', borderRadius: '8px' }} />
                                            <input type="text" maxLength="1" className="form-control text-center" style={{ width: '45px', height: '45px', fontSize: '20px', borderRadius: '8px' }} />
                                            <input type="text" maxLength="1" className="form-control text-center" style={{ width: '45px', height: '45px', fontSize: '20px', borderRadius: '8px' }} />
                                            <input type="text" maxLength="1" className="form-control text-center" style={{ width: '45px', height: '45px', fontSize: '20px', borderRadius: '8px' }} />
                                            <input type="text" maxLength="1" className="form-control text-center" style={{ width: '45px', height: '45px', fontSize: '20px', borderRadius: '8px' }} />
                                        </div>
                                    </div>
  
          
                                      <div className="mt-3 d-flex justify-content-center align-items-center">
                                          <button type='submit' className="btn btnTheme1 fw-bold px-4 py-2 w-100" style={{backgroundColor: '#7367F0', color: 'white'}} disabled={ isLoading}>
                                              {isLoading ? (
                                                  <div className="spinner-border text-light"></div>
                                                  ) : (
                                                  'Verify My Account'
                                              )}
                                          </button> 
                                      </div>
                                      <div className='mt-3 text-center'>
                                         Didn't get the email? <Link className='ms-2'>Resend</Link>
                                      </div>
                              
                                  </div>
                          </form>
                  </div>
              </div>
          </div>
      </>
    )
  }
