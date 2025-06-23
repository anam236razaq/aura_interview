import { Link } from 'react-router-dom';
import Footer from '../UI/Footer';
import { useProfileData } from '../Contexts/ProfileContext';

export default function Profile() {
    const {profileData} = useProfileData();
    console.log(profileData);

    return (
            <div className="content-wrapper">
                <div className="container-xxl flex-grow-1 container-p-y">                         
                    <div className="row">
                        <div className="col-12">
                            <div className="card mb-6">
                                <div className="user-profile-header-banner">
                                    <img src="../../assets/img/pages/profile-banner.png" alt="Banner image" className="rounded-top" style={{width: '100%'}} />
                                </div>
                                <div className="user-profile-header d-flex flex-column flex-lg-row text-sm-start text-center mb-5">
                                    <div className="flex-shrink-0 mt-n12 mx-sm-0 mx-auto" >
                                        <img src={profileData?.profile_image} alt="user image" className="d-block h-auto ms-0 ms-sm-6 rounded user-profile-img" style={{border: '5px solid #ffffff'}} />
                                    </div>
                                    <div className="flex-grow-1 mt-3 mt-lg-5">
                                        <div className="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-5 flex-md-row flex-column gap-4">
                                            <div className="user-profile-info">
                                                <h4 className="mb-2 text-capitalize">{profileData?.first_name} {profileData?.last_name}</h4>
                                                <ul className="list-inline mb-0 d-flex align-items-center flex-wrap justify-content-sm-start justify-content-center gap-4 my-2">
                                                    <li className="list-inline-item d-flex gap-2 align-items-center">
                                                        <i className="icon-base ti tabler-palette icon-lg"></i>
                                                        <span className="fw-medium text-capitalize">{profileData?.role_name}</span>
                                                    </li>
                                                    <li className="list-inline-item d-flex gap-2 align-items-center">
                                                        <i className="icon-base ti tabler-calendar  icon-lg"></i>
                                                        <span className="fw-medium"> Joined {profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString() : 'N/A'}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <Link to="#" className="btn btn-primary mb-1 waves-effect waves-light">
                                                <i className="icon-base ti tabler-user-check icon-xs me-2 text-capitalize"></i><span className='text-capitalize'>{profileData?.status}</span></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
 
                    <div className="row">
                        <div className="col-12 ">
                            <div className="card">
                                <div className="card-body">
                                    <p className="card-text text-uppercase text-body-secondary small mb-0">About</p>
                                    <ul className="list-unstyled my-3 py-1">
                                        <li className="d-flex align-items-center mb-4">
                                            <i className="icon-base ti tabler-user icon-lg"></i>
                                            <span className="fw-medium mx-2">Full Name:</span> <span className='text-capitalize'>{profileData?.first_name} {profileData?.last_name}</span>
                                        </li>
                                        <li className="d-flex align-items-center mb-4">
                                            <i className="icon-base ti tabler-check icon-lg"></i>
                                            <span className="fw-medium mx-2">Status:</span> <span className='text-capitalize'>{profileData?.status}</span>
                                        </li>
                                        <li className="d-flex align-items-center mb-4">
                                            <i className="icon-base ti tabler-crown icon-lg"></i>
                                            <span className="fw-medium mx-2">Role:</span> <span className='text-capitalize'>{profileData?.role_name}</span>
                                        </li>
                                        <li className="d-flex align-items-center mb-4">
                                            <i className="icon-base ti tabler-flag icon-lg"></i>
                                            <span className="fw-medium mx-2">Company:</span> <span className='text-capitalize'>{profileData?.organization_name}</span>
                                        </li>
                                    </ul>
                                    <p className="card-text text-uppercase text-body-secondary small mb-0">Contacts</p>
                                    <ul className="list-unstyled my-3">
                                        <li className="d-flex align-items-center">
                                            <i className="icon-base ti tabler-mail icon-lg"></i>
                                            <span className="fw-medium mx-2">Email:</span>
                                            <span>{profileData?.email}</span>
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
