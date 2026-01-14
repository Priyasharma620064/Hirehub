import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterSeeker from './pages/RegisterSeeker';
import RegisterEmployer from './pages/RegisterEmployer';
import SeekerDashboard from './pages/SeekerDashboard';
import SeekerProfile from './pages/SeekerProfile';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import MyApplications from './pages/MyApplications';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployerProfile from './pages/EmployerProfile';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import Applicants from './pages/Applicants';
import AdminDashboard from './pages/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './custom.css';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/seeker" element={<RegisterSeeker />} />
        <Route path="/register/employer" element={<RegisterEmployer />} />
        <Route path="/jobs" element={<JobListings />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Job Seeker Routes */}
        <Route
          path="/seeker/dashboard"
          element={
            <ProtectedRoute allowedRoles={['seeker']}>
              <SeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seeker/profile"
          element={
            <ProtectedRoute allowedRoles={['seeker']}>
              <SeekerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seeker/applications"
          element={
            <ProtectedRoute allowedRoles={['seeker']}>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Employer Routes */}
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/profile"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/post-job"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <MyJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/job/:jobId/applicants"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <Applicants />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
