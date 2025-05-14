import React from 'react'
import Footer from '../UI/Footer'
import { Link } from 'react-router-dom'

export default function DashboardContent() {

return (
  <div className="content-wrapper">
  <div className="container-xxl flex-grow-1 container-p-y"> 
    <div className="card mb-6">
        <div className="card-header d-flex align-items-center justify-content-between">
            <div>
              <div className='d-flex align-items-center'>
                <h5 className="mb-0 card-title" style={{fontSize: '18px'}}>Muhammad Asif Ali</h5>
                <span className='ms-1' style={{fontSize: '14px'}}>(CVP-399119)</span>
              </div>
            <span>asifali@gmail.com</span>
            </div>
            <div>
              <span className="badge bg-label-danger">Inactive</span>
              <svg className='ms-2' xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
                  <g clipPath="url(#clip0_62_7990)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16 5.26312V18.4209C16 19.2931 15.2906 20 14.4159 20H2.27156C1.39656 20 0.6875 19.2931 0.6875 18.4209V1.57906C0.6875 0.706875 1.39656 0 2.27156 0H10.7197L16 5.26312Z" fill="#CB0606"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M15.9999 4.96844V5.62344H11.6834C10.7896 5.62344 10.3774 4.89844 10.3774 4.00437V0H11.0312L15.9999 4.96844Z" fill="#FB8D8D"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.4395 10.6397C12.3033 10.5947 12.172 10.5719 12.0454 10.5719C11.9017 10.5719 11.8029 10.6015 11.7489 10.6609C11.6951 10.7203 11.6683 10.8253 11.6683 10.9762V11.2647H12.2723V11.844H11.6683V14.23H10.9364V11.844H10.5592V11.2647H10.9364V10.9762C10.9364 10.6087 11.0276 10.3431 11.2101 10.179C11.3926 10.015 11.667 9.93311 12.0339 9.93311C12.2061 9.93311 12.3886 9.95654 12.5814 10.0037L12.4395 10.6397ZM9.37389 13.9415C9.23764 14.0565 9.09389 14.1481 8.94264 14.2159C8.79139 14.2837 8.61951 14.3175 8.4267 14.3175C8.05232 14.3175 7.76576 14.1828 7.56732 13.9134C7.36857 13.6437 7.26951 13.2631 7.26951 12.7712C7.26951 12.2681 7.37857 11.8772 7.59701 11.5981C7.81545 11.3194 8.12201 11.1797 8.51732 11.1797C8.65732 11.1797 8.80076 11.2084 8.94826 11.2659C9.09576 11.3234 9.21795 11.3965 9.3142 11.485V10.0206H10.0461V14.23H9.37389V13.9415ZM9.3142 12.0872C9.2367 12.0175 9.14076 11.9556 9.02639 11.9019C8.91201 11.8484 8.79514 11.8215 8.67607 11.8215C8.47951 11.8215 8.3217 11.9059 8.20264 12.0744C8.08326 12.2431 8.02389 12.4715 8.02389 12.76C8.02389 13.0447 8.07264 13.2678 8.16982 13.43C8.26732 13.5922 8.41795 13.6731 8.62232 13.6731C8.74326 13.6731 8.8667 13.6453 8.99232 13.5897C9.11795 13.534 9.22545 13.4656 9.3142 13.3847V12.0872ZM6.18607 14.1253C6.00639 14.2534 5.79201 14.3175 5.54232 14.3175C5.21326 14.3175 4.93264 14.215 4.70014 14.0094V15.3465H3.96826V11.2647H4.64326V11.5556C4.77951 11.4387 4.92264 11.3469 5.07295 11.28C5.22326 11.2131 5.39576 11.1797 5.59045 11.1797C5.9667 11.1797 6.25326 11.3115 6.44982 11.5756C6.64639 11.8394 6.74482 12.2228 6.74482 12.7259C6.74482 13.0447 6.6967 13.3253 6.60014 13.5684C6.50357 13.8115 6.36576 13.9972 6.18607 14.1253ZM5.84014 12.0631C5.73982 11.9019 5.59045 11.8215 5.39201 11.8215C5.27295 11.8215 5.15045 11.8494 5.02482 11.9047C4.89889 11.9603 4.79076 12.0287 4.70014 12.1097V13.4072C4.77764 13.4772 4.87357 13.5387 4.98795 13.5925C5.10232 13.6462 5.21982 13.6731 5.34107 13.6731C5.54139 13.6731 5.69982 13.5878 5.81607 13.4172C5.93232 13.2465 5.99045 13.02 5.99045 12.7375C5.99045 12.449 5.94014 12.2244 5.84014 12.0631Z" fill="white"/>
                  </g>
                  <defs>
                      <clipPath id="clip0_62_7990">
                        <rect width="15.3125" height="20" fill="white" transform="translate(0.6875)"/>
                      </clipPath>
                  </defs>
              </svg>
            </div>
        </div>

        <div className="card-body">
            <div className="pb-0" style={{border: '1px solid lightgray', borderRadius: '6px'}}>
              <div>
                <h6 className='px-4 pt-4' style={{fontSize: '16px'}}>Candidate Detail</h6>
                <div className='mx-4'  style={{borderTop: '1px solid lightgray'}}>
                  <div className="info-container mt-4">
                    <ul className="list-unstyled mb-6">
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <span className="h6 me-1 text-black">Contact:</span>
                            <span>+1 (234) 464-0600</span>
                        </li>
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <span className="h6 me-1 text-black">Language:</span>
                            <span>English</span>
                        </li>
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <span className="h6 me-1 text-black">Address:</span>
                            <span>Address Detail</span>
                        </li>
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <span className="h6 me-1 text-black">Github:</span>
                            <span>Github: http://gihub.com/username</span>
                        </li>
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <span className="h6 me-1 text-black">Linkedin:</span>
                            <span>http://linkedin.com/u/username</span>
                        </li>
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <span className="h6 me-1 text-black">Website:</span>
                            <span>Website: http://mywebsite.com</span>
                        </li>
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <span className="h6 me-1 text-black">Country:</span>
                            <span>Pakistan</span>
                        </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                <h6 className='pt-4' style={{fontSize: '16px'}}>Skills</h6>
                  <div className="info-container mt-4">
                    <ul className="list-unstyled mb-6">
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4.1665 10.0002L8.33317 14.1668L16.6665 5.8335" stroke="black" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Skill level: .Net, PHP, NodeJS, Laravel</span>
                        </li>
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <svg className='me-2 mb-1' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="7.5" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3 7.50016H17" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3 12.5002H17" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9.58322 2.5C6.719 7.08981 6.719 12.9102 9.58322 17.5" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10.4165 2.5C13.2807 7.08981 13.2807 12.9102 10.4165 17.5" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Languages: English (Fluent), Urdu (Fluent),  Punjabi, Hindi</span>
                        </li>
                    </ul>
                  </div>
              </div>

              <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                <h6 className='pt-4' style={{fontSize: '16px'}}>Educations</h6>
                  <ul className="timeline" style={{margin: '2rem 0'}}>
                        <li className="timeline-item timeline-item-transparent">
                          <span className="timeline-point timeline-point-primary"></span>
                          <div className="timeline-event">
                            <div className="timeline-header mb-3">
                              <h6 className="mb-0">B.SC IT</h6>
                              <small className="text-body-secondary">2025</small>
                            </div>
                            <p className="mb-2">BZU University</p>
                          </div>
                        </li>
                        <li className="timeline-item timeline-item-transparent">
                          <span className="timeline-point timeline-point-success"></span>
                          <div className="timeline-event">
                            <div className="timeline-header mb-3">
                              <h6 className="mb-0">F.SC</h6>
                              <small className="text-body-secondary">2022</small>
                            </div>
                            <p className="mb-2">BZU University</p>
                          </div>
                        </li>
                        <li className="timeline-item timeline-item-transparent">
                          <span className="timeline-point timeline-point-info"></span>
                          <div className="timeline-event">
                            <div className="timeline-header mb-3">
                              <h6 className="mb-0">Matric</h6>
                              <small className="text-body-secondary">2020</small>
                            </div>
                            <p className="mb-2">Ilama Iqbal Virtual University</p>
                          </div>
                        </li>
                      </ul>
                  </div>

                  <CandidateDetailsTable title="Employment History" firstHeading="Position" secondHeading="Company" 
                    thirdHeading="Duration" fourthHeading="Location" firstValue="Senior Network Engineer"
                    secondValue="Wireless Communication..." thirdValue="12/2016-till date" fourthValue="Jeddah, KSA"/>
                  <CandidateDetailsTable title="References " firstHeading="Name" secondHeading="position" 
                    thirdHeading="address" fourthHeading="phone" firstValue="Prof. Dr. Syed Irfan"
                    secondValue="Professor of Medicine" thirdValue="Rawalpindi Medical College" fourthValue="00923335261122"/>
                  <CandidateDetailsTable title="References " firstHeading="Certificate Name" secondHeading="Issuing organization" 
                    thirdHeading="Issue Date" fourthHeading="Expiration" firstValue="BLS, ACLS"
                    secondValue="Wireless Communication..." thirdValue="12/2016" fourthValue="--"/>

                  <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                    <h6 className='pt-4' style={{fontSize: '16px'}}>Summary in CV</h6>
                    <p className='mb-1'>he material of this course is also covered in my other course about web design and development with HTML5 & CSS3. 
                      Scroll to the bottom of this page to check out that course, too! If you're already taking my other course, you already have all it takes to start designing beautiful websites today!</p><br />
                      <p className='mb-1'>"Best web design course: If you're interested in web design, but want more than just a "how to use WordPress" course, I highly recommend this one." — Florian Giust</p> <br />
                      <p className='mb-5'>"Very helpful to us left-brained people: I am familiar with HTML, CSS, JQuery, and Twitter Bootstrap, but I needed instruction in web design. This course gave me practical, impactful techniques for making websites more beautiful and engaging." — Susan Darlene Cain.</p>
                  </div>

                  <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                    <h6 className='pt-4' style={{fontSize: '16px'}}>Internal Note</h6>
                    <form className="email-compose-form mx-4">
                        <div className="email-compose-message">
                              <div className="d-flex justify-content-end mx-n1">
                                  <div className="email-editor-toolbar border-0 w-100 px-0 ql-toolbar ql-snow">
                                    <span className="ql-formats me-0">
                                        <button className="ql-bold" type="button">
                                          <svg viewBox="0 0 18 18">
                                            <path className="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"></path>
                                            <path className="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"></path>
                                          </svg>
                                        </button>
                                        <button className="ql-italic" type="button">
                                          <svg viewBox="0 0 18 18">
                                            <line className="ql-stroke" x1="7" x2="13" y1="4" y2="4"></line>
                                            <line className="ql-stroke" x1="5" x2="11" y1="14" y2="14"></line>
                                            <line className="ql-stroke" x1="8" x2="10" y1="14" y2="4"></line>
                                          </svg>
                                        </button>
                                        <button className="ql-underline" type="button">
                                          <svg viewBox="0 0 18 18">
                                            <path className="ql-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"></path>
                                            <rect className="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3" y="15"></rect>
                                          </svg>
                                        </button>
                                        <button className="ql-list" value="ordered" type="button">
                                          <svg viewBox="0 0 18 18">
                                            <line className="ql-stroke" x1="7" x2="15" y1="4" y2="4"></line>
                                            <line className="ql-stroke" x1="7" x2="15" y1="9" y2="9"></line>
                                            <line className="ql-stroke" x1="7" x2="15" y1="14" y2="14"></line>
                                            <line className="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"></line>
                                            <path className="ql-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"></path>
                                            <path className="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"></path>
                                            <path className="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"></path>
                                          </svg>
                                        </button>
                                        <button className="ql-list" value="bullet" type="button">
                                          <svg viewBox="0 0 18 18">
                                            <line className="ql-stroke" x1="6" x2="15" y1="4" y2="4"></line>
                                            <line className="ql-stroke" x1="6" x2="15" y1="9" y2="9"></line>
                                            <line className="ql-stroke" x1="6" x2="15" y1="14" y2="14"></line>
                                            <line className="ql-stroke" x1="3" x2="3" y1="4" y2="4"></line>
                                            <line className="ql-stroke" x1="3" x2="3" y1="9" y2="9"></line>
                                            <line className="ql-stroke" x1="3" x2="3" y1="14" y2="14"></line>
                                          </svg>
                                        </button>
                                        <button className="ql-link" type="button">
                                          <svg viewBox="0 0 18 18">
                                            <line className="ql-stroke" x1="7" x2="11" y1="7" y2="11"></line>
                                            <path className="ql-even ql-stroke" d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"></path>
                                            <path className="ql-even ql-stroke" d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"></path>
                                          </svg>
                                        </button>
                                        <button className="ql-image" type="button">
                                          <svg viewBox="0 0 18 18">
                                            <rect className="ql-stroke" height="10" width="12" x="3" y="4"></rect>
                                            <circle className="ql-fill" cx="6" cy="7" r="1"></circle>
                                            <polyline className="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
                                          </svg>
                                        </button>
                                    </span>
                                  </div>
                              </div>
                              <div className="email-editor border-0 mx-n5 ql-container ql-snow">
                                <div className="ql-editor ql-blank" contentEditable="true" data-placeholder="Write your message...">
                                  <p><br /></p>
                                </div>
                              </div>
                          </div>
                            <div className="d-flex align-items-center justify-content-end my-4">
                                  <button type="button" className="btn btn-primary email-send-btn waves-effect waves-light">Save Note
                                    <i className="icon-base ti tabler-send icon-xs scaleX-n1-rtl ms-2"></i>
                                  </button>
                          </div>
                    </form>
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

function CandidateDetailsTable({title, firstHeading, secondHeading, thirdHeading, fourthHeading, 
    firstValue, secondValue, thirdValue, fourthValue}){
  return (
    <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
    <h6 className='pt-4' style={{fontSize: '16px'}}>{title}</h6>
    <div className="card mb-4">
        <div className="card-datatable table-responsive">
            <div id="DataTables_Table_1_wrapper" className="dt-container dt-bootstrap5 dt-empty-footer">
                  <div className="justify-content-between dt-layout-table">
                      <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                        <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                          aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                              <colgroup>
                                  <col data-dt-column="0" style={{width: '25%'}} />
                                  <col data-dt-column="1" style={{width: '25%'}} />
                                  <col data-dt-column="2" style={{width: '25%'}} />
                                  <col data-dt-column="3" style={{width: '25%'}} />
                              </colgroup>
                              <thead className="border-top">
                                <tr>
                                  <th data-dt-column="0" rowSpan="1" colSpan="1" className="dt-select dt-orderable-none">
                                    <span className="dt-column-title text-uppercase">{firstHeading}</span>
                                    <span className="dt-column-order"></span>
                                  </th>
                                  <th data-dt-column="1" rowSpan="1" colSpan="1" className="dt-orderable-asc dt-orderable-desc dt-ordering-desc" aria-sort="descending"  tabIndex="0">
                                    <span className="dt-column-title text-uppercase" role="button">{secondHeading}</span>
                                    <span className="dt-column-order"></span>
                                  </th>
                                  <th data-dt-column="2" rowSpan="1" colSpan="1" className="dt-orderable-asc dt-orderable-desc" tabIndex="0">
                                    <span className="dt-column-title text-uppercase" role="button">{thirdHeading}</span>
                                    <span className="dt-column-order"></span>
                                  </th>
                                  <th data-dt-column="3" rowSpan="1" colSpan="1" className="dt-orderable-asc dt-orderable-desc" tabIndex="0">
                                    <span className="dt-column-title text-uppercase" role="button">{fourthHeading}</span>
                                    <span className="dt-column-order"></span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className='text-black'>{firstValue}</td>
                                  <td>{secondValue}</td>
                                  <td>{thirdValue}</td>
                                  <td>{fourthValue}</td>
                                </tr>
                                <tr>
                                  <td className='text-black'>{firstValue}</td>
                                  <td>{secondValue}</td>
                                  <td>{thirdValue}</td>
                                  <td>{fourthValue}</td>
                                </tr>
                                <tr>
                                  <td className='text-black'>{firstValue}</td>
                                  <td>{secondValue}</td>
                                  <td>{thirdValue}</td>
                                  <td>{fourthValue}</td>
                                </tr>
                                <tr>
                                  <td className='text-black'>{firstValue}</td>
                                  <td>{secondValue}</td>
                                  <td>{thirdValue}</td>
                                  <td>{fourthValue}</td>
                                </tr>
                            </tbody>
                        </table>
                      </div>
                  </div>
            </div>
        </div>
    </div>
  </div>
  )
}