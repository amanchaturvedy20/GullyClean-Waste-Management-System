import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import BinsPage from './pages/BinsPage';
import BinDetailPage from './pages/BinDetailPage';
import PickupRequestPage from './pages/PickupRequestPage';
import PickupsPage from './pages/PickupsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/usercomponents/ProtectedRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="bins" element={<BinsPage />} />
        <Route path="bins/:id" element={<BinDetailPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Routes (all logged-in users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="request-pickup" element={<PickupRequestPage />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;