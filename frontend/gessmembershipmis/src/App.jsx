import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import AdminLayout from "./pages/adminlayout";
import AdminOverview from "./pages/adminoverview";
import ClubForm from "./components/clubform";
import AdminApprovals from "./pages/managemembers";
import AdminReports from "./pages/adminreport";
import ProtectedRoute from "./components/protectedroutes";
import RegisterForm from "./pages/registerform";
import RegisterPatron from "./pages/patronregisterform";
import StudentDashboard from "./pages/studentsdashboard"

function App() {
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<StudentDashboard/>} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Admin (protected group) */}
      <Route
        path="/admin-dashboard/*"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="register-users" element={<RegisterForm />} />
        <Route path="patrons" element={<RegisterPatron />} />
        <Route path="clubs" element={<ClubForm />} />
        <Route path="manage-members" element={<AdminApprovals />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>
    </Routes>
  );
}

export default App;