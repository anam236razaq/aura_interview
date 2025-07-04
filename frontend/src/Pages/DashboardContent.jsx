import { useEffect, useState } from 'react'
import Footer from '../UI/Footer'
import axios from 'axios'
import { API_BASE_URL } from '../utils/Constants'
import moment from "moment";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

export default function DashboardContent() {
  const[stats, setStats] = useState([]);
  const[latestEntries, setLatestEntries] = useState([]);
  const[data, setData] = useState([]);

  //Dashboard Statistics
  useEffect(() => {
    const dashboardStats = async() => {
      try{
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
          }
        });
        setStats(response?.data)
        console.log(response.data);
      }catch(error){
        console.log(error);
      }
    }
    dashboardStats();
  }, [])

   //Latest Entries
  useEffect(() => {
    const fetchLatestEntries = async() => {
      try{
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/dashboard/latest-entries`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
          }
        });
        setLatestEntries(response.data);
        console.log(response.data);
      }catch(error){
        console.log(error);
      }
    }
    fetchLatestEntries();
  }, [])

  //Get Last 30 days interviews
  useEffect(() => {
    const fetchLastMonthInterviews = async () => {
      try{
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/dashboard/stats/last-30-days`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
          }
        })
        setData(response.data);
        console.log(response);
      }catch(error){
        console.log(error);
      }
    }

    fetchLastMonthInterviews();
  }, [])

  // Line Chart
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const chartData = {
    labels: data?.map(d => d.date),
    datasets: [
      {
        label: 'Interviews in Last 30 Days',
        data: data.map(d => d.count),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4, // smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Interviews Line Chart' },
    },
  };

return (
  <div className="content-wrapper">
  <div className="container-xxl flex-grow-1 container-p-y">
      <div className="row g-6">
          <Card title = 'Total Users' value={stats?.total_users || 0} icon="tabler-users" />
          <Card title = 'Active Users' value={stats?.active_users || 0} icon="tabler-user-check" />
          <Card title = 'Total Candidates' value={stats?.total_candidates || 0} icon="tabler-users-group" />
          <Card title = 'Shortlisted Candidates' value={stats?.shortlisted_candidates || 0} icon="tabler-user-star"/>
          <Card title = 'Total Interviews' value={stats?.total_interviews || 0} icon="tabler-microphone" />
          <Card title = 'Draft Interviews' value={stats?.draft_interviews || 0} icon="tabler-edit-circle"/>
          <Card title = 'Active Interviews' value={stats?.active_interviews || 0} icon="tabler-microphone-2"/>
          <Card title = 'Completed Interviews' value={stats?.completed_interviews || 0} icon="tabler-checkbox"/>
          <Card title = 'Expired Interviews' value={stats?.expired_interviews || 0} icon="tabler-clock-exclamation"/>
          <Card title = 'Upcoming Interviews' value={stats?.upcoming_interviews || 0} icon="tabler-calendar-event" />
          <Card title = 'Total Questions' value={stats?.total_questions || 0} icon="tabler-help-circle" />
          <Card title = 'Total Responses' value={stats?.total_responses || 0} icon="tabler-message-circle-2" />
          
          {/*Chart for interviews conducted in last 30 days */}
          <div className='d-flex align-items-center justify-content-center'>
            <div style={{ width: '900px', height: '500px' }}>
                <Line data={chartData} options={options} />
            </div>
          </div>

          {/*Latest Users*/}
          <div className="col-xxl-6 col-md-6">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between">
                <div className="card-title m-0 me-2">
                  <h5 className="mb-1">Latest Users</h5>
                  <p className="card-subtitle">Total {stats?.total_users || 0} Users</p>
                </div>
              </div>
              <div className="card-body">
                <ul className="p-0 m-0">
                  {latestEntries?.latestUsers?.length > 0 ? (
                  latestEntries?.latestUsers.map((item) => (
                  <li className="d-flex mb-6" key={item.id}>
                    <div className="me-4">
                      <img src={item?.profile_image} alt="User" className="rounded" width="46" />
                    </div>
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <h6 className="mb-0">{item.first_name} {item.last_name}</h6>
                        <small className="text-body d-block">{item.email}</small>
                      </div>
                      <div className="user-progress d-flex align-items-center gap-1">
                        <p className={`badge text-capitalize ${item.status === 'active' ? 'bg-label-success' : 'bg-label-danger'
                          }`}>{item.role_name}</p>
                      </div>
                    </div>
                  </li>
                  ))) : (
                    <div>
                        <span className="text-center">No Users found</span>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/*Latest Candidates*/}
          <div className="col-xxl-6 col-md-6">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between">
                <div className="card-title m-0 me-2">
                  <h5 className="mb-1">Latest Candidates</h5>
                  <p className="card-subtitle">Total {stats?.total_candidates || 0} Candidates</p>
                </div>
              </div>
              <div className="card-body">
                <ul className="p-0 m-0">
                  {latestEntries?.latestCandidates?.length > 0 ? (
                  latestEntries?.latestCandidates.map((item) => (
                  <li className="d-flex mb-6" key={item.id}>
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        {item.name && item.email ? (
                          <>
                            <h6 className="mb-0">{item.name}</h6>
                            <small className="text-body d-block">{item.email}</small>
                          </>
                        ) : (
                            <h6 className="mb-0">{item.file_path}</h6>
                        )}
                      </div>
                      <div className="user-progress d-flex align-items-center gap-1">
                        <p className={`badge text-capitalize ${item.status === 'processed' ? 'bg-label-success' : 'bg-label-danger'
                          }`}>{item.status}</p>
                      </div>
                    </div>
                  </li>
                  ))) : (
                    <div>
                        <span className="text-center">No Candidates found</span>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/**Latest Interviews**/}
          <div className="col-xxl-6 col-md-6">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between">
                <div className="card-title m-0 me-2">
                  <h5 className="mb-1">Latest Interviews</h5>
                  <p className="card-subtitle">Total {stats?.total_interviews || 0} Interviews</p>
                </div>
              </div>
              <div className="card-body">
                <ul className="p-0 m-0">
                  {latestEntries?.latestInterviews?.length > 0 ? (
                  latestEntries?.latestInterviews.map((item) => (
                  <li className="d-flex mb-6" key={item.id}>
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <h6 className="mb-0">{item.title}</h6>
                      </div>
                      <div className="me-2">
                        <h6 className="mb-0">{moment(item.expiry_date).format("MMMM Do, YYYY")}</h6>
                      </div>
                      <div className="user-progress d-flex align-items-center gap-1">
                        <p className={`badge text-capitalize fw-semibold ${
                            item.status === 'active'
                            ? 'bg-success text-white'
                            : item.status === 'draft'
                            ? 'bg-warning text-white'
                            : item.status === 'completed'
                            ? 'bg-primary text-white'
                            : item.status === 'archived'
                            ? 'bg-dark text-white'
                            : 'bg-primary text-white' }`}>{item.status}
                          </p>
                      </div>
                    </div>
                  </li>
                  ))) : (
                    <div>
                        <span className="text-center">No Interviews found</span>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/*Latest Questions */}
          <div className="col-xxl-6 col-md-6">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between">
                <div className="card-title m-0 me-2">
                  <h5 className="mb-1">Latest Questions</h5>
                  <p className="card-subtitle">Total {stats?.total_questions || 0} Questions</p>
                </div>
              </div>
              <div className="card-body">
                <ul className="p-0 m-0">
                  {latestEntries?.latestQuestions?.length > 0 ? (
                  latestEntries?.latestQuestions.map((item) => (
                  <li className="d-flex mb-6" key={item.id}>
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <h6 className="mb-0 text-capitalize">{item.text}</h6>
                      </div>
                      <div className="user-progress d-flex align-items-center gap-1">
                        <p className={`badge text-capitalize bg-label-primary`}>{item.type}</p>
                      </div>
                    </div>
                  </li>
                  ))) : (
                    <div>
                        <span className="text-center">No Questions found</span>
                    </div>
                  )}
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

function Card({title, value, icon}){
  return (
    <div className="col-lg-2 col-sm-6">
      <div className="card card-border-shadow-primary h-100">
        <div className="card-body">
          <div className="d-flex align-items-center mb-2">
            <div className="avatar me-4">
              <span className="avatar-initial rounded bg-label-primary"><i className={`icon-base ti ${icon} icon-28px`} /></span>
            </div>
            <h4 className="mb-0">{value}</h4>
          </div>
          <p className="mb-1">{title}</p>
        </div>
      </div>
    </div>
  )
}
