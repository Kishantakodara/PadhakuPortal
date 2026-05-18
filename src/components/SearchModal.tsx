import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, Clock, BookOpen, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { DEPARTMENTS } from '../constants';
import { STUDY_GUIDES } from '../content/studyGuides';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [pyqs, setPyqs] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus input on open
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      // Load index data from Supabase for fast local search filtering
      const loadSearchIndex = async () => {
        setLoading(true);
        try {
          const [notesRes, pyqsRes] = await Promise.all([
            supabase.from('notes').select('id, title, author, semester, departmentId, status').order('createdAt', { ascending: false }),
            supabase.from('pyqs').select('id, title, year, type, semester, departmentId, status').order('createdAt', { ascending: false })
          ]);
          
          if (notesRes.data) {
            setNotes(notesRes.data.filter(n => n.status !== 'pending'));
          }
          if (pyqsRes.data) {
            setPyqs(pyqsRes.data.filter(p => p.status !== 'pending'));
          }
        } catch (e) {
          console.error('Error loading search database index:', e);
        } finally {
          setLoading(false);
        }
      };

      loadSearchIndex();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Perform search filtering
  const filteredNotes = query.trim() === '' ? [] : notes.filter(n => 
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    n.author.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredPyqs = query.trim() === '' ? [] : pyqs.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.year.toString().includes(query)
  ).slice(0, 5);

  const filteredGuides = query.trim() === '' ? [] : STUDY_GUIDES.filter(g => 
    g.title.toLowerCase().includes(query.toLowerCase()) ||
    g.description.toLowerCase().includes(query.toLowerCase()) ||
    g.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const hasResults = filteredNotes.length > 0 || filteredPyqs.length > 0 || filteredGuides.length > 0;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 pb-4 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-md animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="w-full max-w-2xl bg-white dark:bg-navy-900 rounded-3xl border border-white/20 dark:border-navy-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-navy-800">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search notes, PYQs, exam guides, subjects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-base text-navy-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0"
          />
          {loading && <Loader2 className="h-4 w-4 text-brand-orange animate-spin" />}
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-navy-800 text-gray-400 hover:text-navy-900 dark:hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-5 scrollbar-thin">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <Sparkles className="h-8 w-8 text-brand-orange/40 mx-auto mb-3 animate-pulse" />
              <p className="text-sm font-medium">Type to search the portal repository</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Access verified notes, previous year question papers, and study guides instantly.</p>
              
              <div className="mt-6 text-left max-w-md mx-auto">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 text-center">Popular Academic Searches</span>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Data Structures', 'Mathematics', 'Python', 'Semester 4', 'Operating Systems'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="text-xs bg-gray-50 dark:bg-navy-850 hover:bg-orange-50 dark:hover:bg-brand-orange/10 hover:text-brand-orange dark:hover:text-brand-orange border border-gray-100 dark:border-navy-800 rounded-full px-3 py-1.5 font-medium transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : !hasResults ? (
            <div className="text-center py-10 text-gray-400 dark:text-gray-500">
              <p className="text-sm font-bold">No academic materials match "{query}"</p>
              <p className="text-xs mt-1">Try adjusting your terms or check our AI Tutor page for instant explanations.</p>
              <button
                onClick={() => handleNavigate(`/ai-tutor?q=${encodeURIComponent(query)}`)}
                className="mt-4 inline-flex items-center gap-2 bg-navy-900 dark:bg-brand-orange hover:bg-navy-800 dark:hover:bg-brand-hover text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all"
              >
                Ask AI Tutor about "{query}"
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Study Guides section */}
              {filteredGuides.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-brand-orange" /> Curated Study Guides
                  </h4>
                  <div className="space-y-2">
                    {filteredGuides.map((guide) => (
                      <div
                        key={guide.slug}
                        onClick={() => handleNavigate(`/guides/${guide.slug}`)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-navy-850 border border-transparent hover:border-brand-orange/20 cursor-pointer group transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-brand-orange uppercase">{guide.category}</span>
                          <h5 className="text-sm font-bold text-navy-900 dark:text-white group-hover:text-brand-orange transition-colors truncate">{guide.title}</h5>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{guide.description}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 dark:text-navy-700 group-hover:translate-x-1 group-hover:text-brand-orange transition-all ml-3 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes section */}
              {filteredNotes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-blue-500" /> Hand-written Study Notes
                  </h4>
                  <div className="space-y-2">
                    {filteredNotes.map((note) => {
                      const dept = DEPARTMENTS.find(d => d.id === note.departmentId);
                      return (
                        <div
                          key={note.id}
                          onClick={() => handleNavigate(`/notes/${note.id}`)}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-navy-850 border border-transparent hover:border-brand-orange/20 cursor-pointer group transition-all"
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold">{dept?.name || 'Engineering'}</span>
                              <span className="text-[10px] bg-gray-100 dark:bg-navy-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded font-bold">Sem {note.semester}</span>
                            </div>
                            <h5 className="text-sm font-bold text-navy-900 dark:text-white group-hover:text-brand-orange transition-colors truncate">{note.title}</h5>
                            <p className="text-xs text-gray-400 mt-0.5">Uploaded by {note.author}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-300 dark:text-navy-700 group-hover:translate-x-1 group-hover:text-brand-orange transition-all flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PYQs section */}
              {filteredPyqs.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-orange-500" /> Previous Year Question Papers
                  </h4>
                  <div className="space-y-2">
                    {filteredPyqs.map((pyq) => {
                      const dept = DEPARTMENTS.find(d => d.id === pyq.departmentId);
                      return (
                        <div
                          key={pyq.id}
                          onClick={() => handleNavigate(`/pyqs?search=${encodeURIComponent(pyq.title)}`)}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-navy-850 border border-transparent hover:border-brand-orange/20 cursor-pointer group transition-all"
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded font-bold">{dept?.code || 'Engineering'}</span>
                              <span className="text-[10px] bg-gray-100 dark:bg-navy-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded font-bold">Sem {pyq.semester}</span>
                              <span className="text-[10px] bg-red-50 dark:bg-red-950/30 text-red-600 px-1.5 py-0.5 rounded font-bold">{pyq.type}</span>
                            </div>
                            <h5 className="text-sm font-bold text-navy-900 dark:text-white group-hover:text-brand-orange transition-colors truncate">{pyq.title}</h5>
                            <p className="text-xs text-gray-400 mt-0.5">Exam Year: {pyq.year}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-300 dark:text-navy-700 group-hover:translate-x-1 group-hover:text-brand-orange transition-all flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer shortcuts */}
        <div className="px-5 py-3.5 bg-gray-50 dark:bg-navy-950 border-t border-gray-100 dark:border-navy-800 flex items-center justify-between text-[11px] text-gray-400 font-medium">
          <span>Search index is fully active</span>
          <div className="flex items-center gap-3">
            <span><kbd className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-750 px-1.5 py-0.5 rounded shadow-sm mr-1 font-sans">ESC</kbd> to close</span>
            <span><kbd className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-750 px-1.5 py-0.5 rounded shadow-sm mr-1 font-sans">↵</kbd> to select</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
