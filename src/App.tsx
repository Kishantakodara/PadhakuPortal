
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PYQList from './pages/PYQList';
import NoteView from './pages/NoteView';
import NotesList from './pages/NotesList';
import AdminDashboard from './pages/AdminDashboard'; // Replacing AdminUpload
import AdminLogin from './pages/AdminLogin';
import Contribute from './pages/Contribute';
import AIChat from './pages/AIChat';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Disclaimer from './pages/Disclaimer';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pyqs" element={<PYQList />} />
            <Route path="/notes" element={<NotesList />} />
            <Route path="/notes/:id" element={<NoteView />} />
            <Route path="/ai-tutor" element={<AIChat />} />
            <Route path="/contribute" element={<Contribute />} />
            
            {/* Legal / AdSense Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;
