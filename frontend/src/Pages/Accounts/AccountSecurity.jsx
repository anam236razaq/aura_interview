import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../UI/Footer';
import ShowPasswordIcon from '../../UI/ShowPasswordIcon';
import { useForm } from 'react-hook-form';

export default function AccountSecurity() {
  const {register, handleSubmit, formState: {errors}, reset} = useForm();
  const[showPassword, setShowPassword] = useState('');
  const[showCurrentPassword, setShowCurrentPassword] = useState('');
  const[showConfirmPassword, setShowConfirmPassword] = useState('')

  const onSubmit = async (data) => {
    console.log(data);
  }

  const handleReset = () => {
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
                        <Link className="nav-link" to="/accounts/account-settings"
                          ><i className="icon-base ti tabler-users icon-sm me-1_5"></i> Account
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link active" to="#"
                          ><i className="icon-base ti tabler-lock icon-sm me-1_5"></i> Security
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="#"
                          ><i className="icon-base ti tabler-bookmark icon-sm me-1_5"></i> Billing & Plans
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="#"
                          ><i className="icon-base ti tabler-bell icon-sm me-1_5"></i> Notifications
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="#"
                          ><i className="icon-base ti tabler-link icon-sm me-1_5"></i> Connections
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="card mb-6">
                    <h5 className="card-header">Change Password</h5>
                    <div className="card-body pt-1">
                      <form id="formAccountSettings" method="GET" onSubmit={handleSubmit(onSubmit)}>

                        <div className="row mb-sm-6 mb-2">
                          <div className="col-md-6  position-relative ">
                            <label className="form-label" htmlFor="currentPassword">Current Password</label>
                            <input type={showPassword? 'text' :'password'} className="form-control" id="currentPassword" name="currentPassword"  
                              placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" {...register("currentPassword", { required: "Current Password is required",  minLength: { value: 8, message: "Password must be at least 8 characters" } })}/>
                            <ShowPasswordIcon showPassword={showPassword} setShowPassword={setShowPassword}/>
                            {errors.currentPassword && <small className="text-danger">{errors.currentPassword.message}</small>}
                          </div>
                        </div>

                        <div className="row gy-sm-6 gy-2 mb-sm-0 mb-2">
                          <div className="mb-6 col-md-6 position-relative">
                            <label className="form-label" htmlFor="newPassword">New Password</label>
                            <input type={showCurrentPassword? 'text' :'password'} className="form-control" id="newPassword" name="newPassword"  
                              placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" {...register("newPassword", { required: "New Password is required",  minLength: { value: 8, message: "Password must be at least 8 characters" } })}/>
                            <ShowPasswordIcon showPassword={showCurrentPassword} setShowPassword={setShowCurrentPassword}/>
                            {errors.newPassword && <small className="text-danger">{errors.newPassword.message}</small>}
                          </div>

                          <div className="mb-6 col-md-6 position-relative">
                            <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                            <input type={showConfirmPassword? 'text' :'password'} className="form-control" id="confirmPassword" name="confirmPassword"  
                              placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" {...register("confirmPassword", { required: "Confirm Password is required",  minLength: { value: 8, message: "Password must be at least 8 characters" } })}/>
                            <ShowPasswordIcon showPassword={showConfirmPassword} setShowPassword={setShowConfirmPassword}/>
                            {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword.message}</small>}
                          </div>

                        </div>
                        <h6 className="text-body">Password Requirements:</h6>
                        <ul className="ps-4 mb-0">
                          <li className="mb-4">Minimum 8 characters long</li>
                          <li className="mb-4">At least one lowercase character</li>
                          <li>At least one number, symbol, or whitespace character</li>
                        </ul>
                        <div className="mt-6">
                          <button type="submit" className="btn btn-primary me-3">Save changes</button>
                          <button type="reset" className="btn btn-label-secondary" onClick={handleReset}>Reset</button>
                        </div>
                      </form>
                    </div>
                  </div>
              
                  <div className="card mb-6">
                    <div className="card-body">
                      <h5 className="mb-6">Two-steps verification</h5>
                      <h5 className="mb-4 text-body">Two factor authentication is not enabled yet.</h5>
                      <p className="w-75">
                        Two-factor authentication adds an additional layer of security to your account by requiring more
                        than just a password to log in.
                        <a href="javascript:void(0);" className="text-nowrap">Learn more.</a>
                      </p>
                      <button className="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#enableOTP">
                        Enable Two-Factor Authentication
                      </button>
                    </div>
                  </div>
                
                  <div className="modal fade" id="enableOTP" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-simple modal-enable-otp modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-body">
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          <div className="text-center mb-6">
                            <h4 className="mb-2">Enable One Time Password</h4>
                            <p>Verify Your Mobile Number for SMS</p>
                          </div>
                          <p>
                            Enter your mobile phone number with country code and we will send you a verification code.
                          </p>
                          <form id="enableOTPForm" className="row g-5" onSubmit={(e)=> e.preventDefault()}>
                            <div className="col-12 form-control-validation">
                              <label className="form-label" htmlFor="modalEnableOTPPhone">Phone Number</label>
                              <div className="input-group">
                                <span className="input-group-text">PK (+92)</span>
                                <input
                                  type="text"
                                  id="modalEnableOTPPhone"
                                  name="modalEnableOTPPhone"
                                  className="form-control phone-number-otp-mask"
                                  placeholder="202 555 0111" />
                              </div>
                            </div>
                            <div className="col-12">
                              <button type="submit" className="btn btn-primary me-3">Submit</button>
                              <button
                                type="reset"
                                className="btn btn-label-secondary"
                                data-bs-dismiss="modal"
                                aria-label="Close">
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
              
                  <div className="card mb-6">
                    <h5 className="card-header">Create an API key</h5>
                    <div className="row">
                      <div className="col-md-5 order-md-0 order-1">
                        <div className="card-body">
                          <form onSubmit={(e)=> e.preventDefault()}>
                            <div className="row">
                              <div className="mb-5 col-12">
                                <label htmlFor="apiAccess" className="form-label"
                                  >Choose the Api key type you want to create</label
                                >
                                <select id="apiAccess" className="select2 form-select">
                                  <option value="">Choose Key Type</option>
                                  <option value="full">Full Control</option>
                                  <option value="modify">Modify</option>
                                  <option value="read-execute">Read & Execute</option>
                                  <option value="folders">List Folder Contents</option>
                                  <option value="read">Read Only</option>
                                  <option value="read-write">Read & Write</option>
                                </select>
                              </div>
                              <div className="mb-5 col-12">
                                <label htmlFor="apiKey" className="form-label">Name the API key</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="apiKey"
                                  name="apiKey"
                                  placeholder="Server Key 1" />
                              </div>
                              <div className="col-12">
                                <button type="submit" className="btn btn-primary me-2 d-grid w-100">Create Key</button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div className="col-md-7 order-md-1 order-0">
                        <div className="text-center mt-4 mx-3 mx-md-0">
                          <img
                            src="../../assets/img/illustrations/girl-with-laptop.png"
                            className="img-fluid"
                            alt="Api Key Image"
                            width="202" />
                        </div>
                      </div>
                    </div>
                  </div>
               
                  <div className="card mb-6">
                    <div className="card-body">
                      <h5>API Key List & Access</h5>
                      <p className="mb-6">
                        An API key is a simple encrypted string that identifies an application without any principal.
                        They are useful for accessing public data anonymously, and are used to associate API requests
                        with your project for quota and billing.
                      </p>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="bg-lighter rounded p-4 mb-6 position-relative">
                            <div className="d-flex align-items-center mb-2">
                              <h5 className="mb-0 me-3">Server Key 1</h5>
                              <span className="badge bg-label-primary">Full Access</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                              <p className="me-3 mb-0 fw-medium">23eaf7f0-f4f7-495e-8b86-fad3261282ac</p>
                              <span className="cursor-pointer"><i className="icon-base ti tabler-copy"></i></span>
                            </div>
                            <span className="text-body-secondary">Created on 28 Apr 2021, 18:20 GTM+4:10</span>
                          </div>
                          <div className="bg-lighter rounded p-4 position-relative mb-6">
                            <div className="d-flex align-items-center mb-2">
                              <h5 className="mb-0 me-3">Server Key 2</h5>
                              <span className="badge bg-label-primary">Read Only</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                              <p className="me-3 mb-0 fw-medium">bb98e571-a2e2-4de8-90a9-2e231b5e99</p>
                              <span className="cursor-pointer"><i className="icon-base ti tabler-copy"></i></span>
                            </div>
                            <span className="text-body-secondary">Created on 12 Feb 2021, 10:30 GTM+2:30</span>
                          </div>
                          <div className="bg-lighter rounded p-4 position-relative">
                            <div className="d-flex align-items-center mb-2">
                              <h5 className="mb-0 me-3">Server Key 3</h5>
                              <span className="badge bg-label-primary">Full Access</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                              <p className="me-3 mb-0 fw-medium">2e915e59-3105-47f2-8838-6e46bf83b711</p>
                              <span className="cursor-pointer"><i className="icon-base ti tabler-copy"></i></span>
                            </div>
                            <span className="text-body-secondary">Created on 28 Dec 2020, 12:21 GTM+4:10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
               
                  <div className="card mb-6">
                    <h5 className="card-header">Recent Devices</h5>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="text-truncate">Browser</th>
                            <th className="text-truncate">Device</th>
                            <th className="text-truncate">Location</th>
                            <th className="text-truncate">Recent Activities</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-truncate text-heading fw-medium">
                              <i className="icon-base ti tabler-brand-windows icon-md align-top text-info me-2"></i>Chrome
                              on Windows
                            </td>
                            <td className="text-truncate">HP Spectre 360</td>
                            <td className="text-truncate">Switzerland</td>
                            <td className="text-truncate">10, July 2021 20:07</td>
                          </tr>
                          <tr>
                            <td className="text-truncate text-heading fw-medium">
                              <i className="icon-base ti tabler-device-mobile icon-md align-top text-danger me-2"></i>Chrome
                              on iPhone
                            </td>
                            <td className="text-truncate">iPhone 12x</td>
                            <td className="text-truncate">Australia</td>
                            <td className="text-truncate">13, July 2021 10:10</td>
                          </tr>
                          <tr>
                            <td className="text-truncate text-heading fw-medium">
                              <i className="icon-base ti tabler-brand-android icon-md align-top text-success me-2"></i
                              >Chrome on Android
                            </td>
                            <td className="text-truncate">Oneplus 9 Pro</td>
                            <td className="text-truncate">Dubai</td>
                            <td className="text-truncate">14, July 2021 15:15</td>
                          </tr>
                          <tr>
                            <td className="text-truncate text-heading fw-medium">
                              <i className="icon-base ti tabler-brand-apple icon-md align-top me-2"></i>Chrome on MacOS
                            </td>
                            <td className="text-truncate">Apple iMac</td>
                            <td className="text-truncate">India</td>
                            <td className="text-truncate">16, July 2021 16:17</td>
                          </tr>
                          <tr>
                            <td className="text-truncate text-heading fw-medium">
                              <i className="icon-base ti tabler-brand-windows icon-md align-top text-warning me-2"></i
                              >Chrome on Windows
                            </td>
                            <td className="text-truncate">HP Spectre 360</td>
                            <td className="text-truncate">Switzerland</td>
                            <td className="text-truncate">20, July 2021 21:01</td>
                          </tr>
                          <tr className="border-transparent">
                            <td className="text-truncate text-heading fw-medium">
                              <i className="icon-base ti tabler-brand-android icon-md align-top text-success me-2"></i
                              >Chrome on Android
                            </td>
                            <td className="text-truncate">Oneplus 9 Pro</td>
                            <td className="text-truncate">Dubai</td>
                            <td className="text-truncate">21, July 2021 12:22</td>
                          </tr>
                        </tbody>
                      </table>
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
