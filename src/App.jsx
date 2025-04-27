import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/layout/Layout';
import Pricing from './pages/pricing/Pricing';
import SignupPage from './components/Initial-Render/auth/singnup/index';
import SignInPage from './components/Initial-Render/auth/signin/index';
import Home from './components/Initial-Render/home/index';
import Dashboard from './components/student/dasboard/Dashboard';
import DoubtsPage from './components/student/doubts/Doubts';
import ProfilePage from './components/student/profile/Profile';
import QueriesPage from './components/student/queries/Queries';
import AboutPage from './pages/about';
import TeacherProfilePage from './components/teacher/profile/Profile';
import TeacherEarningsPage from './components/teacher/earnings/Earnings';
import TeacherDoubtsPage from './components/teacher/doubts/Doubts';
import OTPVerificationPage from './components/Initial-Render/auth/verify-otp';
import AdminPage from './pages/admin';
import signuporloginStore from './zustand/login-signup/store';

function App() {
  // Get authentication state and initializer from store
  const initializeUserData = signuporloginStore(state => state.initializeUserData);
  const isAuthenticated = signuporloginStore(state => state.isAuthenticated);
  const [dataInitialized, setDataInitialized] = useState(false);

  useEffect(() => {
    // Initialize user data from localStorage
    initializeUserData();
    
    // Mark initialization as complete
    setDataInitialized(true);
    
    // For debugging
    console.log('Auth check on initialization:', isAuthenticated);
  }, []);

  // Fix the typo and define correct routes
  const privateRoutes = [
    { path: '/student/dashboard', component: Dashboard },
    { path: '/student/doubts', component: DoubtsPage },
    { path: '/student/profile', component: ProfilePage },
    { path: '/student/queries', component: QueriesPage },
    { path: '/teacher/profile', component: TeacherProfilePage},
    { path: '/teacher/earnings', component: TeacherEarningsPage},
    { path: '/teacher/doubts', component: TeacherDoubtsPage},
    { path: '/admin', component: AdminPage }
  ];
  
  // Wait until data is initialized before rendering routes
  if (!dataInitialized) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  console.log('isAuthenticated from store:', isAuthenticated);
  
  return (
    <Router>
      <Layout>
        <ToastContainer />
        <Routes>
          {/* Public Routes */} 
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/verify" element={<OTPVerificationPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Protected Routes - ONLY use the mapping approach */}
          {privateRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                isAuthenticated ? 
                  React.createElement(route.component) : 
                  <Navigate to="/login" state={{ from: route.path }} />
              }
            />
          ))}

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
