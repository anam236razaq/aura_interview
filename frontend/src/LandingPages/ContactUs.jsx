import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../utils/Constants';
import LandingNavbar from './UI/LandingNavbar';
import LandingFooter from './UI/LandingFooter';

export default function ContactUs() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const[isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      const link1 = document.createElement('link');
      link1.rel = 'stylesheet';
      link1.href = '/assets/vendor/css/pages/front-page.css';
  
      const link2 = document.createElement('link');
      link2.rel = 'stylesheet';
      link2.href = '/assets/vendor/css/pages/front-page-landing.css';
  
      document.head.appendChild(link1);
      document.head.appendChild(link2);
  
      return () => {
        document.head.removeChild(link1);
        document.head.removeChild(link2);
      };
    }, []);

  const onSubmit = async (data) => {
        if(isLoading) return;
        const profileData = JSON.parse(localStorage.getItem('profileData'));
        const user_id = profileData?.id;
        const organization_id = profileData?.organization_id 
        const formData = {user_id, organization_id, name: data.fullName, email: data.email, message: data.message};

        try{
            setIsLoading(true);
            const response = await axios.post(`${API_BASE_URL}/inquiries`, formData,
                {
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }
            )
            if (response.status === 201) {
              toast.success('Inquiry submitted successfully!');
            } else {
              toast.error('Failed to submit inquiry. Please try again.');
            }
            reset();
        }catch(error){
            console.log(error);
            toast.error(error.response?.data?.error || 'Something went wrong!');
        }finally{
            setIsLoading(false);
        }
    }

  return (
    <>
      <Toaster reverseOrder={false} position='top-center' />
      <LandingNavbar />
      <div className="container py-5" style={{backgroundColor: '#eaeaea', marginTop: '4rem'}}>
          <div className="page-title-inner">
            <div className="page-title-title">
              <h2 className='text-center mb-1' style={{ color: '#323243' }}>Contact Us</h2>
            </div>
          </div>
          <h4 className="text-center mb-1">
            <span className="position-relative fw-extrabold z-1">
              Let's work
              <img src="./assets/img/front-pages/icons/section-title-icon.png" alt="laptop charging"
                className="section-title-img position-absolute object-fit-contain bottom-0 z-n1" />
            </span>{' '} together
          </h4>

          <p className="text-center pb-md-4">Any question or remark? just write us a message</p>
      </div>

    <section className="section-py bg-body landing-contact">
        <div className="container">

        <div className="row g-6">
          <div className="col-lg-5">
            <div className="contact-img-box position-relative border p-2 h-100">
              <img src="./assets/img/front-pages/icons/contact-border.png" alt="contact border"
                className="contact-border-img position-absolute d-none d-lg-block scaleX-n1-rtl"/>
              <img src="./assets/img/front-pages/landing-page/contact-customer-service.png"
                alt="contact customer service" className="contact-img w-100 scaleX-n1-rtl" />
              <div className="p-4 pb-2">
                <div className="row g-4">
                  <div className="col-md-6 col-lg-12 col-xl-6">
                    <div className="d-flex align-items-center">
                      <div className="badge bg-label-primary rounded p-1_5 me-3">
                        <i className="icon-base ti tabler-mail icon-lg"></i>
                      </div>
                      <div>
                        <p className="mb-0">Email</p>
                        <h6 className="mb-0">
                          <Link to="mailto:example@gmail.com" className="text-heading" >exampl@gmail.com</Link>
                        </h6>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-12 col-xl-6">
                    <div className="d-flex align-items-center">
                      <div className="badge bg-label-success rounded p-1_5 me-3">
                        <i className="icon-base ti tabler-phone-call icon-lg"></i>
                      </div>
                      <div>
                        <p className="mb-0">Phone</p>
                        <h6 className="mb-0">
                          <Link to="tel:+1234-568-963" className="text-heading" >+1234 568 963</Link>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="mb-2">Send a message</h4>
                <p className="mb-6">
                  If you would like to discuss anything related to payment,
                  account, licensing,
                  <br className="d-none d-lg-block" />
                  partnerships, or have pre-sales questions, you’re at the right
                  place.
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" placeholder="john" {...register("fullName", { required:  'This field is required'})} />
                      {errors.fullName && <span className='text-danger small'>{errors.fullName.message}</span>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" placeholder="johndoe@gmail.com"  {...register("email", { required:  'This field is required'})}/>
                      {errors.email && <span className='text-danger small'>{errors.email.message}</span>}
                    </div>

                    <div className="col-12">
                      <label className="form-label" >Message</label>
                      <textarea className="form-control" rows="7" placeholder="Write a message"  {...register("message", { required:  'This field is required'})}></textarea>
                      {errors.message && <span className='text-danger small'>{errors.message.message}</span>}
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary waves-effect waves-light">
                        Send inquiry
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <LandingFooter />
    </>
  );
}
