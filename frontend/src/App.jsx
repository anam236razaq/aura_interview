import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import { SidebarProvider } from './Contexts/SidebarContext'
import Dashboard from './Pages/Dashboard'
import DashboardContent from './Pages/DashboardContent'
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
import InterviewDetails from './Pages/Interview/InterviewDetails'
import InterviewResponses from "./Pages/Interview/InterviewResponses"
import ViewResponse from "./Pages/Interview/ViewResponse"
import CandidatePublicInterview from "./Pages/Interview/CandidatePublicInterview"
import InterviewInvitation from "./Pages/Interview/InterviewInvitation"
import { useState } from "react"
import { useEffect } from "react"
import UpcomingInterview from "./Pages/Interview/UpcomingInterview"
import ExpiredInterview from "./Pages/Interview/ExpiredInterview"
import ShortListedCandidates from "./Pages/Candidates/ShortListedCandidates"
import BlackListedCandidates from "./Pages/Candidates/BlackListedCandidates"
import DraftInterviews from "./Pages/Interview/DraftInterviews"
import DraftCv from "./Pages/Candidates/DraftCv"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('authToken'));
    }

    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
    }
  }, [])

  function handleLogin(token){
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  }

  /*function handleLogout() {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  }*/

    function ProtectedRoute({children}){
        return isAuthenticated? children : <Navigate to='/login' replace />
    }

    function PublicRoute({children}){
      return isAuthenticated? <Navigate to ='/' replace/> : children;
    }

    const RoleBasedRoute = ({children, allowedRoles}) => {
      const roleId = parseInt(localStorage.getItem('roleId'), 10);

      if(!allowedRoles.includes(roleId)){
        return <Navigate to="/not-authorized" replace />
      }

      return children;
    }

  return (
    <SidebarProvider>
    <Router>
      <Routes>
        <Route path='/' element ={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route index element ={<DashboardContent />} />
            <Route path='users/user-list' element={<RoleBasedRoute allowedRoles={[1]}>
                  <UserList />
              </RoleBasedRoute>} />
            <Route path='candidates/candidate-list' element={<RoleBasedRoute allowedRoles={[1,2]}>
                < CandidateList  />
            </RoleBasedRoute>} />
            <Route path='candidates/cv-import' element={<RoleBasedRoute allowedRoles={[1,2]}><BulkImportCv /></RoleBasedRoute>} />
            <Route path='candidates/draft-cvs' element={<DraftCv />} />
            <Route path='candidates/:id' element={<CVDetails />} />
            <Route path="candidates/short-listed" element={<RoleBasedRoute allowedRoles={[1,2]}>
                  <ShortListedCandidates />
              </RoleBasedRoute>} />
            <Route path="candidates/blacklisted" element={<RoleBasedRoute allowedRoles={[1,2]}>
                  <BlackListedCandidates />
              </RoleBasedRoute>} />
            <Route path='/interviewed/create-interview' element={<RoleBasedRoute allowedRoles={[1,2]}>
                  <InterviewSetup/>
              </RoleBasedRoute>} />
            <Route path='/interviewed/interview-list' element={<InterviewList />} />
            <Route path='/interviewed/upcoming-interview' element={<UpcomingInterview type="upcoming"/>} />
            <Route path='/interviewed/expired-interview' element={<ExpiredInterview  type="expired" />} />
            <Route path='/interviewed/interview-list/:id' element={<InterviewDetails />} />
            <Route path="/interviewed/interview/:interviewId/responses" element={<InterviewResponses />} />
            <Route path="/interview/:interviewId/responses/:cvId" element={<ViewResponse />} />
            <Route path="/interviewed/draft-interviews" element={<DraftInterviews />} />
            <Route path='/accounts/account-settings' element={<AccountSettings />} />
            <Route path='/accounts/account-security' element={<AccountSecurity />} />
            <Route path='/documentation' element={<Documentation />} />
            <Route path='/support' element={<Support />} />
            <Route path='/company' element={<RoleBasedRoute allowedRoles={[1,2]}><CompanyDetails /></RoleBasedRoute>} />
        </Route>
        <Route path='register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path='login' element={<PublicRoute><Login onLogin = {handleLogin}/></PublicRoute>} />
        <Route path='/interview/public/:invitationToken' element={<CandidatePublicInterview />} />
        <Route path='/interview/invitation/:interviewId/:token' element={<InterviewInvitation />} />
        <Route path='reset-password' element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path='forgot-password' element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path='verify-email' element={<PublicRoute><VerifyEmail /></PublicRoute>} />
        <Route path='two-step-verification' element={<PublicRoute><TwoStepVerification /></PublicRoute>} />
        <Route path='not-found' element={<NotFoundPage />} />
        <Route path='not-authorized' element={<NotAuthorized />} />
        <Route path='coming-soon' element={<ComingSoon />} />
        <Route path='under-maintenance' element={<UnderMaintenance />} />
      </Routes>
    </Router>
    </SidebarProvider>
  )
}
