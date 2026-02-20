
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PYQList from './pages/PYQList';
import NoteView from './pages/NoteView';
import NotesList from './pages/NotesList';
import AdminUpload from './pages/AdminUpload';
import Contribute from './pages/Contribute';
import AIChat from './pages/AIChat';
import AssignmentSolver from './pages/AssignmentSolver';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pyqs" element={<PYQList />} />
          <Route path="/notes" element={<NotesList />} />
          <Route path="/notes/:id" element={<NoteView />} />
          <Route path="/ai-tutor" element={<AIChat />} />
          <Route path="/assignment-solver" element={<AssignmentSolver />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/admin" element={<AdminUpload />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
