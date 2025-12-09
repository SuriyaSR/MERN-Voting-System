import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Layouts
import AuthLayout from './layout/AuthLayout';
import MainLayout from './layout/MainLayout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import PollList from './pages/PollList';
import CreatePoll from './pages/CreatePoll';
import ViewPoll from './pages/ViewPoll';
import PollResults from './pages/PollResults';
import MyPolls from './pages/MyPolls';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes (Auth) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes (Main App) */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/polls" replace />} />
          <Route path="/polls" element={<PollList />} />
          <Route path="/polls/create" element={<CreatePoll />} />
          <Route path="/polls/mine" element={<MyPolls />} />
          <Route path="/polls/:id" element={<ViewPoll />} />
          <Route path="/polls/:id/results" element={<PollResults />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/polls" replace />} />
      </Routes>
    </>
  );
};

export default App;
