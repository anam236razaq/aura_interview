import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { SidebarProvider } from './Contexts/SidebarContext';
import { lazy, Suspense } from 'react';
import { useState } from "react";
import { useEffect } from "react";

const Dashboard = lazy(() => import('./Pages/Dashboard'));
const DashboardContent = lazy(() => import('./Pages/DashboardContent'));
const UserList = lazy(() => import('./Pages/Users/UserList'));
const CandidateList = lazy(() => import('./Pages/Candidates/CandidateList'));
const InterviewSetup = lazy(() => import('./Pages/Interview/InterviewSetup'));
const AccountSettings = lazy(() => import('./Pages/Accounts/AccountSettings'));
const AccountSecurity = lazy(() => import('./Pages/Accounts/AccountSecurity'));
const BulkImportCv = lazy(() => import('./Pages/Candidates/BulkImportCv'));
const CVDetails = lazy(() => import('./Pages/Candidates/CVDetails'));
const Documentation = lazy(() => import('./Pages/Documentation'));
const Support = lazy(() => import('./Pages/Support'));
const CompanyDetails = lazy(() => import('./Pages/CompanyDetails'));
const InterviewList = lazy(() => import('./Pages/Interview/InterviewList'));
const InterviewDetails = lazy(() => import('./Pages/Interview/InterviewDetails'));
const InterviewResponses = lazy(() => import('./Pages/Interview/InterviewResponses'));
const ViewResponse = lazy(() => import('./Pages/Interview/ViewResponse'));
const CandidatePublicInterview = lazy(() => import('./Pages/Interview/CandidatePublicInterview'));
const InterviewInvitation = lazy(() => import('./Pages/Interview/InterviewInvitation'));
const UpcomingInterview = lazy(() => import('./Pages/Interview/UpcomingInterview'));
const ExpiredInterview = lazy(() => import('./Pages/Interview/ExpiredInterview'));
const ShortListedCandidates = lazy(() => import('./Pages/Candidates/ShortListedCandidates'));
const BlackListedCandidates = lazy(() => import('./Pages/Candidates/BlackListedCandidates'));
const DraftInterviews = lazy(() => import('./Pages/Interview/DraftInterviews'));
const DraftCv = lazy(() => import('./Pages/Candidates/DraftCv'));
const Profile = lazy(() => import('./Pages/Profile'));
const Settings = lazy(() => import('./Pages/Settings'));
const Reporting = lazy(() => import('./Pages/Reporting'));
const InterviewPicks = lazy(() => import('./Pages/Interview/InterviewPicks'));
const ContactUs = lazy(() => import('./LandingPages/ContactUs'));
const TermsConditions = lazy(() => import('./LandingPages/TermsConditions'));
const PrivacyPolicy = lazy(() => import('./LandingPages/PrivacyPolicy'));

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
import Loader from "./UI/Loader";
import { ProfileProvider } from "./Contexts/ProfileContext";

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
    <ProfileProvider>
    <SidebarProvider>
    <Router>
      <Suspense fallback={<Loader />}>
      <Routes>
        <Route path='/' element ={isAuthenticated? <ProtectedRoute><Dashboard /></ProtectedRoute> : <Navigate to="/login" replace />}>
            <Route index element ={<DashboardContent />} />
            <Route path='users/user-list' element={<RoleBasedRoute allowedRoles={[1,2]}><UserList /></RoleBasedRoute>} />
            <Route path='candidates/candidate-list' element={<RoleBasedRoute allowedRoles={[1,2]}><CandidateList  /></RoleBasedRoute>} />
            <Route path='candidates/cv-import' element={<RoleBasedRoute allowedRoles={[1,2]}><BulkImportCv /></RoleBasedRoute>} />
            <Route path='candidates/draft-cvs' element={<RoleBasedRoute allowedRoles={[1,2]}><DraftCv /></RoleBasedRoute>} />
            <Route path='candidates/:id' element={<RoleBasedRoute allowedRoles={[1,2]}><CVDetails /></RoleBasedRoute>} />
            <Route path="candidates/short-listed" element={<RoleBasedRoute allowedRoles={[1,2]}><ShortListedCandidates /></RoleBasedRoute>} />
            <Route path="candidates/blacklisted" element={<RoleBasedRoute allowedRoles={[1,2]}><BlackListedCandidates /></RoleBasedRoute>} />
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
            <Route path="/interviewed/interview-picks" element={<InterviewPicks />} />
            <Route path='/accounts/account-settings' element={<AccountSettings />} />
            <Route path='/accounts/account-security' element={<AccountSecurity />} />
            <Route path='/documentation' element={<Documentation />} />
            <Route path='/support' element={<Support />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reporting" element={<Reporting />} />
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
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path='/contact-us' element={<ContactUs />} />
      </Routes>
      </Suspense>
    </Router>
    </SidebarProvider>
    </ProfileProvider>
  )
}
