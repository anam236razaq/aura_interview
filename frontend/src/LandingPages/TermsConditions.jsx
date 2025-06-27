import { useEffect } from "react";
import LandingFooter from "./UI/LandingFooter";
import LandingNavbar from "./UI/LandingNavbar";


export default function TermsConditions() {

  useEffect(() => {
      const link1 = document.createElement('link');
      link1.rel = 'stylesheet';
      link1.href = '/assets/vendor/css/pages/front-page.css';
  
      const link2 = document.createElement('link');
      link2.rel = 'stylesheet';
      link2.href = '/assets/vendor/css/pages/front-page-landing.css';
  
      document.head.appendChild(link1);
      document.head.appendChild(link2);
  
      return () => {
        document.head.removeChild(link1);
        document.head.removeChild(link2);
      };
    }, []);

  return (
    <>
      <LandingNavbar />
      <div className="container py-5" style={{backgroundColor: '#eaeaea', marginTop: '4rem'}}>
          <div className="page-title-inner">
            <div className="page-title-title">
              <h2 className='text-center mb-1' style={{ color: '#323243' }}>Terms & Conditions</h2>
            </div>
          </div>
          <h4 className="text-center mb-1">
            <span className="position-relative fw-extrabold z-1">
              Know your responsibilities
              <img src="./assets/img/front-pages/icons/section-title-icon.png" alt="laptop charging"
                className="section-title-img position-absolute object-fit-contain bottom-0 z-n1" />
            </span>{' '} on Aurainterview
          </h4>
          <p className="text-center pb-md-4">  By accessing and using AuraInterview, you agree to follow our terms and conditions. This includes using the platform ethically, respecting role-based permissions, and maintaining the confidentiality of candidate and interview data.</p>
      </div>

      <section className="section-py px-4 px-sm-5" style={{paddingTop: '3rem'}}>
        <div className="container">
          <p>
            <strong>Effective Date:</strong> 13/02/2025<br />
            <strong>Last Updated:</strong> 13/02/2025
          </p>

          <p><strong>1. Introduction</strong></p>
          <ul>
              <li>Welcome to AuraInterview, a smart interview and hiring platform developed by Skillpark Innovations Private Limited (“Company”, “we”, “our”). These Terms & Conditions (“Terms”) govern your use of the AuraInterview platform and services (“Service”). By accessing or using the Service, you agree to be bound by these Terms.</li>
          </ul>

          <p><strong>2. Definitions</strong></p>
          <ul>
              <li><strong>Service:</strong> The AuraInterview platform including user role management, interview scheduling, candidate evaluation, and reporting.</li>
              <li><strong>User:</strong> Any individual with access to the platform in the capacity of Admin, HR, Manager, or Candidate.</li>
              <li><strong>Candidate Data:</strong> Information submitted by or about job applicants including personal details, resume, and interview results.</li>
              <li><strong>Admin:</strong> A user with the highest permissions, able to manage users and oversee interview processes.</li>
          </ul>

          <p><strong>3. Acceptance of Terms</strong></p>
          <ul>
            <li>By registering or using the Service, you confirm that you have read and agree to these Terms. We may update these Terms at any time. Continued use implies acceptance of any changes.</li>
          </ul>

          <p><strong>4. User Roles & Responsibilities</strong></p>
          <ul>
            <li><strong>Admins:</strong> Can create and manage users, including HRs and Managers, and oversee platform activities.</li>
            <li><strong>Managers:</strong> Can create interviews, assign them to candidates, and evaluate performance.</li>
            <li><strong>HRs:</strong> Can review candidate progress and finalize decisions based on interview outcomes.</li>
            <li><strong>Candidates:</strong> May receive invitations, complete assigned interviews, and view feedback if permitted.</li>
          </ul>

          <p><strong>5. Account Security</strong></p>
          <ul>
            <li>Users are responsible for maintaining the confidentiality of their login credentials and all activities under their account.</li>
            <li>Unauthorized access or impersonation is strictly prohibited.</li>
          </ul>

          <p><strong>6. Usage Guidelines</strong></p>
          <ul>
            <li>The Service must be used only for professional recruitment purposes.</li>
            <li>Users must not misuse or tamper with the interview process or candidate data.</li>
            <li>Candidate data must be handled confidentially and in accordance with data privacy laws.</li>
          </ul>

          <p><strong>7. Data Privacy</strong></p>
          <ul>
            <li>All personal and candidate data is handled as per our <strong>Privacy Policy</strong>.</li>
            <li>We do not share user data with third parties unless required by law or with explicit consent.</li>
          </ul>

   
          <p><strong>8. Intellectual Property</strong></p>
          <ul>
            <li>The AuraInterview platform, branding, and associated software are the property of Skillpark Innovations Private Limited.</li>
            <li>Users are granted a non-transferable license to access and use the platform strictly within the scope of these Terms.</li>
          </ul>

          <p><strong>9. Termination</strong></p>
          <ul>
            <li>We reserve the right to suspend or terminate user accounts if these Terms are violated.</li>
            <li>Users may request deactivation of their account at any time by contacting support.</li>
          </ul>

   
          <p><strong>`10. Limitation of Liability</strong></p>
          <ul>
            <li>The platform is provided “as is” without warranty of any kind.</li>
            <li>We are not liable for any direct or indirect damages arising from use of the Service, including loss of data or recruitment decisions.</li>
          </ul>

          <p><strong>11. Governing Law</strong></p>
          <ul>
            <li>These Terms are governed by the laws of India.</li>
            <li>Any disputes shall be resolved in the courts of Hyderabad, India.</li>
          </ul>

          <p><strong>12. Contact</strong></p>
          <p>
            For any privacy-related inquiries, please contact us at:<br />
            <strong>Email:</strong> support@aurainterview.com
          </p>
        </div>
      </section>
      <LandingFooter />
    </>
  )
}
