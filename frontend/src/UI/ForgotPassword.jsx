import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const{register, handleSubmit, formState: {errors}} = useForm();
    const[isLoading, setIsLoading] = useState(false);
    
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
                    <img className='mt-4 img-fluid' src="/assets/img/illustrations/auth-forgot-password-illustration-light.png" alt='User Img' style={{ height: '500px', width: '900px', objectFit: 'contain' }}  />
                </div>
                <div className='col-lg-5 col-12 mt-lg-0 mt-5'>
                    <form action="" className="card px-4 py-5 mb-0 signUpForm" onSubmit={handleSubmit(onSubmit)} style={{height: '100vh', backgroundColor: 'white'}}>
                                <div className="card-body">
                                    <h2 className="fw-bold mb-0" style={{fontSize: '22px'}}>Forgot Passwoard 🔒</h2>
                                    <p>Enter your email and we'll send you instructions to reset your password</p>
        
                                    <div className="mt-2">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" placeholder='Enter your email' 
                                            {...register('email', {required: 'Email is required', 
                                              pattern: {
                                                value: /^\S+@\S+\.\S+$/,
                                                message: 'Enter a valid email'
                                              }
                                            })} />
                                        {errors.email && <small className='text-danger'>{errors.email.message}</small>}
                                      </div>

        
                                    <div className="mt-3 d-flex justify-content-center align-items-center">
                                        <button type='submit' className="btn btnTheme1 fw-bold px-4 py-2 w-100" style={{backgroundColor: '#7367F0', color: 'white'}} disabled={ isLoading}>
                                            {isLoading ? (
                                                <div className="spinner-border text-light"></div>
                                                ) : (
                                                'Send Reset Link'
                                            )}
                                        </button> 
                                    </div>
                                    <div className='mt-3 text-center'>
                                        <Link>
                                            <svg className='mb-1 me-1' xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                            <path d="M13 5L8 10L13 15" stroke="#7367F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg> 
                                            <span>Back to login</span></Link>
                                    </div>
                            
                                </div>
                        </form>
                </div>
            </div>
        </div>
    </>
  )
}

