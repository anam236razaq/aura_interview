import { Link } from 'react-router-dom';
import Footer from '../UI/Footer';

export default function Profile() {

  
  return (
            <div className="content-wrapper">
                <div className="container-xxl flex-grow-1 container-p-y">                         
                    <div class="row">
                        <div class="col-12">
                            <div class="card mb-6">
                                <div class="user-profile-header-banner">
                                    <img src="../../assets/img/pages/profile-banner.png" alt="Banner image" class="rounded-top" style={{width: '100%'}} />
                                </div>
                                <div class="user-profile-header d-flex flex-column flex-lg-row text-sm-start text-center mb-5">
                                    <div class="flex-shrink-0 mt-n8 mx-sm-0 mx-auto">
                                        <img src="../../assets/img/avatars/1.png" alt="user image" class="d-block h-auto ms-0 ms-sm-6 rounded user-profile-img" style={{border: '5px solid #ffffff'}} />
                                    </div>
                                    <div class="flex-grow-1 mt-3 mt-lg-5">
                                        <div class="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-5 flex-md-row flex-column gap-4">
                                            <div class="user-profile-info">
                                                <h4 class="mb-2">John Doe</h4>
                                                <ul class="list-inline mb-0 d-flex align-items-center flex-wrap justify-content-sm-start justify-content-center gap-4 my-2">
                                                    <li class="list-inline-item d-flex gap-2 align-items-center">
                                                        <i class="icon-base ti tabler-palette icon-lg"></i>
                                                        <span class="fw-medium">Manager</span>
                                                    </li>
                                                    <li class="list-inline-item d-flex gap-2 align-items-center">
                                                        <i class="icon-base ti tabler-calendar  icon-lg"></i>
                                                        <span class="fw-medium"> Joined April 2021</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <Link to="#" class="btn btn-primary mb-1 waves-effect waves-light">
                                                <i class="icon-base ti tabler-user-check icon-xs me-2"></i>Active</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
 
                    <div class="row">
                        <div class="col-12 ">
                            <div class="card">
                                <div class="card-body">
                                    <p class="card-text text-uppercase text-body-secondary small mb-0">About</p>
                                    <ul class="list-unstyled my-3 py-1">
                                        <li class="d-flex align-items-center mb-4">
                                            <i class="icon-base ti tabler-user icon-lg"></i>
                                            <span class="fw-medium mx-2">Full Name:</span> <span>John Doe</span>
                                        </li>
                                        <li class="d-flex align-items-center mb-4">
                                            <i class="icon-base ti tabler-check icon-lg"></i>
                                            <span class="fw-medium mx-2">Status:</span> <span>Active</span>
                                        </li>
                                        <li class="d-flex align-items-center mb-4">
                                            <i class="icon-base ti tabler-crown icon-lg"></i>
                                            <span class="fw-medium mx-2">Role:</span> <span>Manager</span>
                                        </li>
                                        <li class="d-flex align-items-center mb-4">
                                            <i class="icon-base ti tabler-flag icon-lg"></i>
                                            <span class="fw-medium mx-2">Company:</span> <span>keydevs Technologies</span>
                                        </li>
                                    </ul>
                                    <p class="card-text text-uppercase text-body-secondary small mb-0">Contacts</p>
                                    <ul class="list-unstyled my-3">
                                        <li class="d-flex align-items-center">
                                            <i class="icon-base ti tabler-mail icon-lg"></i>
                                            <span class="fw-medium mx-2">Email:</span>
                                            <span>john.doe@example.com</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
                <div className="content-backdrop fade"></div>
            </div>
  )
}
