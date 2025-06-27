import LandingFooter from "./UI/LandingFooter";
import LandingNavbar from "./UI/LandingNavbar";
import { useEffect } from 'react';

export default function PrivacyPolicy() {

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
              <h2 className='text-center mb-1' style={{ color: '#323243' }}>Privacy Policy</h2>
            </div>
          </div>
          <h4 className="text-center mb-1">
            <span className="position-relative fw-extrabold z-1">
              Your data matters
              <img src="./assets/img/front-pages/icons/section-title-icon.png" alt="laptop charging"
                className="section-title-img position-absolute object-fit-contain bottom-0 z-n1" />
            </span>{' '} to us
          </h4>

          <p className="text-center pb-md-4">We are committed to protecting your personal information and keeping your data safe. Feel free to contact us with any privacy concerns.</p>
      </div>

      <section className="section-py px-4 px-sm-5" style={{paddingTop:'3rem'}}>
        <div className="container">
          <p>
            <strong>Effective Date:</strong> 13/02/25 <br />
            <strong>Last Updated:</strong> 13/02/25
          </p>
          <p>
            AuraInterview (“we”, “our”, “us”) is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard the information you provide while using our platform.
          </p>

          <p><strong>1. Information We Collect</strong></p>
          <ul>
            <li><strong>User Data:</strong> Names, emails, and role-based access (e.g., Admin, HR, Manager).</li>
            <li><strong>Candidate Data:</strong> Names, contact details, resumes, skills, and interview outcomes.</li>
            <li><strong>Interview Data:</strong> Interview schedules, assigned candidates, review remarks, and performance evaluations.</li>
          </ul>

          <p><strong>2. How We Use Your Information</strong></p>
          <ul>
            <li><strong>Role Management:</strong> Admins can create and manage users like HR and Managers for interview workflows.</li>
            <li><strong>Interview Coordination:</strong> Admins and Managers can schedule interviews and shortlist candidates based on skillsets.</li>
            <li><strong>Candidate Assessment:</strong> HRs can review, comment on, and track interview outcomes.</li>
            <li><strong>Platform Improvement:</strong> Usage patterns may be analyzed to improve features and functionality.</li>
          </ul>

          <p><strong>3. Data Sharing and Retention</strong></p>
          <ul>
            <li>Your data is shared only with authorized team members within your organization for recruitment purposes.</li>
            <li>We do not sell or rent personal data to third parties.</li>
            <li>Candidate data is retained for as long as necessary to fulfill recruitment and compliance needs.</li>
          </ul>

          <p><strong>4. Security Measures</strong></p>
          <ul>
            <li>We use encryption, access control, and audit logs to protect your information.</li>
            <li>In case of any data breach, users will be notified promptly, and remedial actions will be taken.</li>
          </ul>

          <p><strong>5. Your Rights</strong></p>
          <ul>
            <li>Users can request access to their stored information or request its correction or deletion.</li>
            <li>Candidates may request the removal of their profiles upon conclusion of the interview process.</li>
          </ul>

          <p><strong>6. Contact</strong></p>
          <p>
            For any privacy-related inquiries, please contact us at:<br />
            <strong>Email:</strong> support@aurainterview.com
          </p>
        </div>
      </section>
      <LandingFooter />
    </>
  );
}
