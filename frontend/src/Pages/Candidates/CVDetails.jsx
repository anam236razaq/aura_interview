import React, {useState } from 'react'
import Footer from '../../UI/Footer'
import CVPdfModal from '../../UI/CVPdfModal';
import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Constants';
import { useParams } from 'react-router-dom';
import NotesEditor from '../../UI/NotesEditor';

export default function CVDetails() {
  const[showModal, setShowModal] = useState(false);
  const[cvDetails, setCvDetails] = useState([]);
  const {id} = useParams();

  useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get('from');
  if (from) {
    localStorage.setItem('candidateFrom', from);
  }
}, []);

  //Getting details for specific CV
  useEffect(()=> {
    const handleCVDetails = async () => {
        try{
          const token = localStorage.getItem('authToken');
          const response = await axios.get(API_BASE_URL+ `/cv/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": 'application/json'
            }
          })
          setCvDetails(response?.data);
          console.log(response);
        }catch(error){
          console.log(error);
        }
    }
    handleCVDetails();
  }, [id]);

  //adding Internal note to cv
  const addNoteToCv = (newNote) => {
    setCvDetails(prev => ({...prev, internal_notes: [newNote, ...prev.internal_notes]}))
  }

  return (
 <div className="content-wrapper">
  <div className="container-xxl flex-grow-1 container-p-y"> 
    {(Array.isArray(cvDetails) ? cvDetails : [cvDetails]).map((cv) => {
        const personalInfo = JSON.parse(cv.personal_info);
        const foreignLangugaes = JSON.parse(cv.extra_info.foreign_languages);

    return ( 
      <div className="card mb-6" key={cv.id}>
        <div className="card-header d-flex align-items-center justify-content-between">
            <div>
              <div className='d-flex align-items-center'>
                <h5 className="mb-0 card-title" style={{fontSize: '18px'}}>{personalInfo.name}</h5>
                <span className='ms-1' style={{fontSize: '14px'}}>{`(CVP-${cv.id})`}</span>
              </div>
            <span>{personalInfo.email}</span>
            </div>
            <div>
              <span className="badge bg-label-danger">Inactive</span>
              <svg onClick={()=> setShowModal(true)} className='ms-2' xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
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
              {showModal && <CVPdfModal setShowModal={setShowModal}/>}
            </div>
        </div>

        {/* Personal details */}
        <div className="card-body">
            <div className="pb-0" style={{border: '1px solid lightgray', borderRadius: '6px'}}>
              <div>
                <h6 className='px-4 pt-4' style={{fontSize: '16px'}}>Candidate Detail</h6>
                <div className='mx-4'  style={{borderTop: '1px solid lightgray'}}>
                  <div className="info-container mt-4">
                    <ul className="list-unstyled mb-6">
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <span className="h6 me-1 text-black">Contact:</span>
                            <span>{`+${personalInfo.phone_country_code}`} {personalInfo.phone}</span>
                        </li>
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <span className="h6 me-1 text-black">Address:</span>
                            <span>{personalInfo.address || 'N/A'}</span>
                        </li>
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <span className="h6 me-1 text-black">Github:</span>
                            <span>{personalInfo.github || 'N/A'}</span>
                        </li>
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <span className="h6 me-1 text-black">Linkedin:</span>
                            <span>{personalInfo.linkedin || 'N/A'}</span>
                        </li>
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <span className="h6 me-1 text-black">Website:</span>
                            <span>{personalInfo.website || 'N/A'}</span>
                        </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Skills and Languages*/} 
              <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                <h6 className='pt-4' style={{fontSize: '16px'}}>Skills</h6>
                  <div className="info-container mt-4">
                    <ul className="list-unstyled mb-6">
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4.1665 10.0002L8.33317 14.1668L16.6665 5.8335" stroke="black" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Skill level: </span> 
                              {cv.skills.map((skill, index) => (
                                <span key={skill.id}>
                                  {skill.skill}{skill.level ? `(${skill.level})` : ''}
                                  {index !== cv.skills.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                        </li>
                        <li className="mb-3" style={{fontSize: '15px'}}>
                            <svg className='me-2 mb-1' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="7.5" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3 7.50016H17" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3 12.5002H17" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9.58322 2.5C6.719 7.08981 6.719 12.9102 9.58322 17.5" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10.4165 2.5C13.2807 7.08981 13.2807 12.9102 10.4165 17.5" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Languages: </span>
                              {foreignLangugaes.length - 1> 0 ? (
                                foreignLangugaes.map((language, index) => (
                                  <span key={index}>{`${language.language} (${language.level})`}{index !== foreignLangugaes.length - 1 ? ', ' : ''}</span>
                              ))) : <span>N/A</span>}
                        </li>
                    </ul>
                  </div>
              </div>

              {/* Educations */}
              <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                <h6 className='pt-4' style={{fontSize: '16px'}}>Educations</h6>
                  <ul className="timeline" style={{margin: '2rem 0'}}>
                      {cv.education.map((education) => (
                        <li className="timeline-item timeline-item-transparent" key={education.id}>
                            <span className='timeline-point timeline-point-primary'></span>
                            <div className="timeline-event">
                              <div className="timeline-header mb-3">
                                <h6 className="mb-0">{education.qualification} {education.major}</h6>
                                <small className="text-body-secondary">
                                  {education.start_year? education.start_year : ''} 
                                  {education.start_year && education.end_year ? '-' : ''} 
                                  {education.end_year? education.end_year : ''}
                                </small>
                              </div>
                              <div className='d-flex align-items-center justify-content-between'>
                                <p className="mb-0">{education.institution}</p>
                                <small className="text-body-secondary">{education.gpa? education.gpa : ''}</small>
                              </div>
                            </div>
                          </li>
                          )
                      )}
                  </ul>
              </div>

              {/*Employment History */}
              {cv.employment_history && cv.employment_history.length > 0 ? (
                <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                  <h6 className='pt-4' style={{fontSize: '16px'}}>Employment History</h6>
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
                                                    {[{columnName: 'position', dtColumn: '0'}, {columnName: 'company', dtColumn: '1'},
                                                        {columnName: 'duration', dtColumn: '2'}, {columnName: 'location', dtColumn: '3'}].map((column, index) => (
                                                            <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                                                <span className="dt-column-title text-uppercase">{column.columnName}</span>
                                                            </th>
                                                    ))}
                                  
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {cv.employment_history.map((item) => (
                                                  <tr key={item.id}>
                                                    <td className='text-black'>{item.position}</td>
                                                    <td>{item.company}</td>
                                                    <td>{item.duration? item.duration : 'N/A'}</td>
                                                    <td>{item.location? item.location : 'N/A'}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                        </table>
                                      </div>
                                </div>
                            </div>
                      </div>
                  </div>
                </div> ) : null}

                {/* References */}
                {cv.references && cv.references.length > 0 ? (
                <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                  <h6 className='pt-4' style={{fontSize: '16px'}}>References</h6>
                  <div className="card mb-4">
                      <div className="card-datatable table-responsive">
                          <div id="DataTables_Table_1_wrapper" className="dt-container dt-bootstrap5 dt-empty-footer">
                              <div className="justify-content-between dt-layout-table">
                                  <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                                      <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                                          aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                                              <colgroup>
                                                  <col data-dt-column="0" style={{width: '33%'}} />
                                                  <col data-dt-column="1" style={{width: '33%'}} />
                                                  <col data-dt-column="2" style={{width: '33%'}} />
                                              </colgroup>
                                              <thead className="border-top">
                                                <tr>
                                                    {[{columnName: 'name', dtColumn: '0'}, {columnName: 'position', dtColumn: '1'},
                                                        {columnName: 'phone', dtColumn: '2'}].map((column, index) => (
                                                            <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                                                <span className="dt-column-title text-uppercase">{column.columnName}</span>
                                                            </th>
                                                    ))}
                                  
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {cv.references.map((item) => (
                                                  <tr key={item.id}>
                                                    <td className='text-black'>{item.name}</td>
                                                    <td>{item.position}</td>
                                                    <td>{item.contact_info}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                        </table>
                                      </div>
                                </div>
                            </div>
                      </div>
                  </div>
                </div> ) : null}

                {/* Certifications */}
                {cv.certifications && cv.certifications.length > 0 ? (
                <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                  <h6 className='pt-4' style={{fontSize: '16px'}}>Certifications</h6>
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
                                                    {[{columnName: 'certificate name', dtColumn: '0'}, {columnName: 'issuing organization', dtColumn: '1'},
                                                        {columnName: 'issue date', dtColumn: '2'},  {columnName: 'expiration', dtColumn: '3'}].map((column, index) => (
                                                            <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                                                <span className="dt-column-title text-uppercase">{column.columnName}</span>
                                                            </th>
                                                    ))}
                                  
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {cv.certifications.map((item) => (
                                                  <tr key={item.id}>
                                                    <td className='text-black'>{item.certification_name}</td>
                                                    <td>{item.issuing_organization? item.issuing_organization : 'N/A'}</td>
                                                    <td>{item.issue_date? new Date(item.issue_date).toISOString().split('T')[0] : 'N/A'}</td>
                                                    <td>{item.expiration_date? item.expiration_date : '--'}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                        </table>
                                      </div>
                                </div>
                            </div>
                      </div>
                  </div>
                </div> ) : null}

                {/* Achievements */}
                {cv.achievements && cv.achievements.length > 0 ? (
                <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                  <h6 className='pt-4' style={{fontSize: '16px'}}>Achievements</h6>
                  <div className="card mb-4">
                      <div className="card-datatable table-responsive">
                          <div id="DataTables_Table_1_wrapper" className="dt-container dt-bootstrap5 dt-empty-footer">
                              <div className="justify-content-between dt-layout-table">
                                  <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                                      <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                                          aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                                              <colgroup>
                                                  <col data-dt-column="0" style={{width: '50%'}} />
                                                  <col data-dt-column="1" style={{width: '50%'}} />
                                              </colgroup>
                                              <thead className="border-top">
                                                <tr>
                                                    {[{columnName: 'achievement', dtColumn: '0'}, {columnName: 'achievement date', dtColumn: '1'},
                                                        ].map((column, index) => (
                                                            <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                                                <span className="dt-column-title text-uppercase">{column.columnName}</span>
                                                            </th>
                                                    ))}
                                  
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {cv.achievements.map((item) => (
                                                  <tr key={item.id}>
                                                    <td className='text-black'>{item.achievement}</td>
                                                    <td>{item.achievement_date? new Date(item.achievement_date).toISOString().split("T")[0] : 'N/A'}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                        </table>
                                      </div>
                                </div>
                            </div>
                      </div>
                  </div>
                </div> ) : null}

                 {/* Projects */}
                {cv.projects && cv.projects.length > 0 ? (
                <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                  <h6 className='pt-4' style={{fontSize: '16px'}}>Projects</h6>
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
                                                    {[{columnName: 'name', dtColumn: '0'}, {columnName: 'year', dtColumn: '1'},
                                                        {columnName: 'technologies', dtColumn: '2'},  {columnName: 'url', dtColumn: '3'}].map((column, index) => (
                                                            <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                                                <span className="dt-column-title text-uppercase">{column.columnName}</span>
                                                            </th>
                                                    ))}
                                  
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {cv.projects.map((item) => (
                                                  <tr key={item.id}>
                                                    <td className='text-black'>{item.name}</td>
                                                    <td>{item.year? item.year : 'N/A'}</td>
                                                    <td>{item.technologies && item.technologies !== '[]'? JSON.parse(item.technologies).join(', ') : 'N/A'}</td>
                                                    <td>{item.url? item.url : 'N/A'}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                        </table>
                                      </div>
                                </div>
                            </div>
                      </div>
                  </div>
                </div> ) : null}

                {/* Publications */}
                {cv.publications && cv.publications > 0 ? (
                <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                  <h6 className='pt-4' style={{fontSize: '16px'}}>Publications</h6>
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
                                                    {[{columnName: 'title', dtColumn: '0'}, {columnName: 'journal', dtColumn: '1'},
                                                        {columnName: 'publication date', dtColumn: '2'},  {columnName: 'url', dtColumn: '3'}].map((column, index) => (
                                                            <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                                                <span className="dt-column-title text-uppercase">{column.columnName}</span>
                                                            </th>
                                                    ))}
                                  
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {cv.publications.map((item) => (
                                                  <tr key={item.id}>
                                                    <td className='text-black'>{item.title? item.title.slice(0, 3).join(' ') + (item.title.split(' ').length > 3? '...' : '') : 'N/A'}</td>
                                                    <td>{item.journal? item.journal.slice(0, 3).join(' ') + (item.journal.split(' ').length > 3? '...' : '') : 'N/A' }</td>
                                                    <td>{item.publication_date? item.publication_date : 'N/A'}</td>
                                                    <td>{item.url? item.url : 'N/A'}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                        </table>
                                      </div>
                                </div>
                            </div>
                      </div>
                  </div>
                </div> ) : null}

                {/* Volunteers */}
                {cv.volunteering && cv.volunteering > 0 ? (
                <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                  <h6 className='pt-4' style={{fontSize: '16px'}}>Volunteers</h6>
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
                                                    {[{columnName: 'activity', dtColumn: '0'}, {columnName: 'organization', dtColumn: '1'},
                                                        {columnName: 'date', dtColumn: '2'},  {columnName: 'location', dtColumn: '3'}].map((column, index) => (
                                                            <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                                                <span className="dt-column-title text-uppercase">{column.columnName}</span>
                                                            </th>
                                                    ))}
                                  
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {cv.publications.map((item) => (
                                                  <tr key={item.id}>
                                                    <td className='text-black'>{item.activity}</td>
                                                    <td>{item.organization? item.organization : 'N/A'}</td>
                                                    <td>{item.date? item.date : 'N/A'}</td>
                                                    <td>{item.location? item.location : 'N/A'}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                        </table>
                                      </div>
                                </div>
                            </div>
                      </div>
                  </div>
                </div> ) : null}

                  {/*Summary */}
                  {personalInfo.summary && (<div className='mx-4 mb-4' style={{borderTop: '1px solid lightgray'}}>
                    <h6 className='pt-4 mb-2' style={{fontSize: '16px'}}>Summary in CV</h6>
                    <p className='mb-1'>{personalInfo.summary || 'N/A'}</p>
                  </div>
                  )}

                  {/* Internal Notes */}
                  <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                  <h6 className='pt-4' style={{fontSize: '16px'}}>Internal Notes</h6>
                  <div className="card mb-4">
                      <div className="card-datatable table-responsive">
                          <div id="DataTables_Table_1_wrapper" className="dt-container dt-bootstrap5 dt-empty-footer">
                              <div className="justify-content-between dt-layout-table">
                                  <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                                      <table className="datatables-users table dataTable dtr-column collapsed" id="DataTables_Table_0"
                                          aria-describedby="DataTables_Table_0_info" style={{width: '100%'}}>
                                              <colgroup>
                                                  <col data-dt-column="0" style={{width: '50%'}} />
                                                  <col data-dt-column="1" style={{width: '50%'}} />
                                              </colgroup>
                                              <thead className="border-top">
                                                <tr>
                                                    {[{columnName: 'note', dtColumn: '0'}, {columnName: 'user', dtColumn: '1'},
                                                        ].map((column, index) => (
                                                            <th data-dt-column={column.dtColumn} rowSpan="1" colSpan="1" key={index}>
                                                                <span className="dt-column-title text-uppercase">{column.columnName}</span>
                                                            </th>
                                                    ))}
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {cv.internal_notes.map((item) => (
                                                  <tr key={item.id}>
                                                    <td className='text-black'><div dangerouslySetInnerHTML={{__html: item.note}}/></td>
                                                    <td>{item.user_email} ({item.user_first_name} {item.user_last_name})</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                        </table>
                                      </div>
                                </div>
                            </div>
                      </div>
                  </div>
                </div> 

                  {/* Add Internal Note */}
                  <div className='mx-4' style={{borderTop: '1px solid lightgray'}}>
                    <h6 className='pt-4' style={{fontSize: '16px'}}>Add Internal Note</h6>
                        <NotesEditor id={id} onNoteAdded = {addNoteToCv}/>
                  </div>
              </div>
          </div>
      </div>
    )})}
  </div>
  <Footer />
  <div className="content-backdrop fade"></div>
  </div>
  )
}