import { useForm } from 'react-hook-form';
import Footer from '../UI/Footer';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Settings() {
    const{register, handleSubmit, formState: {errors}, reset, watch} = useForm();
    const[activeTab, setActiveTab] = useState('update-profile');
    

    const onSubmit = async (data) => {
        console.log(data);
    }

  const handleCancel = () => {
    reset();
  }

return (
<div className="content-wrapper">
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="row">
        <div className="col-md-12">
          <div className="nav-align-top">
            <ul className="nav nav-pills flex-column flex-md-row mb-6 gap-md-0 gap-2">
              <li className="nav-item">
                <Link className={`nav-link ${activeTab === 'update-profile' ? 'active' : ''}`} onClick={()=>setActiveTab('update-profile')}>
                  <i className="icon-base ti tabler-users icon-sm me-1_5"></i> Update Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${activeTab === 'change-password' ? 'active' : ''}`} onClick={()=>setActiveTab('change-password')}>
                  <i className="icon-base ti tabler-lock icon-sm me-1_5"></i> Change Password
                </Link>
              </li>
            </ul>
          </div>
          {activeTab === 'update-profile' && <div className="card mb-6">
            <div className="card-body">
              <div className="d-flex align-items-start align-items-sm-center gap-6">
                  <img src="../../assets/img/avatars/1.png" alt="user-avatar" className="d-block w-px-100 h-px-100 rounded" id="uploadedAvatar" />
                  <div className="button-wrapper">
                    <label htmlFor="upload" className="btn btn-primary me-3 mb-4" tabIndex="0">
                      <span className="d-none d-sm-block">Upload new photo</span>
                      <i className="icon-base ti tabler-upload d-block d-sm-none"></i>
                      <input type="file" id="upload" className="account-file-input" hidden accept="image/png, image/jpeg" />
                    </label>
                    <button type="button" className="btn btn-label-secondary account-image-reset mb-4">
                      <i className="icon-base ti tabler-reset d-block d-sm-none"></i>
                      <span className="d-none d-sm-block">Reset</span>
                    </button>
                    <div>Allowed JPG, GIF or PNG. Max size of 800K</div>
                  </div>
              </div>
            </div>
            <div className="card-body pt-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row gy-4 gx-6 mb-6">

                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input className="form-control" type="text" id="firstName" name="firstName" placeholder="John" autoFocus {...register("firstName", { required: "First name is required" })}/>
                    {errors.firstName && <small className="text-danger">{errors.firstName.message}</small>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input className="form-control" type="text" name="lastName" id="lastName" placeholder="Doe"  {...register("lastName", { required: "Last name is required" })}/>
                    {errors.lastName && <small className="text-danger">{errors.lastName.message}</small>}
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">E-mail</label>
                    <input className="form-control" type="text" id="email" name="email" placeholder="john.doe@example.com"  {...register("email", { required: "Email is required" })}/>
                    {errors.email && <small className="text-danger">{errors.email.message}</small>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="organization" className="form-label">Organization</label>
                    <input type="text" className="form-control" id="organization" name="organization" placeholder="john.doe"  {...register("organization", { required: "Organization name is required" })} />
                    {errors.organization && <small className="text-danger">{errors.organization.message}</small>}
                  </div>

                </div>
                <div className="mt-2">
                  <button type="submit" className="btn btn-primary me-3">Save changes</button>
                  <button type="reset" className="btn btn-label-secondary" onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
          }
          {activeTab === 'change-password' && 
            <div className="card">
            <div className="card-body pb-0">
                <h5 style={{color: '#444050'}} className='mb-0'>Change Your Password</h5>
            </div>
            <div className="card-body pt-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row gy-4 gx-6 mb-6">

                  <div className="col-md-6">
                    <label htmlFor="oldPassword">Old Password</label>
                    <input type="password" id="oldPassword" className="form-control" {...register('oldPassword', { required: 'Old password is required' })}/>
                    {errors.oldPassword && <span className="text-danger">{errors.oldPassword.message}</span>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="newPassword">New Password</label>
                    <input type="password" id="newPassword" className="form-control"  {...register('newPassword', { required: 'New password is required' })}/>
                    {errors.newPassword && <span className="text-danger">{errors.newPassword.message}</span>}
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input type="password" id="confirmPassword" className="form-control" {...register('confirmPassword', {
                        required: 'Please confirm your new password', validate: (value) => value === watch('newPassword') || 'Passwords do not match'})}/>
                    {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message}</span>}
                  </div>

                </div>
                <div className="mt-2">
                  <button type="submit" className="btn btn-primary me-3">Save changes</button>
                  <button type="reset" className="btn btn-label-secondary" onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
    <Footer/>
    <div className="content-backdrop fade"></div>
  </div>
  )
}
