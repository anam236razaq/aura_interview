import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import ShowPasswordIcon from './ShowPasswordIcon';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
    const{register, handleSubmit, formState: {errors}, watch} = useForm();
    const[showPassword, setShowPassword] = useState('');
      const[showPasswordConfirm, setShowPasswordConfirm] = useState('');
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
                    <img className='mt-4 img-fluid' src="/assets/img/illustrations/auth-reset-password-illustration-light.png" alt='User Img' style={{ height: '500px', width: '900px', objectFit: 'contain' }} />
                </div>
                <div className='col-lg-5 col-12'>
                    <form action="" className="card px-4 py-5 mb-0 signUpForm" onSubmit={handleSubmit(onSubmit)} style={{height: '100vh', backgroundColor: 'white'}}>
                                <div className="card-body">
                                    <h2 className="fw-bold mb-0" style={{fontSize: '22px'}}>Reset Passwoard 🔒</h2>
                                    <p>Your new password must be different from previously used passwords</p>
        
                                      <div className="mt-3 position-relative">
                                        <label className="form-label">New Password</label>
                                        <input type={showPassword? 'text' :'password'} className="form-control" 
                                          {...register('password', {required: 'Password is required',   minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters'
                                          },})} />
                                        <ShowPasswordIcon showPassword={showPassword} setShowPassword={setShowPassword}/>
                                        {errors.password && <small className='text-danger'>{errors.password.message}</small>}
                                    </div>

                                    <div className="mt-3 position-relative">
                                        <label className="form-label">Confirm Password</label>
                                        <input type={showPasswordConfirm? 'text' :'password'} className="form-control"
                                        {...register('passwordConfirmation', {required: 'Please confirm your password',   minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters'
                                        }, 
                                        validate: (value) => value === watch('password') || 'Passwords do not match'})} />
                                        <ShowPasswordIcon showPassword={showPasswordConfirm} setShowPassword={setShowPasswordConfirm}/>
                                        {errors.passwordConfirmation && <small className='text-danger'>{errors.passwordConfirmation.message}</small>}
                                    </div>

        
                                    <div className="mt-3 d-flex justify-content-center align-items-center">
                                        <button type='submit' className="btn btnTheme1 fw-bold px-4 py-2 w-100" style={{backgroundColor: '#7367F0', color: 'white'}} disabled={ isLoading}>
                                            {isLoading ? (
                                                <div className="spinner-border text-light"></div>
                                                ) : (
                                                'Set New Password'
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
