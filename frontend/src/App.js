import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import MyApplications from './pages/MyApplications'
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute.js";
import CreateJob from "./pages/CreateJob";
import ManageJobs from "./pages/ManageJob";
import EditJob from "./pages/EditJob";
import AdminApplications from "./pages/AdminApplications";
import Applicants from "./pages/Applicants";
import QuizManagement from "./pages/QuizManagement";
import JobQuizOptions from "./pages/JobQuizOptions";
import ViewQuiz from "./pages/ViewQuiz";
import QuizResults from "./pages/QuizResult";
import CreateQuiz from "./pages/CreateQuiz";
import EditQuiz from "./pages/EditQuiz";
import HireCandidates from "./pages/HireCandidates";
import JobFinalCandidates from "./pages/JobFinalCandidate";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ FIXED: Quiz route inside Routes */}
        <Route
          path="/quiz/:jobId"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
         <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
       <Route
  path="/my-applications"
  element={
    <ProtectedRoute>
      <MyApplications />
    </ProtectedRoute>
  }
/>
/
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
<Route path="/admin/create-job" element={<CreateJob />} />
<Route path="/admin/jobs" element={<ManageJobs />} />
<Route
  path="admin/edit-job/:id"
  element={
    <ProtectedRoute adminOnly={true}>
      <EditJob />
    </ProtectedRoute>
  }
/>


<Route path="/admin/applications" element={<AdminApplications />} />

<Route path="/admin/applicants/:jobId" element={<Applicants />} />



<Route path="/admin/quiz-results/:jobId" element={<QuizResults />} />

<Route path="/admin/create-quiz/:jobId" element={<CreateQuiz />} />

<Route path="/admin/view-quiz/:jobId" element={<ViewQuiz />} />

<Route path="/admin/edit-quiz/:jobId" element={<EditQuiz />} />

<Route path="/admin/quiz-management" element={<QuizManagement />} />

<Route path="/admin/quiz/:jobId" element={<JobQuizOptions />} />

<Route path="/admin/hire" element={<HireCandidates />} />

<Route path="/admin/hire/:jobId" element={<JobFinalCandidates />} />
      </Routes>

    </Router>
  );
}

export default App;