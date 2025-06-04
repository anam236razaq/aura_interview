import React, { useEffect, useState } from 'react'
import Footer from '../../UI/Footer'
import { Controller, useForm } from 'react-hook-form';
import ShowPasswordIcon from '../../UI/ShowPasswordIcon';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Constants';
import Step from '../../UI/Step';
import InputField from '../../UI/InputField';
import InterviewVideo from '../../UI/InterviewVideo';
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';

export default function InterviewSetup() {
    const{register, handleSubmit, formState: {errors}, trigger, clearErrors, reset, setValue, control} = useForm({mode: 'onChange'});
    const[showPassword, setShowPassword] = useState('');
    const[selectedInterviewer, setSelectedInterviewer] = useState("");
    const[selectedPosition, setSelectedPosition] = useState("");
    const[assignedReviewer, setAssignedReviewer] = useState([]);
    const[selectedSkill, setSelectedSkill] = useState([]);
    const[selectedCompany, setSelectedCompany]= useState("");
    const[introVideoPath, setIntroVideoPath] = useState('');
    const[outroVideoPath, setOutroVideoPath] = useState('');
    const[users, setUsers] = useState([]);
    const[companies, setCompanies] = useState([]);
    const[jobs,setJobs] = useState([]);
    const[questions, setQuestions] = useState([]);
    const[skills, setSkills] = useState([]);
    const[step, setStep] = useState(1);

    const nextStep = () => {
        setStep((prev) => prev + 1);
    }

    const prevStep = () => {
        setStep((prev)=> prev - 1);
    }

    const stepFields= {
        1: ["firstName", "lastName", "email", "password", "companyInfo"],
        2: ["positionName", "location", "salaryRange", "application", "positionDescription"],
        3: ["title", "description"],
        4: ["skills"],
        5: []
    }

    useEffect(()=> {
        //Fetching users data, Jobs data, Companies data
        const fetchUsers = async () => {
            try{
                const token = localStorage.getItem('authToken');
                const response = await axios.get(API_BASE_URL+'/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": 'application/json'
                    }
                })
                setUsers(response.data.users);
            }catch(error){
                console.log(error);
            }
        }

        //Fetching Jobs data
        const fetchJobs = async () => {
            try{
                const token = localStorage.getItem('authToken');
                const response = await axios.get(API_BASE_URL+'/jobs', {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                setJobs(response.data);
            }catch(error){
                console.log(error);
            }
        }
        
        const fetchCompanies = async () => {
        try{
          const token = localStorage.getItem('authToken');
          const response = await axios.get(API_BASE_URL+'/companies', {
            headers: {
              "Content-Type": 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
          setCompanies(response?.data.companies);

        }catch(error){
          console.log(error);
        }
        }
        fetchCompanies();
        fetchUsers();
        fetchJobs();
    }, [])

    //Fetch Skills data and search skills
    useEffect(()=> {
        const skillQuery = selectedSkill.length > 0? selectedSkill.join(',') : "";

        const fetchSkills = async () => {
        try{
          const token = localStorage.getItem('authToken');
          const response = await axios.get(API_BASE_URL+ '/skills', {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": 'application/json'
            },
            params: {
                skills: skillQuery

            }
          })
          setSkills(response?.data);
        }catch(error){
          console.log(error);
        }
    }

    fetchSkills();

    }, [selectedSkill]);

    const addQuestions = () => {
        setQuestions([...questions, {text: '', type: 'video', time_limit: 60}])
    }


    const toggleReviewer = (userId) => {
        if(assignedReviewer.includes(userId)){
            setAssignedReviewer(assignedReviewer.filter(id => id !== userId));
        }else{
            setAssignedReviewer([...assignedReviewer, userId]);
        }
    }


    // creating interview
    const onSubmit = async (data) => {

        const payload ={
            status: 'active',
            userId: selectedInterviewer,
            newUser: !selectedInterviewer ? {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                password: data.password,
                role_id:4
            } : undefined,
            jobId: selectedPosition,
            newJob: !selectedPosition ? {
                title: data.positionName,
                description: data.positionDescription,
                salary_range: data.salaryRange,
                location: data.location,
                application_deadline: data.application
            } : undefined,
            skillId: selectedSkill,
            title: data.title,
            description: data.description,
            companyId: selectedCompany,
            reviewers: assignedReviewer,
            expiry_date: data.expiryDate,
            questions,
            introVideo: introVideoPath,
            outroVideo: outroVideoPath,
            candidateIds: skills.matchedCandidates
        }
        try{
            const token = localStorage.getItem('authToken');
            await axios.post(API_BASE_URL+'/interviews', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": 'application/json'
                }
            })
        }catch(error){
            console.log(error);
        }
    }

  return (
    <>
    <Toaster reverseOrder={false} position='top-center' />
    <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
            <div id="wizard-property-listing" className="bs-stepper vertical mt-2 linear">
                    
                    <div className="bs-stepper-header border-end">
                        <Step step={step} stepNumber={1} icon="tabler-users" title="Interviewer Details" subtitle="Your Name/Email"/>
                        <div className="line"></div>
                        <Step step={step} stepNumber={2} icon="tabler-briefcase" title="Position setup" subtitle="Setup Position Information"/>
                        <div className="line"></div>
                        <Step step={step} stepNumber={3} icon="tabler-home" title="Configure Interview" subtitle="Start configuring interview"/>
                        <div className="line"></div>
                        <Step step={step} stepNumber={4} icon="tabler-users" title="Select Candidates" subtitle="Select eligible candidates"/>
                        <div className="line"></div>
                        <Step step={step} stepNumber={5} icon="tabler-message-question" title="Questions" subtitle="Your questions"/>
                        <div className="line"></div>
                        <Step step={step} stepNumber={6} icon="tabler-bookmarks" title="Publish" subtitle="Publish Interview"/>
                    </div>

                    <div className="bs-stepper-content">
                        <form id="wizard-property-listing-form" onSubmit={handleSubmit(onSubmit)}>
                            {step === 1 && <div className='content dstepper-block fv-plugins-bootstrap5 fv-plugins-framework active'>
                                <div className="row g-6">
                                    <div className="col-12">
                                        <div className="row g-6">
                                            <div className="col-md mb-md-0">
                                                <label className="form-label me-2 mb-1">Select Interviewer</label>
                                                <select className="form-select" autoFocus
                                                    value={selectedInterviewer} onChange={(e)=> {
                                                        const selected = e.target.value; 
                                                        setSelectedInterviewer(selected); 
                                                        if(selected){
                                                            clearErrors(['firstName', 'lastName', 'password', 'email']);
                                                            reset({firstName: '', lastName: '',  password: '', email: ''});
                                                            trigger('companyInfo');
                                                        }
                                                        }}>
                                                    <option value="">Select</option>
                                                    {users.map((user)=> (
                                                        <option key={user.id} value={user.id}>
                                                            {user.first_name} {user.last_name} ({user.email})
                                                        </option>
                                                    ))}
                                                </select>
                                                <span style={{fontSize: '12px'}}>Select Interviewer or create one below</span>
                                            </div>
                                        </div>
                                    </div>

                                    <InputField id="firstName" name="firstName" label="First Name" type="text" placeholder="John"
                                        register={register} validation={{ required: "First name is required" }} error={errors.firstName} disabled={!!selectedInterviewer} />
                                    <InputField id="lastName" name="lastName" label="Last Name" type="text" placeholder="Doe"
                                        register={register} validation={{ required: "Last name is required" }} error={errors.lastName} disabled={!!selectedInterviewer} />
                                    <InputField id="email" name="email" label="Email" type="text" placeholder="john.doe@example.com"
                                        register={register} validation={{ required: "Email is required" }} error={errors.email} disabled={!!selectedInterviewer} />
                                    
                                    <div className="col-sm-6 position-relative">
                                        <label className="form-label">Password</label>
                                        <input type={showPassword? 'text' :'password'} className="form-control" placeholder="············" disabled={!!selectedInterviewer}
                                            {...register('password', {required: 'Password is required',   minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters'
                                        },})} />
                                        <ShowPasswordIcon showPassword={showPassword} setShowPassword={setShowPassword}/>
                                        {errors.password && <small className='text-danger'>{errors.password.message}</small>}
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label" htmlFor="companyInfo">Company Info</label>
                                        <select className="form-select" {...register("companyInfo", { required: "Company Info is required" })}
                                            value={selectedCompany} onChange={(e)=> {
                                                const selected = e.target.value; 
                                                setSelectedCompany(selected);
                                                setValue('companyInfo', selected, { shouldValidate: true })}} >
                                            <option value="">Select</option>
                                            {companies.map((company)=> (
                                                <option key={company.id} value={company.id}>
                                                    {company.company_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.companyInfo && <small className="text-danger">{errors.companyInfo.message}</small>}
                                    </div>

                                    <div className="col-12 d-flex justify-content-between">
                                        <button className="btn btn-label-secondary btn-prev waves-effect" onClick={prevStep} disabled={step === 1}>
                                            <i className="icon-base ti tabler-arrow-left icon-xs me-sm-2 me-0"></i>
                                            <span className="align-middle d-sm-inline-block d-none">Previous</span>
                                        </button>
                                        <button className="btn btn-primary btn-next waves-effect waves-light" onClick={async(e) => {
                                            e.preventDefault();

                                            if(users.length === 0){
                                                toast.error("Please add at least one user to create interview.");
                                                return
                                            }

                                            let isValid = false;
                                            if(selectedInterviewer){
                                                isValid = await trigger(['interviewer', 'companyInfo']);
                                            }else{
                                                isValid = await trigger(stepFields[step]);
                                            }

                                            if(isValid){
                                                nextStep();
                                        }
                                        }} disabled={step === 6}><span className="align-middle d-sm-inline-block d-none me-sm-2">Next</span> <i className="icon-base ti tabler-arrow-right icon-xs"></i></button>
                                    </div>
                                </div>
                            </div>}

                            {step === 2 && <div className='content fv-plugins-bootstrap5 fv-plugins-framework dstepper-block active'>
                                <div className="row g-6">
                                <div className="col-12">
                                        <div className="row g-6">
                                            <div className="col-md mb-md-0">
                                                <label  className="form-label me-2 mb-1">Select Position</label>
                                                <select  className="form-select" autoFocus
                                                    value={selectedPosition} onChange={(e)=> {
                                                        const selected = e.target.value; 
                                                        setSelectedPosition(selected); 
                                                        if(selected){
                                                            clearErrors(stepFields[step]);
                                                            reset({positionName: '', startingSalary: '', positionType: '', companyName: '', address: '',
                                                                address2: '', city: '', state: '', zipCode: '', country: '', startedDate: ''})
                                                        }
                                                        }}>
                                                    <option value="">Select</option>
                                                    {jobs.map((job) => (
                                                        <option key={job.id} value={job.id}>{job.title}</option>
                                                    ))}
                                                </select>
                                                <span style={{fontSize: '12px'}}>Select Position or create one below</span>
                                            </div>
                                        </div>
                                    </div>

                                    <InputField id="positionName" name="positionName" label="Position Name" type="text" placeholder="Position Name"
                                        register={register} validation={{ required: "Position Name is required" }} error={errors.positionName} disabled={!!selectedPosition} />
                                    <InputField id="location" name="location" label="Location" type="text" placeholder="Location"
                                        register={register} validation={{ required: "Location is required" }} error={errors.location} disabled={!!selectedPosition} />
                                    <InputField id="salaryRange" name="salaryRange" label="Salary Range" type="text" placeholder="Salary Range"
                                        register={register} validation={{ required: "Salary Range is required" }} error={errors.salaryRange} disabled={!!selectedPosition} />
                                    <InputField id="application" name="application" label="Application Deadline" type="date" placeholder="Application Deadline"
                                        register={register} validation={{ required: "Application Deadline is required" }} error={errors.application} disabled={!!selectedPosition} />
                                    
                                    <div className="col-12">
                                        <div className="row g-6">
                                            <div className="col-md mb-md-0">
                                                <label className="form-label" htmlFor="positionDescription">Description</label>
                                                <textarea type="text" id="positionDescription" name="positionDescription" rows="4" className="form-control" {...register("positionDescription", {required: 'Description is required'})} disabled={!!selectedPosition}></textarea>
                                                {errors.positionDescription && <small className="text-danger">{errors.positionDescription.message}</small>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 d-flex justify-content-between">
                                        <button className="btn btn-label-secondary btn-prev waves-effect" onClick={prevStep} disabled={step === 1}><i className="icon-base ti tabler-arrow-left icon-xs me-sm-2 me-0"></i> <span className="align-middle d-sm-inline-block d-none">Previous</span></button>
                                        <button className="btn btn-primary btn-next waves-effect waves-light" onClick={async(e) => {
                                            e.preventDefault();
                                            let isValid = false;
                                            if(selectedPosition){
                                                isValid = await trigger(['position']);
                                            }else{
                                                isValid = await trigger(stepFields[step]);
                                            }

                                            if(isValid){
                                                nextStep();
                                        }
                                        }} disabled={step === 6}><span className="align-middle d-sm-inline-block d-none me-sm-2">Next</span> <i className="icon-base ti tabler-arrow-right icon-xs"></i></button>
                                    </div>
                                </div>
                            </div>}

                            {step === 3 && <div className='content dstepper-block fv-plugins-bootstrap5 fv-plugins-framework active'>
                                <div className="row g-6">
                                    <div className="col-12">
                                        <div className="row g-6">
                                            <div className="col-md mb-md-0">
                                                <label className="form-label" htmlFor="title">Title</label>
                                                <input type="text" id="title" name="title" className="form-control" {...register("title", {required: 'Title is required'})}/>
                                                {errors.title && <small className="text-danger">{errors.title.message}</small>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="row g-6">
                                            <div className="col-md mb-md-0">
                                                <label className="form-label" htmlFor="description">Description</label>
                                                <textarea type="text" id="description" name="description" rows="4" className="form-control" {...register("description", {required: 'Description is required'})}></textarea>
                                                {errors.description && <small className="text-danger">{errors.description.message}</small>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 d-flex justify-content-between">
                                        <button className="btn btn-label-secondary btn-prev waves-effect" onClick={prevStep} disabled={step === 1}>
                                            <i className="icon-base ti tabler-arrow-left icon-xs me-sm-2 me-0"></i>
                                            <span className="align-middle d-sm-inline-block d-none">Previous</span>
                                        </button>
                                        <button className="btn btn-primary btn-next waves-effect waves-light" onClick={async(e) => {
                                            e.preventDefault();
                                            const isValid = await trigger(stepFields[step]);
                        
                                            if(isValid){
                                                nextStep();
                                        }
                                        }} disabled={step === 6}><span className="align-middle d-sm-inline-block d-none me-sm-2">Next</span> <i className="icon-base ti tabler-arrow-right icon-xs"></i></button>
                                    </div>
                                </div>
                            </div>}

                            {step === 4 && <div className='content dstepper-block fv-plugins-bootstrap5 fv-plugins-framework active'>
                                <div className="row g-6">
                                    <div className="col-12">
                                        <div className="row g-6">
                                            <div className="col-md mb-md-0">
                                                <label className="form-label" htmlFor="skills">Skills</label>
                                                <Controller control={control} name='skills' 
                                                    rules={{required: 'skills are required'}} 
                                                    render={({field, fieldState: {error}}) => ( 
                                                        <>
                                                            <Select {...field} options={skills.skills.map(skill => ({ label: skill, value: skill }))}
                                                            isMulti name="skills" className="basic-multi-select" classNamePrefix="select skills"
                                                                value={skills.skills.map(skill => ({ label: skill, value: skill }))
                                                                    .filter(option => field.value?.includes(option.value))}
                                                                onChange={(selectedOptions) =>{
                                                                const selectedValues= selectedOptions.map(option => option.value);
                                                                    field.onChange(selectedValues);
                                                                    setSelectedSkill(selectedValues);
                                                            }}/>
                                                            {error && <small className="text-danger">{error.message}</small>}
                                                        </>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 d-flex justify-content-between">
                                        <button className="btn btn-label-secondary btn-prev waves-effect" onClick={prevStep} disabled={step === 1}>
                                            <i className="icon-base ti tabler-arrow-left icon-xs me-sm-2 me-0"></i>
                                            <span className="align-middle d-sm-inline-block d-none">Previous</span>
                                        </button>
                                        <button className="btn btn-primary btn-next waves-effect waves-light" onClick={async(e) => {
                                            e.preventDefault();
                                            const isValid = await trigger(stepFields[step]);
                        
                                            if(isValid){
                                                nextStep();
                                        }
                                        }} disabled={step === 6}><span className="align-middle d-sm-inline-block d-none me-sm-2">Next</span> <i className="icon-base ti tabler-arrow-right icon-xs"></i></button>
                                    </div>
                                </div>
                            </div>}

                            {step === 5 && <div className='content fv-plugins-bootstrap5 fv-plugins-framework active'>
                                <div className="row g-6">
                                    <InterviewVideo title="Intro Video(Optional)" text="Drag and drop your Intro Video" onUpload={(path) => setIntroVideoPath(path)}/>
                                    
                                    <button type='button' onClick={addQuestions} className='btn btn-primary'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                            <path d="M12 5v14M5 12h14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Add Question
                                    </button>
                                    {questions.map((question, index) => (
                                    <div style={{border: '1px solid gray', borderRadius: '6px'}} key={index}>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <h4 className='mt-3 mb-3'>{index+1}.</h4>
                                            <div className='d-flex'>
                                                <div className='d-flex align-items-center me-2'>
                                                    <select className='question-selection' value={question.type} onChange={(e) => {
                                                        const newQuestions = [...questions];
                                                        newQuestions[index].type = e.target.value;
                                                        setQuestions(newQuestions)
                                                    }}>
                                                        <option value="video">Video Recording</option>
                                                        <option value="text">Text Questions</option>
                                                        <option value="file">File Upload</option>
                                                    </select>
                                                </div>
                                                <div className='d-flex align-items-center'  style={{borderLeft: '1px dashed black'}}>
                                                    <svg className='ms-2' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <circle cx="12" cy="13" r="7" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M12 10V13H14" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M7 4L4.25 6" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M17 4L19.75 6" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span className='text-black'>
                                                        <input type='number' className='question-selection' style={{width: '40px'}} value={question.time_limit} onChange={(e)=> {
                                                            const newQuestions = [...questions];
                                                            newQuestions[index].time_limit = e.target.value;
                                                            setQuestions(newQuestions);
                                                        }} />
                                                    </span>
                                                </div>
                                                <div  className='d-flex align-items-center me-2' style={{borderLeft: '1px dashed black'}}>
                                                    <svg className='ms-2' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M19.2067 11.0974C19.2605 11.5081 19.6371 11.7974 20.0478 11.7436C20.4585 11.6897 20.7478 11.3132 20.6939 10.9025L19.2067 11.0974ZM20.1471 15.2775C20.3003 14.8927 20.1126 14.4565 19.7278 14.3032C19.343 14.1499 18.9068 14.3376 18.7535 14.7224L20.1471 15.2775ZM19.2002 20C19.2002 20.4142 19.536 20.75 19.9502 20.75C20.3644 20.75 20.7002 20.4142 20.7002 20H19.2002ZM19.9502 15H20.7002C20.7002 14.5858 20.3644 14.25 19.9502 14.25V15ZM14.9502 14.25C14.536 14.25 14.2002 14.5858 14.2002 15C14.2002 15.4142 14.536 15.75 14.9502 15.75V14.25ZM20.6939 10.9025C20.1217 6.53695 16.3948 3.27655 11.992 3.28971L11.9965 4.78971C15.6445 4.7788 18.7325 7.48027 19.2067 11.0974L20.6939 10.9025ZM11.992 3.28971C7.58915 3.30288 3.88183 6.58551 3.33572 10.9544L4.82414 11.1404C5.27663 7.52051 8.34841 4.80061 11.9965 4.78971L11.992 3.28971ZM3.33572 10.9544C2.78962 15.3232 5.57483 19.4174 9.83896 20.514L10.2125 19.0612C6.6794 18.1527 4.37165 14.7603 4.82414 11.1404L3.33572 10.9544ZM9.83896 20.514C14.1031 21.6105 18.5179 19.3678 20.1471 15.2775L18.7535 14.7224C17.4036 18.1116 13.7457 19.9698 10.2125 19.0612L9.83896 20.514ZM20.7002 20V15H19.2002V20H20.7002ZM19.9502 14.25H14.9502V15.75H19.9502V14.25Z" fill="#2F2B3D" fillOpacity="0.9"/>
                                                    </svg>
                                                    <span className='text-black'>5</span>
                                                </div>
                                                <div className='d-flex align-items-center me-2' style={{borderLeft: '1px dashed black'}}>
                                                    <svg className='ms-2' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                                        <path d="M3.6665 6.41671H18.3332" stroke="black" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M9.16683 10.0834V15.5834" stroke="black" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M12.8333 10.0834V15.5834" stroke="black" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M4.5835 6.41663L5.50016 17.4166C5.50016 18.4291 6.32097 19.25 7.3335 19.25H14.6668C15.6794 19.25 16.5002 18.4291 16.5002 17.4166L17.4168 6.41663" stroke="black" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M8.25 6.41667V3.66667C8.25 3.16041 8.66041 2.75 9.16667 2.75H12.8333C13.3396 2.75 13.75 3.16041 13.75 3.66667V6.41667" stroke="black" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>  
                                                </div>
                                            </div>
                                        </div>
                                        <div className='d-flex align-items-center mb-3'>
                                            <input className='form-control me-2 px-2 pt-1 mt-2' placeholder='Question Text' value={question.text}
                                            style={{border: '1px solid gray', borderRadius: '6px', width: '95%', paddingBottom: '5rem'}} 
                                            onChange={(e)=> {
                                                const newQuestions = [...questions];
                                                newQuestions[index].text = e.target.value;
                                                setQuestions(newQuestions)
                                            }}/>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M16 4H20V8" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M14 10L20 4" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M8 20H4V16" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M4 20L10 14" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M16 20H20V16" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M14 14L20 20" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M8 4H4V8" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M4 4L10 10" stroke="#2F2B3D" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                    ))}

                                    <InterviewVideo title="Outro Video(Optional)" text="Drag and drop your Outro Video" onUpload={(path) => setOutroVideoPath(path)}/>
                                    
                                    <div className="col-12 d-flex justify-content-between">
                                        <button className="btn btn-label-secondary btn-prev waves-effect" onClick={prevStep} disabled={step === 1}><i className="icon-base ti tabler-arrow-left icon-xs me-sm-2 me-0"></i> <span className="align-middle d-sm-inline-block d-none">Previous</span></button>
                                        <button className="btn btn-primary btn-next waves-effect waves-light" onClick={async(e) => {
                                            e.preventDefault();

                                            if(questions.length === 0 || questions.some(q => q.text.trim() === '')){
                                                toast.error("Please add at least one question and make sure it's not empty.");
                                                return
                                            }

                                            const isValid = await trigger(stepFields[step]);
                                            if(isValid){
                                                nextStep();
                                            }
                                            }} disabled={step === 6}><span className="align-middle d-sm-inline-block d-none me-sm-2">Next</span> <i className="icon-base ti tabler-arrow-right icon-xs"></i></button>
                                    </div>
                                </div>
                            </div>}

                            {step === 6 && <div  className='content fv-plugins-bootstrap5 fv-plugins-framework active'>
                                <div className="row g-5">
                                    <div>
                                        <input className="form-check-input custom-checkbox me-2" type="checkbox" checked/>
                                        <span className='text-black'>Request availability for follow up</span>
                                    </div>

                                    <div className='d-flex align-items-center justify-content-between py-3' style={{backgroundColor: '#E1DEF5E5'}}>
                                        <span style={{fontSize: '13px'}} className='ms-5'>Users</span>
                                        <span style={{fontSize: '13px'}} className='me-5'>Email</span>
                                    </div>

                                    {users.map((user) => 
                                        <div className='d-flex align-items-center justify-content-between py-1' key={user.id}>
                                            <div>
                                                <input className="form-check-input custom-checkbox me-2 ms-5" type="checkbox" value={user.id} 
                                                    checked = {assignedReviewer.includes(user.id)} onChange={()=>toggleReviewer(user.id)}/>
                                                <span style={{fontSize: '13px'}}>{user.first_name} {user.last_name}</span>
                                            </div>
                                            <span style={{fontSize: '13px'}} className='me-5'>{user.email}</span>
                                        </div>
                                    )}

                                    <div className='d-flex flex-column col-4'>
                                        <label className='form-label'>Expired Date & Time</label>
                                        <input className='form-control' type='datetime-local' {...register('expiryDate', { required: 'Expiry date is required' })} />
                                        {errors.expiryDate && ( <small className='text-danger'>{errors.expiryDate.message}</small>)}
                                    </div>
                                    <div className='d-flex flex-column align-items-center justify-content-center' style={{fontSize: '13px'}}>
                                        <span className='text-black mb-3' style={{fontWeight: '600'}}>Almost Done! Click “Publish” to Save.</span>
                                        <p className='col-5 text-center text-black'>You can edit this information at any time.Candidates can be invited on the next page.
                                        If you have any question please contact us.</p>
                                    </div>
                                    <div className="col-12 d-flex justify-content-between">
                                        <button className="btn btn-label-secondary btn-prev waves-effect" onClick={prevStep} disabled={step === 1}><i className="icon-base ti tabler-arrow-left icon-xs me-sm-2 me-0"></i> <span className="align-middle d-sm-inline-block d-none">Previous</span></button>
                                        <button className="btn btn-primary btn-submit btn-next waves-effect waves-light">
                                            <span className="align-middle d-sm-inline-block d-none me-sm-2">Submit</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M3.3335 7.99996H12.6668" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M8.6665 12L12.6665 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M8.6665 4L12.6665 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>}
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
            <div className="content-backdrop fade"></div>
        </div>
    </>
  )
}
