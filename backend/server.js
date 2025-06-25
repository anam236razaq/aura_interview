require('dotenv').config();
const express = require('express');
const path = require('path'); // Needed for serving static files
const cvRoutes = require('./routes/cvRoutes'); // Import CV routes
const interviewRoutes = require('./routes/interviewRoutes'); // Import Interview routes
const invitationRoutes = require('./routes/invitationRoutes'); // Import invitation routes
const responseRoutes = require('./routes/responseRoutes'); // Import response routes
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const authMiddleware = require('./middleware/authMiddleware'); // Import auth middleware
const jobRoutes = require('./routes/jobRoutes'); // Import job routes
const userRoutes = require('./routes/userRoutes'); // Import user routes
const candidateRoutes = require('./routes/candidateRoutes'); // Import candidate routes
const skillsRoutes = require('./routes/skillsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const companyRoutes = require('./routes/companyRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
require('./Queues/invitationProcessor');
const cors = require('cors');
const app = express();
app.use(cors())

const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route
app.get('/', (req, res) => {
  res.send('AuraInterview Backend is running!');
});

// API Routes
app.use('/api/auth', authRoutes); // Public auth routes

// Protected Routes - Apply auth middleware
app.use('/api/cv', authMiddleware, cvRoutes);
app.use('/api/interviews', authMiddleware, interviewRoutes); // This protects interview management and nested routes like questions/assignments
app.use('/api/jobs', authMiddleware, jobRoutes); // Mount protected job routes
app.use('/api/candidates', authMiddleware, candidateRoutes); // Mount protected candidate routes
app.use('/api/skills', authMiddleware, skillsRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/companies', authMiddleware, companyRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Routes potentially needing different access control:
app.use('/api/roles', rolesRoutes);
app.use('/api/users', userRoutes); // Mount user routes
app.use('/api/invitations', invitationRoutes); // Contains public /:token access and protected /interviews/:id/invitations
app.use('/api/responses', responseRoutes); // Contains public submission and protected retrieval

// TODO: Refine middleware application per-route within invitationRoutes and responseRoutes if needed

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
