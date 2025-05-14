import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../UI/Footer'
import { useForm } from 'react-hook-form'

export default function AccountSettings() {
  const{register, handleSubmit, formState: {errors}, reset} = useForm();
  const[isChecked, setIsChecked] = useState(false);

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
                <Link className="nav-link active" to="#">
                  <i className="icon-base ti tabler-users icon-sm me-1_5"></i> Account
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/accounts/account-security">
                  <i className="icon-base ti tabler-lock icon-sm me-1_5"></i> Security
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">
                  <i className="icon-base ti tabler-bookmark icon-sm me-1_5"></i> Billing & Plans
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">
                  <i className="icon-base ti tabler-bell icon-sm me-1_5"></i> Notifications
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">
                  <i className="icon-base ti tabler-link icon-sm me-1_5"></i> Connections
                </Link>
              </li>
            </ul>
          </div>
          <div className="card mb-6">
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

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                    <div className="input-group input-group-merge">
                      <span className="input-group-text">PK (+92)</span>
                      <input type="text" id="phoneNumber" name="phoneNumber" className="form-control" placeholder="202 555 0111"  {...register("phoneNumber", { required: "Phone Number is required" })}/>
                    </div>
                    {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber.message}</small>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" name="address" placeholder="Address"  {...register("address", { required: "Address is required" })}/>
                    {errors.address && <small className="text-danger">{errors.address.message}</small>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="state" className="form-label">State</label>
                    <input className="form-control" type="text" id="state" name="state" placeholder="California"  {...register("state", { required: "State is required" })}/>
                    {errors.state && <small className="text-danger">{errors.state.message}</small>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="zipCode" className="form-label">Zip Code</label>
                    <input type="text" className="form-control" id="zipCode" name="zipCode" placeholder="231465" maxLength="6"  {...register("zipCode", { required: "Zip Code is required" })}/>
                    {errors.zipCode && <small className="text-danger">{errors.zipCode.message}</small>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="country">Country</label>
                    <select id="country" className="select2 form-select"  {...register("country", { required: "Country is required" })}>
                      <option value="">Select</option>
                      <option value="Australia">Australia</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Belarus">Belarus</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Canada">Canada</option>
                      <option value="China">China</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="India">India</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Israel">Israel</option>
                      <option value="Italy">Italy</option>
                      <option value="Japan">Japan</option>
                      <option value="Korea">Korea, Republic of</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Russia">Russian Federation</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Turkey">Turkey</option>
                      <option value="Ukraine">Ukraine</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                    </select>
                    {errors.country && <small className="text-danger">{errors.country.message}</small>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="language" className="form-label">Language</label>
                    <select id="language" className="select2 form-select"  {...register("language", { required: "Language is required" })}>
                      <option value="">Select Language</option>
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="pt">Portuguese</option>
                    </select>
                    {errors.language && <small className="text-danger">{errors.language.message}</small>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="timeZones" className="form-label">Timezone</label>
                    <select id="timeZones" className="select2 form-select"  {...register("timeZones", { required: "Timezone is required" })}>
                      <option value="">Select Timezone</option>
                      <option value="-12">(GMT-12:00) International Date Line West</option>
                      <option value="-11">(GMT-11:00) Midway Island, Samoa</option>
                      <option value="-10">(GMT-10:00) Hawaii</option>
                      <option value="-9">(GMT-09:00) Alaska</option>
                      <option value="-8">(GMT-08:00) Pacific Time (US & Canada)</option>
                      <option value="-8">(GMT-08:00) Tijuana, Baja California</option>
                      <option value="-7">(GMT-07:00) Arizona</option>
                      <option value="-7">(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
                      <option value="-7">(GMT-07:00) Mountain Time (US & Canada)</option>
                      <option value="-6">(GMT-06:00) Central America</option>
                      <option value="-6">(GMT-06:00) Central Time (US & Canada)</option>
                      <option value="-6">(GMT-06:00) Guadalajara, Mexico City, Monterrey</option>
                      <option value="-6">(GMT-06:00) Saskatchewan</option>
                      <option value="-5">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option>
                      <option value="-5">(GMT-05:00) Eastern Time (US & Canada)</option>
                      <option value="-5">(GMT-05:00) Indiana (East)</option>
                      <option value="-4">(GMT-04:00) Atlantic Time (Canada)</option>
                      <option value="-4">(GMT-04:00) Caracas, La Paz</option>
                    </select>
                    {errors.timeZones && <small className="text-danger">{errors.timeZones.message}</small>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="currency" className="form-label">Currency</label>
                    <select id="currency" className="select2 form-select"  {...register("currency", { required: "Currency is required" })}>
                      <option value="">Select Currency</option>
                      <option value="usd">USD</option>
                      <option value="euro">Euro</option>
                      <option value="pound">Pound</option>
                      <option value="bitcoin">Bitcoin</option>
                    </select>
                    {errors.currency && <small className="text-danger">{errors.currency.message}</small>}
                  </div>

                </div>
                <div className="mt-2">
                  <button type="submit" className="btn btn-primary me-3">Save changes</button>
                  <button type="reset" className="btn btn-label-secondary" onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
          <div className="card">
            <h5 className="card-header">Delete Account</h5>
            <div className="card-body">
              <div className="mb-6 col-12 mb-0">
                <div className="alert alert-warning">
                  <h5 className="alert-heading mb-1">Are you sure you want to delete your account?</h5>
                  <p className="mb-0">Once you delete your account, there is no going back. Please be certain.</p>
                </div>
              </div>
              <form onSubmit={(e)=> e.preventDefault()}>
                <div className="form-check my-8">
                  <input className="form-check-input" type="checkbox" name="accountActivation" id="accountActivation" 
                  value={isChecked} onChange={(e)=>setIsChecked(e.target.checked)}/>
                  <label className="form-check-label" htmlFor="accountActivation">I confirm my account deactivation</label>
                </div>
                <button type="submit" className="btn btn-danger deactivate-account" disabled={!isChecked}>
                    Deactivate Account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    <div className="content-backdrop fade"></div>
  </div>
  )
}
