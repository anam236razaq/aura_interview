import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { SidebarProvider } from './Contexts/SidebarContext'
import Dashboard from './Pages/Dashboard'
import DashboardContent from './Pages/DashboardContent'
import CreateUser from './Pages/Users/CreateUser'
import UserList from './Pages/Users/UserList'
import Register from './UI/Register'
import Login from './UI/Login'
import ResetPassword from './UI/ResetPassword'
import ForgotPassword from './UI/ForgotPassword'
import VerifyEmail from './UI/VerifyEmail'
import TwoStepVerification from './UI/TwoStepVerification'
import NotFoundPage from './UI/NotFoundPage'
import NotAuthorized from './UI/NotAuthorized'
import ComingSoon from './UI/ComingSoon'
import UnderMaintenance from './UI/UnderMaintenance'
import CandidateList from './Pages/Candidates/CandidateList'
import InterviewSetup from './Pages/Interview/InterviewSetup'
import AccountSettings from './Pages/Accounts/AccountSettings'
import AccountSecurity from './Pages/Accounts/AccountSecurity'
import BulkImportCv from './Pages/Candidates/BulkImportCv'
import CVDetails from './Pages/Candidates/CVDetails'
import Documentation from './Pages/Documentation'
import Support from './Pages/Support'
import CompanyDetails from './Pages/CompanyDetails'
import InterviewList from './Pages/Interview/InterviewList'

export default function App() {

  function handleLogin(token){
    localStorage.setItem('authToken', token);
  }

  return (
    <SidebarProvider>
    <Router>
      <Routes>
        <Route path='/' element ={<Dashboard />}>
            <Route index element ={<DashboardContent />} />
            <Route path='users/create-user' element={<CreateUser />} />
            <Route path='users/user-list' element={<UserList />} />
            <Route path='candidates/candidate-list' element={<CandidateList />} />
            <Route path='candidates/cv-import' element={<BulkImportCv />} />
            <Route path='candidates/draft-cvs' element={<CVDetails />} />
            <Route path='candidates/:id' element={<CVDetails />} />
            <Route path='/interviewed/create-interview' element={<InterviewSetup />} />
            <Route path='/interviewed/interview-list' element={<InterviewList />} />
            <Route path='/accounts/account-settings' element={<AccountSettings />} />
            <Route path='/accounts/account-security' element={<AccountSecurity />} />
            <Route path='/documentation' element={<Documentation />} />
            <Route path='/support' element={<Support />} />
            <Route path='/company' element={<CompanyDetails />} />
        </Route>
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login onLogin = {handleLogin}/>} />
        <Route path='reset-password' element={<ResetPassword />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='verify-email' element={<VerifyEmail />} />
        <Route path='two-step-verification' element={<TwoStepVerification />} />
        <Route path='not-found' element={<NotFoundPage />} />
        <Route path='not-authorized' element={<NotAuthorized />} />
        <Route path='coming-soon' element={<ComingSoon />} />
        <Route path='under-maintenance' element={<UnderMaintenance />} />
      </Routes>
    </Router>
    </SidebarProvider>
  )
}
