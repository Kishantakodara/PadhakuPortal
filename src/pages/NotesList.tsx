
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, BookOpen, User, Eye, Clock, ChevronDown, SlidersHorizontal, FileText, Loader2 } from 'lucide-react';
import { DEPARTMENTS, SEMESTERS } from '../constants';
import AdPlaceholder from '../components/AdPlaceholder';
import AdSidePanel from '../components/AdSidePanel';
import { supabase } from '../supabaseClient';
import { Note } from '../types';

interface NoteFilterState {
  department: string | 'all';
  semester: number | 'all';
  search: string;
  subject: string | 'all';
}

const NotesList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('createdAt', { ascending: false });
        
        if (error) throw error;
        setNotes(data || []);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotes();
  }, []);

  const [filters, setFilters] = useState<NoteFilterState>({
    department: 'all',
    semester: 'all',
    search: '',
    subject: 'all',
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const subjects = useMemo(() => {
    const uniqueSubjects = new Set<string>();
    notes.forEach(note => {
      // Derive department from storage path for cascading logic
      let effectiveDept = note.departmentId;
      if (note.storagePath && note.storagePath.includes('/')) {
        const parts = note.storagePath.split('/');
        const pathDept = parts.find(p => DEPARTMENTS.some(d => d.id === p));
        if (pathDept) effectiveDept = pathDept;
      }

      const matchDept = filters.department === 'all' || effectiveDept === filters.department;
      const matchSem = filters.semester === 'all' || note.semester === filters.semester;

      if (matchDept && matchSem) {
        if (note.title.includes(',')) {
          uniqueSubjects.add(note.title.split(',')[0].trim());
        } else {
          uniqueSubjects.add(note.title.split(' - ')[0].trim());
        }
      }
    });
    return Array.from(uniqueSubjects).sort();
  }, [notes, filters.department, filters.semester]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const isPublished = (note as any).status !== 'pending';
      
      // Derive department from storage path if possible
      let effectiveDept = note.departmentId;
      if (note.storagePath && note.storagePath.includes('/')) {
        const parts = note.storagePath.split('/');
        const pathDept = parts.find(p => DEPARTMENTS.some(d => d.id === p));
        if (pathDept) effectiveDept = pathDept;
      }

      const matchDept = filters.department === 'all' || effectiveDept === filters.department;
      const matchSem = filters.semester === 'all' || note.semester === filters.semester;
      const matchSearch = note.title.toLowerCase().includes(filters.search.toLowerCase());
      
      const subjectName = note.title.includes(',') ? note.title.split(',')[0].trim() : note.title.split(' - ')[0].trim();
      const matchSubject = filters.subject === 'all' || subjectName === filters.subject;

      return isPublished && matchDept && matchSem && matchSearch && matchSubject;
    });
  }, [filters, notes]);

  const handleFilterChange = (key: keyof NoteFilterState, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // Reset subject if department or semester changes
      if (key === 'department' || key === 'semester') {
        newFilters.subject = 'all';
      }
      return newFilters;
    });
  };

  const FilterSidebar = () => (
    <div className="h-fit sticky top-24 space-y-6">
      <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-100 dark:border-navy-800 p-5 transition-colors">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-lg font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Filter className="h-5 w-5 text-brand-orange" /> Filters
          </h3>
          <button 
            onClick={() => setFilters({ department: 'all', semester: 'all', search: '', subject: 'all' })}
            className="text-xs text-brand-orange hover:underline"
          >
            Reset All
          </button>
        </div>

        {/* Department Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department (Branch)</label>
          <div className="relative">
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg p-2.5 text-sm text-gray-700 dark:text-gray-200 focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Semester Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Semester</label>
          <div className="grid grid-cols-4 gap-2">
            {SEMESTERS.map((sem) => (
              <button
                key={sem}
                onClick={() => handleFilterChange('semester', filters.semester === sem ? 'all' : sem)}
                className={`py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  filters.semester === sem
                    ? 'bg-navy-900 text-white border-navy-900 dark:bg-brand-orange dark:border-brand-orange'
                    : 'bg-white dark:bg-navy-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-navy-700 hover:border-brand-orange hover:text-brand-orange dark:hover:text-brand-orange'
                }`}
              >
                Sem {sem}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
          <div className="relative">
            <select
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg p-2.5 text-sm text-gray-700 dark:text-gray-200 focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      
      {/* Sidebar Ad (visible on LG only) */}
      <div className="hidden lg:block xl:hidden">
        <AdPlaceholder size="rectangle" label="Pro Tutorials" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-8 animate-slide-up transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white mb-2">Study Notes</h1>
          <p className="text-gray-500 dark:text-gray-400">High-quality lecture notes and summaries curated by top students.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="w-full bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 p-3 rounded-lg flex items-center justify-center gap-2 text-navy-900 dark:text-white font-medium shadow-sm"
            >
              <SlidersHorizontal className="h-5 w-5" />
              {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Sidebar (Desktop) / Drawer (Mobile) */}
          <aside className={`w-full lg:w-64 flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar />
          </aside>

          {/* Main Content List */}
          <div className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="bg-white dark:bg-navy-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-navy-800 mb-6 flex items-center gap-3 transition-colors">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics, authors, or keywords..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm text-navy-900 dark:text-white placeholder-gray-400 focus:ring-0"
              />
            </div>
            
            {/* List Ad for Mobile */}
            <div className="lg:hidden mb-6">
              <AdPlaceholder size="leaderboard" />
            </div>

            {/* Results Grid */}
            {isLoading ? (
               <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-100 dark:border-navy-800 p-20 text-center">
                  <Loader2 className="h-10 w-10 text-brand-orange animate-spin mx-auto mb-4" />
                  <p className="text-gray-500 font-medium tracking-tight">Syncing note repository...</p>
               </div>
            ) : filteredNotes.length === 0 ? (
              <div className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-100 dark:border-navy-800 p-12 text-center transition-colors">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No notes found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your department or semester filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNotes.map((note) => {
                  const dept = DEPARTMENTS.find(s => s.id === note.departmentId);
                  return (
                    <Link 
                      key={note.id} 
                      to={`/notes/${note.id}`}
                      className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-100 dark:border-navy-800 p-5 hover:shadow-md hover:border-brand-orange dark:hover:border-brand-orange transition-all group flex flex-col h-full"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dept?.color || 'bg-gray-100'}`}>
                          {dept?.name}
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-navy-700">
                          Sem {note.semester}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
                        {note.title}
                      </h3>
                      
                      <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-50 dark:border-navy-800">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {note.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {note.lastUpdated}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-brand-orange font-medium">
                          <Eye className="h-3 w-3" /> {note.views}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            
            <div className="mt-6 text-center text-xs text-gray-400">
              Showing {filteredNotes.length} results
            </div>

             <div className="mt-8 xl:hidden">
                <AdPlaceholder size="banner" label="Exam Prep Kit" />
            </div>
          </div>

          {/* Right Sidebar (Ads) - Visible on XL */}
          <aside className="hidden xl:block w-72 flex-shrink-0">
             <div className="sticky top-24 space-y-6">
                <AdSidePanel />
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NotesList;
