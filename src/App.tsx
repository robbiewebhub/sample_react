
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfileIdRedirect from '@/components/ProfileIdRedirect';
import Index from '@/pages/Index';
import Profile from '@/pages/Profile';
import UserProfile from '@/pages/UserProfile';
import Auth from '@/pages/Auth';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Search from '@/pages/Search';
import Explore from '@/pages/Explore';
import NotFound from '@/pages/NotFound';
import Messages from '@/pages/Messages';
import Notifications from '@/pages/Notifications';
import AdManagement from '@/pages/AdManagement';
import About from '@/pages/About';
import Privacy from '@/pages/Privacy';
import TermsOfService from '@/pages/TermsOfService';
import AdvertiseWithUs from '@/pages/AdvertiseWithUs';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" enableSystem>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/profile/:username" element={<UserProfile />} />
                {/* Legacy UUID route - redirect to the appropriate username-based URL */}
                <Route path="/profile/id/:userId" element={<ProfileIdRedirect />} />
                {/* Catch UUID format in username param and redirect */}
                <Route 
                  path="/profile/:userId([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})" 
                  element={<ProfileIdRedirect />} 
                />
                <Route path="/search" element={<Search />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="/messages/:conversationId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/ad-management" element={<ProtectedRoute><AdManagement /></ProtectedRoute>} />
                {/* Update routes for the new pages */}
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/advertise" element={<AdvertiseWithUs />} />
                {/* Since we don't have a Post page component yet, we'll redirect to home */}
                <Route path="/post/:postId" element={<Navigate to="/" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
