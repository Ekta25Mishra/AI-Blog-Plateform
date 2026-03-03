import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './features/notification/components/NotificationToast';
import PushPermissionPrompt from './features/notification/components/PushPermissionPrompt';
import Loader from './components/ui/Loader';
import './App.css'

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Home = lazy(() => import('./pages/Home'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const BlogForm = lazy(() => import('./pages/BlogForm'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const NotificationPreferences = lazy(() => import('./pages/NotificationPreferences'));
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/ToastContainer';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="d-flex justify-content-center mt-5">
      <Loader />
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <Suspense fallback={
      <div className="d-flex justify-content-center mt-5">
        <Loader />
      </div>
    }>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Home />} />
        <Route path="/blogs/new" element={
          <ProtectedRoute>
            <BlogForm />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/blogs/:id/edit" element={
          <ProtectedRoute>
            <BlogForm />
          </ProtectedRoute>
        } />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/users/:id/edit" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/notifications/preferences" element={
          <ProtectedRoute>
            <NotificationPreferences />
          </ProtectedRoute>
        } />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <ToastProvider>
        <ScrollToTop />
        <AuthProvider>
          <NotificationProvider>
            <ToastContainer />
            <Navbar />
            <NotificationToast />
            <PushPermissionPrompt />
            <div style={{ flex: 1, width: '100%' }}>
              <AppRoutes />
            </div>
            <Footer />
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  )
}

export default App
