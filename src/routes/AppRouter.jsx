import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

import Landing              from '../pages/Landing/Landing';
import Login                from '../pages/Auth/Login';
import Register             from '../pages/Auth/Register';
import Dashboard            from '../pages/Dashboard/Dashboard';
import Profile              from '../pages/Profile/Profile';
import SkillAssessment      from '../pages/SkillAssessment/SkillAssessment';
import InterestAnalysis     from '../pages/InterestAnalysis/InterestAnalysis';
import CareerRecommendations from '../pages/CareerRecommendations/CareerRecommendations';
import SkillGap             from '../pages/SkillGap/SkillGap';
import LearningRoadmap      from '../pages/LearningRoadmap/LearningRoadmap';
import Progress             from '../pages/Progress/Progress';
import Notifications        from '../pages/Notifications/Notifications';
import AdminDashboard       from '../pages/Admin/AdminDashboard';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Landing />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected — wrapped in sidebar layout */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/profile"     element={<Profile />} />
        <Route path="/assessment"  element={<SkillAssessment />} />
        <Route path="/interests"   element={<InterestAnalysis />} />
        <Route path="/careers"     element={<CareerRecommendations />} />
        <Route path="/skill-gap"   element={<SkillGap />} />
        <Route path="/roadmap"     element={<LearningRoadmap />} />
        <Route path="/progress"    element={<Progress />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
