import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '../utils/Constants';
import axios from 'axios';

export default function AddCompanyModal({setShowModal, onAddedCompany}) {
    const {register, handleSubmit, setValue, formState: {errors}, clearErrors} = useForm();
    const fileInputRef = useRef();
    const [logoPreview, setLogoPreview] = useState(null);

    const handleSelectFilesClick = () => {
        if(fileInputRef.current){
            fileInputRef.current.click();
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file){
            setValue('logo', file);
            clearErrors('logo')
            setLogoPreview(URL.createObjectURL(file));
        }
    }

    const onSubmit = async(data) => {
        
        const formData = new FormData();
        formData.append('company_name', data.company_name);
        formData.append('email', data.email);
        formData.append('address', data.address);
        formData.append('city', data.city);
        formData.append('country', data.country);
        formData.append('phone_number', data.phone_number);
        formData.append('title', data.title);
        formData.append('logo', data.logo);
        formData.append('state', data.state);

        try{
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${API_BASE_URL}/companies`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            onAddedCompany(response.data);
            console.log(response);
            setShowModal(false);
        }catch(error){
            console.log(error);
        }

    }

    useEffect(() => {
            register('logo', { required: 'Logo is required' });
            document.body.style.overflow='hidden';
            return () => { document.body.style.overflow='auto'; }
        }, [register]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

  return (
    <div className="modal fade show" tabIndex="-1" role='dialog' onClick={()=>setShowModal(false)} style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <div className="modal-dialog modal-simple modal-dialog-centered" role="document" onClick={(e)=> e.stopPropagation()}>
            <div className="modal-content p-2">
                <div className="modal-body">
                    <button type="button" className="btn-close" onClick={()=> setShowModal(false)} style={{top: '-0.1rem', right: '0.3rem'}}></button>
                    <div className="mb-6">
                        <h5 className="mb-2">Add Company</h5>
                    </div>
                    <form className="row g-5" onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
                        <div className="col-12 col-sm-5">
                            <label className='form-label'>Upload Logo</label>
                            <input type='file'className='form-control' accept='image/jpeg, image/png, image/gif, image/webp' style={{display: 'none'}} 
                                ref={fileInputRef} onChange={handleFileChange}/>
                            <div className="dz-message needsclick d-flex align-items-center justify-content-center flex-column py-5" onClick={handleSelectFilesClick}
                                style={{border: '1px dashed lightgray', borderRadius: '6px'}}>
                                    {logoPreview ? (
                                        <img src={logoPreview} alt='Logo' style={{maxWidth: '100%', maxHeight: '150px'}} />
                                    ) : (
                                        <>
                                            <div className='p-2' style={{backgroundColor: '#eeedf0', borderRadius: '6px'}}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17" stroke="#808390" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M7 9L12 4L17 9" stroke="#808390" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M12 4V16" stroke="#808390" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <p className='mb-2 mt-4 text-black text-center'>Supported file type: .jpeg, .png, .gif and .webp</p>
                                        </>
                                    )}
                            </div> 
                            {errors.logo && <span className="text-danger small">{errors.logo.message}</span>}
                        </div>
                        <div className='col-12 d-flex align-items-center'>
                            <div className='col-6 pe-2'>
                                <label className='form-label'>Company Name</label>
                                <input type='text' className='form-control' {...register('company_name', { required: 'Company Name is required' })}/>
                                {errors.company_name && <span className="text-danger small">{errors.company_name.message}</span>}
                            </div>
                            <div className='col-6 ps-2'>
                                <label className='form-label'>Email</label>
                                <input type='email' className='form-control' {...register('email', { required: 'Email is required' })}/>
                                {errors.email && <span className="text-danger small">{errors.email.message}</span>}
                            </div>
                        </div>
                        <div className='col-12 d-flex align-items-center'>
                            <div className='col-6 pe-2'>
                                <label className='form-label'>Title</label>
                                <input type='text' className='form-control'  {...register('title', { required: 'Title is required' })}/>
                                {errors.title && <span className="text-danger small">{errors.title.message}</span>}
                            </div>
                            <div className='col-6 ps-2'>
                                <label className='form-label'>Phone No</label>
                                <input type='text' className='form-control' {...register('phone_number', { required: 'Phone No is required' })}/>
                                {errors.phone_number && <span className="text-danger small">{errors.phone_number.message}</span>}
                            </div>
                        </div>
                        <div className='col-12 d-flex align-items-center'>
                            <div className='col-6 pe-2'>
                                <label className='form-label'>Address</label>
                                <input type='text' className='form-control' {...register('address', { required: 'Address is required' })} />
                                {errors.address && <span className="text-danger small">{errors.address.message}</span>}
                            </div>
                            <div className='col-6 ps-2'>
                                <label className='form-label'>City</label>
                                <input type='text' className='form-control' {...register('city', { required: 'City is required' })}/>
                                {errors.city && <span className="text-danger small">{errors.city.message}</span>}
                            </div>
                        </div>
                        <div className='col-12 d-flex align-items-center'>
                            <div className='col-6 pe-2'>
                                <label className='form-label'>State</label>
                                <input type='text' className='form-control' {...register('state', { required: 'State is required' })} />
                                {errors.state && <span className="text-danger small">{errors.state.message}</span>}
                            </div>
                            <div className='col-6 ps-2'>
                                <label className='form-label'>Country</label>
                                <input type='text' className='form-control' {...register('country', { required: 'Country is required' })}/>
                                {errors.country && <span className="text-danger small">{errors.country.message}</span>}
                            </div>
                        </div>
                        <div className="col-12 d-flex align-items-center justify-content-end">
                            <button type="reset" className="btn btn-label-secondary  me-3"
                                onClick={()=> setShowModal(false)}>Close
                            </button>
                            <button type="submit" className="btn btn-primary">Add</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
