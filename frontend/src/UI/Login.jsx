import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import ShowPasswordIcon from './ShowPasswordIcon';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/Constants';
import toast, { Toaster } from 'react-hot-toast';
import { useProfileData } from '../Contexts/ProfileContext';

export default function Login({onLogin}) {
    const{register, handleSubmit, formState: {errors}} = useForm();
    const[showPassword, setShowPassword] = useState('');
    const[isChecked, setIsChecked] = useState(false);
    const[isLoading, setIsLoading] = useState(false);
    const { fetchUserData } =useProfileData();
    const navigate = useNavigate();
    
    const onSubmit = async (data) => {
        if(isLoading) return;
        const loginData = {email: data.email, password: data.password};

        try{
            setIsLoading(true);
            const response = await axios.post(API_BASE_URL+'/auth/login', loginData,
                {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                }
            )
            const token = response?.data?.token;
            localStorage.setItem('roleId', response?.data?.role_id);
            
            toast.success("Login successful");
            onLogin(token);
            await fetchUserData();

            setTimeout(()=> {
                navigate('/')
            }, 3000)

        }catch(error){
            console.log(error);
            toast.error(error?.response?.data?.message || 'Login Failed. Please try again');
        }finally{
            setIsLoading(false);
        }
    }

  return (
    <>
        <Toaster position="top-center" reverseOrder={false} />
        <div className='container-fluid'>
            <div className='row flex-column flex-lg-row align-items-center'>
                <div className='col-lg-7 col-12' style={{ height: '100vh', backgroundImage: 'url(../../assets/img/illustrations/bg-shape-image-light.png)',
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom', backgroundSize: '100% 150px',
                    }}>
                    <img className='ms-4 my-5' src='/assets/img/logo.png' alt='auraInterview' />
                    <img className='mt-4 img-fluid' src="/assets/img/illustrations/auth-login-illustration-light.png" alt='User Img' style={{height: '500px', width: '900px', objectFit: 'contain'}} />
                </div>
                <div className='col-lg-5 col-12 mt-lg-0 mt-5'>
                    <form action="" className="card px-4 py-5 mb-0 d-flex" onSubmit={handleSubmit(onSubmit)} style={{height: '100vh', backgroundColor: 'white'}}>
                                <div className="card-body">
                                    <h2 className="fw-bold mb-0" style={{fontSize: '22px'}}>Welcome to KeyDevs! 👋🏻</h2>
                                    <p>Please sign-in to your account and start the adventure</p>
        
                                      <div className=" mt-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" placeholder='Enter your email'
                                          {...register('email', {required: 'Email is required'})} />
                                        {errors.email && <small className='text-danger'>{errors.email.message}</small>}
                                      </div>
        
                                      <div className="mt-3 position-relative">
                                        <label className="form-label">Password</label>
                                        <input type={showPassword? 'text' :'password'} className="form-control" 
                                          {...register('password', {required: 'Password is required'})} />
                                        <ShowPasswordIcon showPassword={showPassword} setShowPassword={setShowPassword}/>
                                        {errors.password && <small className='text-danger'>{errors.password.message}</small>}
                                      </div>

                                      <div className='mt-3 d-flex align-items-center justify-content-between'>
                                        <div className='form-check'>
                                            <input type='checkbox' className='form-check-input custom-checkbox me-2' style={{borderColor: '#7367F0', marginTop: '0.1rem'}} id="Check" 
                                            {...register('terms')} onChange={(e)=>setIsChecked(e.target.checked)} checked={isChecked}/>
                                            <label className="form-check-label" htmlFor="Check" style={{fontWeight: '500'}}>Remember Me</label>
                                        </div>
                                        <Link>Forgot Password?</Link>
                                      </div>
        
                                    <div className="mt-3 d-flex justify-content-center align-items-center">
                                        <button type='submit' className="btn btnTheme1 fw-bold px-4 py-2 w-100" style={{backgroundColor: '#7367F0', color: 'white'}} disabled={isLoading}>
                                            {isLoading ? (
                                              <div className="spinner-border text-light"></div>
                                              ) : (
                                              'Login'
                                            )}
                                        </button> 
                                    </div>
                                    <div className='text-center mt-2'><span className='me-2'>New on our platform?</span><Link to='/register'>Create an account</Link></div>
                                    <div className="my-2 fw-bold text-center">
                                        Or
                                    </div>
                                    <div className='text-center'>
                                        <Link>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <g clipPath="url(#clip0_158_7190)">
                                                <path d="M15 1.66675C15.2041 1.66677 15.4011 1.74171 15.5536 1.87734C15.7062 2.01298 15.8036 2.19987 15.8275 2.40258L15.8333 2.50008V5.83342C15.8333 6.03753 15.7584 6.23453 15.6227 6.38706C15.4871 6.53959 15.3002 6.63703 15.0975 6.66091L15 6.66675H12.5V7.50008H15C15.1186 7.50013 15.2359 7.5255 15.3439 7.5745C15.4519 7.6235 15.5483 7.69501 15.6265 7.78423C15.7046 7.87345 15.7629 7.97834 15.7972 8.09187C15.8316 8.20541 15.8414 8.32498 15.8258 8.44258L15.8092 8.53591L14.9758 11.8692C14.9345 12.0338 14.8438 12.1819 14.7161 12.2936C14.5883 12.4053 14.4295 12.4753 14.2608 12.4942L14.1667 12.5001H12.5V17.5001C12.5 17.7042 12.425 17.9012 12.2894 18.0537C12.1538 18.2063 11.9669 18.3037 11.7642 18.3276L11.6667 18.3334H8.33333C8.12922 18.3334 7.93222 18.2585 7.77969 18.1228C7.62716 17.9872 7.52971 17.8003 7.50583 17.5976L7.5 17.5001V12.5001H5.83333C5.62922 12.5001 5.43222 12.4251 5.27969 12.2895C5.12716 12.1539 5.02971 11.967 5.00583 11.7642L5 11.6667V8.33342C5.00003 8.1293 5.07496 7.9323 5.2106 7.77977C5.34623 7.62724 5.53312 7.5298 5.73583 7.50592L5.83333 7.50008H7.5V6.66675C7.49995 5.3731 8.00131 4.12978 8.89872 3.19802C9.79614 2.26626 11.0198 1.71859 12.3125 1.67008L12.5 1.66675H15Z" fill="#4267B2"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_158_7190">
                                            <rect width="20" height="20" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                        </Link>
                                        <Link>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                                            <g clipPath="url(#clip0_12_23761)">
                                                <path d="M18.715 9.84157C17.2092 10.4807 16.2192 11.8857 16.1684 13.4916L16.1667 13.6432L15.9642 13.6241C13.9709 13.3999 12.2159 12.3641 11.0109 10.6816C10.9293 10.5675 10.8202 10.4759 10.6938 10.4153C10.5674 10.3546 10.4277 10.3268 10.2877 10.3344C10.1477 10.3421 10.0119 10.3849 9.89286 10.459C9.77382 10.5331 9.67539 10.636 9.60669 10.7582L9.52586 10.9132L9.48503 10.9957C8.88586 12.2332 8.49336 13.7374 8.63753 15.3316L8.66253 15.5591C8.89836 17.4449 9.91253 19.0716 11.8117 20.2916L11.9559 20.3807L11.8884 20.4166C10.7925 20.9691 9.79003 21.2099 8.69919 21.1666C7.81919 21.1332 7.49419 22.3099 8.26753 22.7316C11.2659 24.3657 14.485 24.8699 17.2609 24.0649C20.6442 23.0816 23.2209 20.5457 24.2067 17.0374L24.3125 16.6249C24.5109 15.7974 24.6225 14.9532 24.6467 14.1049L24.6492 13.8282L24.9767 13.1791L25.3434 12.4607L25.5217 12.0991L25.62 11.8932C25.8409 11.4224 26 11.0324 26.0984 10.7016L26.11 10.6549L26.1167 10.6399C26.3 10.1457 25.9784 9.50824 25.3325 9.50824L25.2309 9.51407C25.165 9.52217 25.1004 9.53811 25.0384 9.56157L24.9667 9.59324C24.7289 9.70873 24.4839 9.80894 24.2334 9.89324L23.9367 9.98907L23.7109 10.0557L23.0675 10.2341C21.9542 9.30241 20.4475 9.18907 18.8909 9.77241L18.715 9.84157Z" fill="#1DA1F2"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_12_23761">
                                            <rect width="20" height="20" fill="white" transform="translate(7 7)"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                        </Link>
                                        <Link>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                                            <g clipPath="url(#clip0_12_23762)">
                                                <path d="M11.4292 8.74998C12.0883 8.65581 13.0125 8.87081 14.2067 9.55498L14.4333 9.68915L14.5667 9.77248L14.8975 9.70331C16.159 9.45955 17.4533 9.437 18.7225 9.63665L19.1025 9.70331L19.4325 9.77248L19.5667 9.68915C20.7208 8.98915 21.6392 8.71415 22.335 8.73248L22.4717 8.73915L22.5942 8.75331L22.6575 8.76498L22.6992 8.77415L22.8192 8.81331C23.0156 8.89453 23.1736 9.04776 23.2608 9.24165C23.6018 10.0014 23.7167 10.8433 23.5917 11.6666L23.5525 11.8891L23.5142 12.0525L23.6167 12.1883C24.095 12.8508 24.3917 13.6283 24.475 14.4441L24.4942 14.69L24.5 14.9166C24.5 18.1291 23.1175 19.8191 20.63 20.4833L20.4258 20.5341L20.3158 20.5583L20.3275 20.6925L20.3342 20.8233L20.3375 21.1275L20.3358 21.305L20.3333 24.5C20.3333 24.7041 20.2584 24.9011 20.1227 25.0536C19.9871 25.2062 19.8002 25.3036 19.5975 25.3275L19.5 25.3333H14.5C14.2959 25.3333 14.0989 25.2584 13.9464 25.1227C13.7938 24.9871 13.6964 24.8002 13.6725 24.5975L13.6667 24.5V23.8883C12.1517 24.105 11.1417 23.535 10.2417 22.3233L9.79583 21.685C9.5625 21.355 9.41667 21.2025 9.305 21.1483L9.265 21.1325C9.05868 21.0654 8.88663 20.9206 8.78543 20.7287C8.68423 20.5368 8.66186 20.313 8.72306 20.1049C8.78426 19.8967 8.92422 19.7207 9.11318 19.6141C9.30215 19.5075 9.52523 19.4788 9.735 19.5341C10.27 19.6908 10.63 20.0075 11.0433 20.5666L11.4917 21.2075C12.125 22.1066 12.625 22.4233 13.6658 22.2L13.6667 21.635L13.6517 21.495C13.6271 21.267 13.6212 21.0373 13.6342 20.8083L13.6483 20.6541L13.6642 20.5541L13.5742 20.5341C11.0942 19.9425 9.655 18.39 9.51167 15.4183L9.50333 15.16L9.5 14.9166C9.50097 14.0138 9.76381 13.1306 10.2567 12.3741L10.3833 12.1891L10.485 12.0533L10.4475 11.89C10.2973 11.158 10.3389 10.3995 10.5683 9.68831L10.6517 9.45331L10.74 9.24248C10.827 9.04875 10.9847 8.89554 11.1808 8.81415L11.3008 8.77498L11.4292 8.74998Z" fill="#2F2B3D" fillOpacity="0.9"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_12_23762">
                                                <rect width="20" height="20" fill="white" transform="translate(7 7)"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                        </Link>
                                        <Link>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                                            <g clipPath="url(#clip0_12_23763)">
                                            <path d="M17 8.66676C18.9085 8.66406 20.7596 9.31917 22.2416 10.5218C22.3352 10.5976 22.4113 10.6927 22.4645 10.8007C22.5178 10.9088 22.547 11.027 22.5502 11.1474C22.5533 11.2678 22.5304 11.3874 22.4829 11.4981C22.4354 11.6088 22.3644 11.7078 22.275 11.7884L21.0166 12.9234C20.8737 13.0521 20.6906 13.1274 20.4985 13.1366C20.3063 13.1457 20.1169 13.088 19.9625 12.9734C19.1152 12.3507 18.0931 12.0109 17.0416 12.0024C15.9901 11.994 14.9627 12.3172 14.1055 12.9262C13.2482 13.5353 12.6049 14.399 12.2668 15.3947C11.9287 16.3905 11.9132 17.4674 12.2223 18.4725C12.5315 19.4775 13.1497 20.3595 13.989 20.993C14.8283 21.6265 15.8459 21.9793 16.8972 22.0012C17.9486 22.0231 18.98 21.713 19.8449 21.1149C20.7098 20.5169 21.3642 19.6614 21.715 18.6701L21.7158 18.6668H18.6658C18.4618 18.6665 18.265 18.5915 18.1127 18.4559C17.9603 18.3203 17.863 18.1335 17.8391 17.9309L17.8333 17.8334V16.1668C17.8333 15.9457 17.9211 15.7338 18.0774 15.5775C18.2337 15.4212 18.4456 15.3334 18.6666 15.3334H24.4541C24.6593 15.3334 24.8572 15.4091 25.0101 15.5459C25.1629 15.6828 25.2599 15.8712 25.2825 16.0751C25.3158 16.3809 25.3333 16.6893 25.3333 17.0001C25.3333 21.6026 21.6025 25.3334 17 25.3334C12.3975 25.3334 8.66663 21.6026 8.66663 17.0001C8.66663 12.3976 12.3975 8.66676 17 8.66676Z" fill="#FF4C51"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_12_23763">
                                                <rect width="20" height="20" fill="white" transform="translate(7 7)"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                        </Link>
                                    </div>
                                </div>
                        </form>
                </div>
            </div>
        </div>
    </>
  )
}

/*minLength: {
    value: 8,
    message: 'Password must be at least 8 characters'
  }*/