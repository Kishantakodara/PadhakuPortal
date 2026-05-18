
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
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
import ExamTips from './pages/ExamTips';
import StudyGuides from './pages/StudyGuides';
import StudyGuideView from './pages/StudyGuideView';
import Sitemap from './pages/Sitemap';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';
import BulkUpload from './pages/BulkUpload';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/pyqs" element={<PYQList />} />
            <Route path="/notes" element={<NotesList />} />
            <Route path="/notes/:id" element={<NoteView />} />
            <Route path="/ai-tutor" element={<AIChat />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/guides" element={<StudyGuides />} />
            <Route path="/guides/:slug" element={<StudyGuideView />} />
            
            {/* Legal / AdSense Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy%20policy" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy" element={<Navigate to="/privacy%20policy" replace />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/terms" element={<Navigate to="/terms-of-service" replace />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/exam-tips" element={<ExamTips />} />
            
            <Route path="/bulk-upload" element={<BulkUpload />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AuthProvider>
      <Analytics />
      <SpeedInsights />
    </Router>
  );
};

export default App;
