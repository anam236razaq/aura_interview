import axios from 'axios';
import { useEffect } from 'react'
import { useState } from 'react';
import { API_BASE_URL } from '../utils/Constants';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function UpdateUser({setShowModal, onAddedUser, userId}) {
    const[roles, setRoles] = useState([]);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
            document.body.style.overflow='hidden';
            return () => { document.body.style.overflow='auto'; }
        }, []);
    
    useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('authToken');

            // Fetch roles first
            const rolesRes = await axios.get(`${API_BASE_URL}/roles`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRoles(rolesRes.data);

            // Then fetch user
            if (userId) {
                const userRes = await axios.get(`${API_BASE_URL}/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const user = userRes.data;

                reset({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role_id: user.role_id.toString() 
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    fetchData();
}, [userId, reset]);


    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(`${API_BASE_URL}/users/${userId}`, {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                role_id: data.role_id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response);

            const role = roles.find(r => r.id === parseInt(data.role_id));
            const updatedUser = { ...data, id: userId, role_name: role?.name };

            onAddedUser(updatedUser);
            reset();
            setShowModal(false);
            toast.success(response.data.message || 'User updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update user');
        }
    };


  return (
    <div className="modal fade show" tabIndex="-1" role='dialog' onClick={()=>setShowModal(false)} style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <div className="modal-dialog modal-simple modal-dialog-centered" role="document" onClick={(e)=> e.stopPropagation()}>
            <div className="modal-content p-2">
                <div className="modal-body">
                    <button type="button" className="btn-close" onClick={()=> setShowModal(false)} style={{top: '-0.1rem', right: '0.3rem'}}></button>
                    <div className="mb-6">
                        <h5 className="mb-2">Update User</h5>
                    </div>
                    <form className="row g-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className='col-12 d-flex align-items-center'>
                            <div className='col-6 pe-2'>
                                <label className='form-label'>First Name</label>
                                <input type='text' className='form-control' placeholder='First Name' {...register('first_name')}/>
                            </div>
                            <div className='col-6 ps-2'>
                                <label className='form-label'>Last Name</label>
                                <input type='text' className='form-control' placeholder='Last Name' {...register('last_name')}/>
                            </div>
                        </div>
                        <div className="col-12">
                            <label className='form-label'>Email</label>
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
                                    placeholder="Email Address" {...register('email')}/>
                            </div>
                        </div>
                        <div className='col-12'>
                            <label className='form-label'>Role</label>
                            <select className='form-select' {...register('role_id')}>
                                <option value="">Select</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 d-flex align-items-center justify-content-end">
                            <button type="reset" className="btn btn-label-secondary  me-3"
                                onClick={()=> setShowModal(false)}>Close
                            </button>
                            <button type="submit" className="btn btn-primary">Update User</button>
                        </div>
                    </form>
                </div> 
            </div>
        </div>
    </div>
  )
}
