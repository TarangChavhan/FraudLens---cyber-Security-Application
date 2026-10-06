import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import LinkCheck from './pages/user/LinkCheck';
import ReportCybercrime from './pages/user/ReportCybercrime';
import MyReports from './pages/user/MyReports';
import ReportDetails from './pages/user/ReportDetails';
import CyberSafetyGuidance from './pages/user/CyberSafetyGuidance';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReports from './pages/admin/AdminReports';
import AssignExpert from './pages/admin/AssignExpert';

// Expert Pages
import ExpertDashboard from './pages/expert/ExpertDashboard';
import Investigation from './pages/expert/Investigation';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const DefaultLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* User Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['USER']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/report" element={<ReportCybercrime />} />
        <Route path="/user/my-reports" element={<MyReports />} />
        <Route path="/user/report/:id" element={<ReportDetails />} />
        <Route path="/user/link-check" element={<LinkCheck />} />
        <Route path="/user/guidance" element={<CyberSafetyGuidance />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/assign" element={<AssignExpert />} />
      </Route>

      {/* Expert Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['CYBER_EXPERT']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/expert" element={<ExpertDashboard />} />
        <Route path="/expert/investigation/:id?" element={<Investigation />} />
      </Route>
    </Routes>
  );
};

export default App;
