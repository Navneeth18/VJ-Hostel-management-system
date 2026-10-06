import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Protected Route Guards
import { StudentProtectedRoute, AdminProtectedRoute } from './components/common/ProtectedRoute';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Unified Login Page
import UnifiedLogin from './pages/UnifiedLogin';

// Student Pages & Components
import HomePage from './pages/student/Home';
import Announcement from './components/student/Announcement';
import TodayAnnouncements from './components/student/TodayAnnouncements';
import AllAnnouncements from './components/student/AllAnnouncements';
import Community from './components/student/Community';
import Complaints from './components/student/Complaints';
import PostComplaint from './components/student/PostComplaints';
import ComplaintsList from './components/student/ComplaintsList';
import OutpassPage from './components/student/OutpassPage';
import Outpass from './components/student/Outpass';
import OutpassList from './components/student/OutpassList';
import StudentProfile from './components/student/StudentProfile';
import StudentFood from './components/student/Food';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminRooms from './pages/admin/Rooms';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminComplaints from './pages/admin/Complaints';
import AdminOutpasses from './pages/admin/Outpasses';
import AdminCommunity from './pages/admin/Community';
import AdminFood from './pages/admin/Food';
import AdminProfile from './pages/admin/Profile';

function App() {
  return (
    <Routes>
      {/* Public / Authentication Routes */}
      <Route path="/login" element={<UnifiedLogin />} />
      <Route path="/admin/login" element={<UnifiedLogin />} />
      <Route path="/student/login" element={<UnifiedLogin />} />

      {/* Student Portal Routes */}
      <Route path="/home" element={
        <StudentProtectedRoute>
          <StudentLayout />
        </StudentProtectedRoute>
      }>
        <Route index element={<HomePage />} />
        <Route path="announcements" element={<Announcement />}>
          <Route path="today" element={<TodayAnnouncements />} />
          <Route path="all" element={<AllAnnouncements />} />
        </Route>
        <Route path="community" element={<Community />} />
        <Route path="complaints" element={<Complaints />}>
          <Route path="complaint" element={<PostComplaint />} />
          <Route path="complaint-list" element={<ComplaintsList />} />
        </Route>
        <Route path="outpass" element={<OutpassPage />}>
          <Route path="apply-outpass" element={<Outpass />} />
          <Route path="outpass-history" element={<OutpassList />} />
        </Route>
        <Route path="profile" element={<StudentProfile />} />
        <Route path="food" element={<StudentFood />} />
      </Route>

      {/* Admin Portal Routes */}
      <Route path="/dashboard" element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="rooms" element={<AdminRooms />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="outpasses" element={<AdminOutpasses />} />
        <Route path="community" element={<AdminCommunity />} />
        <Route path="food" element={<AdminFood />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Fallback Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
