import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '../utils/Constants';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SubscriptionModal({setShowModal, onAddedSubscription, subscriptionToEdit}) {
    const isEditMode = !!subscriptionToEdit;
    const { register, handleSubmit, formState: { errors }, clearErrors, reset } = useForm();

    // Pre-fill in edit mode
    useEffect(() => {
        if (isEditMode) {
            reset({
                title: subscriptionToEdit.title || '',
                description: subscriptionToEdit.description || '',
                price: subscriptionToEdit.price || '',
                duration: subscriptionToEdit.duration_months || '',
                max_cvs: subscriptionToEdit.max_cvs || '',
                max_users: subscriptionToEdit.max_users || '',
                max_interviews: subscriptionToEdit.max_interviews || '',
                max_processed_cvs: subscriptionToEdit.max_processed_cvs || '',
                no_of_companies: subscriptionToEdit.no_of_companies || '',
                no_of_conducted_interviews: subscriptionToEdit.no_of_conducted_interviews || ''
            });
        }
    }, [subscriptionToEdit, reset, clearErrors, isEditMode]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; }
    }, []);


    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('price', data.price);
        formData.append('description', data.description);
        formData.append('duration_months', data.duration);
        formData.append('max_users', data.max_users);
        formData.append('max_cvs', data.max_cvs);
        formData.append('max_interviews', data.max_interviews);
        formData.append('max_processed_cvs', data.max_processed_cvs);
        formData.append('no_of_companies', data.no_of_companies);
        formData.append('no_of_conducted_interviews', data.no_of_conducted_interviews);

        const token = localStorage.getItem('authToken');
        try {
            const response = isEditMode
                ? await axios.put(`${API_BASE_URL}/subscription/${subscriptionToEdit.id}`, formData, {
                      headers: {
                          'Content-Type': 'multipart/form-data',
                          Authorization: `Bearer ${token}`
                      }
                  })
                : await axios.post(`${API_BASE_URL}/subscription`, formData, {
                      headers: {
                          'Content-Type': 'multipart/form-data',
                          Authorization: `Bearer ${token}`
                      }
                  });

            const subscriptionId = response.data.id || subscriptionToEdit.id;

            const updatedSubscription = {
                id: subscriptionId,
                title: data.title,
                price: data.price,
                duration_months: data.duration,
                max_cvs: data.max_cvs,
                max_users: data.max_users,
                max_interviews: data.max_interviews,
                max_processed_cvs: data.max_processed_cvs,
                no_of_companies: data.no_of_companies,
                no_of_conducted_interviews: data.no_of_conducted_interviews,
                description: data.description,
            };

            onAddedSubscription(updatedSubscription);
            toast.success(response.data.message);
            setShowModal(false);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'An unexpected error occurred');
        }
    };

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
                        <h5 className="mb-2">{isEditMode? 'Edit Subscription' : 'Add Subscription'}</h5>
                    </div>
                    <form className="row g-5" onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
                        <div className='col-12 d-flex align-items-center'>
                            <div className='col-6 pe-2'>
                                <label className='form-label'>Subscription Title</label>
                                <input type='text' className='form-control' {...register('title', { required: 'Title is required' })}/>
                                {errors.title && <span className="text-danger small">{errors.title.message}</span>}
                            </div>
                            <div className='col-6 ps-2'>
                                <label className='form-label'>Duration (Months)</label>
                                <input type='number' className='form-control' {...register('duration', { required: 'Duration is required' })}/>
                                {errors.duration && <span className="text-danger small">{errors.duration.message}</span>}
                            </div>
                        </div>
                        <div className='col-12 d-flex align-items-center'>
                            <div className='col-6 pe-2'>
                                <label className='form-label'>Price</label>
                                <input type='number' className='form-control'  {...register('price', { required: 'Price is required' })}/>
                                {errors.price && <span className="text-danger small">{errors.price.message}</span>}
                            </div>
                            <div className='col-6 ps-2'>
                                <label className='form-label'>Maximum Users</label>
                                <input type='number' className='form-control' {...register('max_users', { required: 'No of users are required' })}/>
                                {errors.max_users && <span className="text-danger small">{errors.max_users.message}</span>}
                            </div>
                        </div>
                        <div className='col-12 d-flex align-items-center'>
                            <div className='col-6 pe-2'>
                                <label className='form-label'>Maximum Cvs</label>
                                <input type='number' className='form-control' {...register('max_cvs', { required: 'No of CVs are required' })} />
                                {errors.max_cvs && <span className="text-danger small">{errors.max_cvs.message}</span>}
                            </div>
                            <div className='col-6 ps-2'>
                                <label className='form-label'>Maximum Interviews</label>
                                <input type='number' className='form-control' {...register('max_interviews', { required: 'No of interviews are required' })}/>
                                {errors.max_interviews && <span className="text-danger small">{errors.max_interviews.message}</span>}
                            </div>
                        </div>
                        <div className='col-12 d-flex align-items-center'>
                            <div className='col-6 pe-2'>
                                <label className='form-label'>Maximum Companies</label>
                                <input type='number' className='form-control' {...register('no_of_companies', { required: 'No of comapnies are required' })} />
                                {errors.no_of_companies && <span className="text-danger small">{errors.no_of_companies.message}</span>}
                            </div>
                            <div className='col-6 ps-2'>
                                <label className='form-label'>Maximum Processed CVs</label>
                                <input type='number' className='form-control' {...register('max_processed_cvs', { required: 'No of processed cvs are required' })}/>
                                {errors.max_processed_cvs && <span className="text-danger small">{errors.max_processed_cvs.message}</span>}
                            </div>
                        </div>
                        <div className='col-12 d-flex flex-column'>
                                <label className='form-label'>Maximum Conducted Interviews</label>
                                <input type='number' className='form-control' {...register('no_of_conducted_interviews', { required: 'No of conducted interviews are required' })} />
                                {errors.no_of_conducted_interviews && <span className="text-danger small">{errors.no_of_conducted_interviews.message}</span>}
                        </div>
                        <div className='col-12 d-flex flex-column'>
                            <label className='form-label'>Description</label>
                            <textarea rows='4' className='form-control' {...register('description', { required: 'Description is required' })}></textarea>
                            {errors.description && <span className="text-danger small">{errors.description.message}</span>}
                        </div>
                        <div className="col-12 d-flex align-items-center justify-content-end">
                            <button type="reset" className="btn btn-label-secondary  me-3"
                                onClick={()=> setShowModal(false)}>Close
                            </button>
                            <button type="submit" className="btn btn-primary">{isEditMode? 'Update' : 'Add'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
