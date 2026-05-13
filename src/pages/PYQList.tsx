
import React, { useState, useMemo, useEffect } from 'react';
import { Filter, FileText, ChevronDown, Search, SlidersHorizontal, X, ChevronRight, Eye, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { DEPARTMENTS, YEARS, SEMESTERS } from '../constants';
import { PaperType, FilterState, PYQ } from '../types';
import AdPlaceholder from '../components/AdPlaceholder';
import AdSidePanel from '../components/AdSidePanel';
import ShareModal from '../components/ShareModal';
import PYQModal from '../components/PYQModal';
import { supabase } from '../supabaseClient';

const PYQList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [pyqs, setPyqs] = useState<PYQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPyqs = async () => {
      try {
        const { data, error } = await supabase
          .from('pyqs')
          .select('*')
          .order('createdAt', { ascending: false });
        
        if (error) throw error;
        setPyqs(data || []);
      } catch (err) {
        console.error("Error fetching pyqs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPyqs();
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    department: searchParams.get('department') || 'all',
    semester: searchParams.get('semester') && !isNaN(Number(searchParams.get('semester'))) ? Number(searchParams.get('semester')) : 'all',
    year: searchParams.get('year') && !isNaN(Number(searchParams.get('year'))) ? Number(searchParams.get('year')) : 'all',
    type: (searchParams.get('type') as PaperType) || 'all',
    search: searchParams.get('search') || '',
    subject: 'all',
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [shareItem, setShareItem] = useState<{ title: string, url?: string } | null>(null);
  const [selectedPYQ, setSelectedPYQ] = useState<PYQ | null>(null);

  const subjects = useMemo(() => {
    const uniqueSubjects = new Set<string>();
    pyqs.forEach(pyq => {
      // Derive department from storage path for cascading logic
      let effectiveDept = pyq.departmentId;
      if (pyq.storagePath && pyq.storagePath.includes('/')) {
        const parts = pyq.storagePath.split('/');
        const pathDept = parts.find(p => DEPARTMENTS.some(d => d.id === p));
        if (pathDept) effectiveDept = pathDept;
      }

      const matchDept = filters.department === 'all' || effectiveDept === filters.department;
      const matchSem = filters.semester === 'all' || pyq.semester === filters.semester;

      if (matchDept && matchSem) {
        // Standard format: Subject,Code,SeasonYear
        if (pyq.title.includes(',')) {
          uniqueSubjects.add(pyq.title.split(',')[0].trim());
        } else {
          // Fallback for old titles
          const baseName = pyq.title.replace(/\s+PYQ\s+.+$/i, '').trim();
          if (baseName) uniqueSubjects.add(baseName);
        }
      }
    });
    return Array.from(uniqueSubjects).sort();
  }, [pyqs, filters.department, filters.semester]);

  const filteredPYQs = useMemo(() => {
    return pyqs.filter((pyq) => {
      const isPublished = (pyq as any).status !== 'pending';
      
      // Derive department from storage path if possible: "admin/it/pyqs/..." -> "it"
      let effectiveDept = pyq.departmentId;
      if (pyq.storagePath && pyq.storagePath.includes('/')) {
        const parts = pyq.storagePath.split('/');
        // New structure: admin/[dept]/pyqs/ or bulk/[dept]/pyqs/ or submissions/[dept]/pyqs/
        // We look for any part that matches a valid department ID
        const pathDept = parts.find(p => DEPARTMENTS.some(d => d.id === p));
        if (pathDept) effectiveDept = pathDept;
      }

      const matchDept = filters.department === 'all' || effectiveDept === filters.department;
      const matchSem = filters.semester === 'all' || pyq.semester === filters.semester;
      const matchYear = filters.year === 'all' || pyq.year === filters.year;
      const matchType = filters.type === 'all' || pyq.type === filters.type;
      const matchSearch = pyq.title.toLowerCase().includes(filters.search.toLowerCase());
      
      const subjectName = pyq.title.includes(',') ? pyq.title.split(',')[0].trim() : pyq.title.replace(/\s+PYQ\s+.+$/i, '').trim();
      const matchSubject = filters.subject === 'all' || subjectName === filters.subject;

      return isPublished && matchDept && matchSem && matchYear && matchType && matchSearch && matchSubject;
    });
  }, [filters, pyqs]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
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
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-gray-100 dark:border-navy-800 p-6">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-navy-800 pb-4">
          <h3 className="text-lg font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Filter className="h-4 w-4 text-brand-orange" /> 
            Filters
          </h3>
          <button 
            onClick={() => setFilters({ department: 'all', semester: 'all', year: 'all', type: 'all', search: '', subject: 'all' })}
            className="text-xs font-medium text-brand-orange hover:text-brand-hover transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Department Filter */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Department</label>
          <div className="relative">
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Semester Filter */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Semester</label>
          <div className="grid grid-cols-4 gap-2">
            {SEMESTERS.map((sem) => (
              <button
                key={sem}
                onClick={() => handleFilterChange('semester', filters.semester === sem ? 'all' : sem)}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  filters.semester === sem
                    ? 'bg-navy-900 text-white border-navy-900 dark:bg-brand-orange dark:border-brand-orange shadow-md'
                    : 'bg-white dark:bg-navy-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-navy-700 hover:border-brand-orange/50 hover:text-brand-orange'
                }`}
              >
                {sem}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Filter */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Subject</label>
          <div className="relative">
            <select
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Year Filter */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Year</label>
          <div className="space-y-1 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-navy-800 cursor-pointer group transition-colors">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium group-hover:text-navy-900 dark:group-hover:text-white">All Years</span>
              <input
                type="radio"
                name="year"
                checked={filters.year === 'all'}
                onChange={() => handleFilterChange('year', 'all')}
                className="h-4 w-4 text-brand-orange focus:ring-brand-orange border-gray-300"
              />
            </label>
            {YEARS.map(year => (
              <label key={year} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-navy-800 cursor-pointer group transition-colors">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium group-hover:text-navy-900 dark:group-hover:text-white">{year}</span>
                <input
                  type="radio"
                  name="year"
                  checked={filters.year === year}
                  onChange={() => handleFilterChange('year', year)}
                  className="h-4 w-4 text-brand-orange focus:ring-brand-orange border-gray-300"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sidebar Ad for smaller screens (hidden on XL where right sidebar takes over) */}
      <div className="hidden lg:block xl:hidden">
        <AdPlaceholder size="rectangle" className="rounded-2xl" label="Relevant Course" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-navy-950 py-8 animate-slide-up transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-navy-900 dark:text-white mb-2">Paper Library</h1>
          <p className="text-gray-500 dark:text-gray-400">Filter and find specific exam papers.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="w-full bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 p-4 rounded-xl flex items-center justify-center gap-2 text-navy-900 dark:text-white font-bold shadow-sm"
            >
              <SlidersHorizontal className="h-5 w-5" />
              {isMobileFilterOpen ? 'Hide Filters' : 'Filter Papers'}
            </button>
          </div>

          {/* Left Sidebar (Filters) */}
          <aside className={`w-full lg:w-64 flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar />
          </aside>

          {/* Main Content List */}
          <div className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="bg-white dark:bg-navy-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-navy-800 mb-6 flex items-center transition-colors focus-within:ring-2 focus-within:ring-brand-orange/20 focus-within:border-brand-orange/50">
              <div className="p-3 text-gray-400">
                  <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search by paper title..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-navy-900 dark:text-white placeholder-gray-400 focus:ring-0"
              />
              {filters.search && (
                  <button onClick={() => handleFilterChange('search', '')} className="p-3 text-gray-400 hover:text-red-500">
                      <X className="h-4 w-4" />
                  </button>
              )}
            </div>
            
            {/* Results List (Card Style Rows) */}
            <div className="space-y-3">
              {isLoading ? (
                <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 p-20 text-center">
                    <Loader2 className="h-10 w-10 text-brand-orange animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium tracking-tight">Accessing digital library...</p>
                </div>
              ) : filteredPYQs.length === 0 ? (
                <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 p-16 text-center">
                  <div className="bg-gray-50 dark:bg-navy-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                     <FileText className="h-10 w-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 dark:text-white">No papers found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                filteredPYQs.map((pyq) => {
                  const dept = DEPARTMENTS.find(s => s.id === pyq.departmentId);
                  return (
                    <div 
                      key={pyq.id} 
                      onClick={() => setSelectedPYQ(pyq)}
                      className="bg-white dark:bg-navy-900 rounded-xl p-4 border border-gray-100 dark:border-navy-800 hover:shadow-md hover:border-brand-orange/30 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${dept?.color || 'bg-gray-100'} bg-opacity-20`}>
                                <span className="text-xs font-bold uppercase">{dept?.code}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-navy-900 dark:text-white text-base mb-1 group-hover:text-brand-orange transition-colors">{pyq.title}</h4>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="bg-gray-100 dark:bg-navy-800 px-2 py-0.5 rounded font-medium">Sem {pyq.semester}</span>
                                    <span>•</span>
                                    <span>{pyq.year}</span>
                                    <span>•</span>
                                    <span className={`${
                                        pyq.type === PaperType.MIDSEM ? 'text-yellow-600' : 
                                        pyq.type === PaperType.ENDSEM ? 'text-red-600' : 
                                        'text-green-600'
                                    } font-medium`}>{pyq.type}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 border-gray-50 dark:border-navy-800 pt-3 sm:pt-0">
                            <span className="text-xs text-gray-400 font-medium mr-2">{pyq.size}</span>
                            <div className="flex items-center text-brand-orange text-sm font-bold group-hover:underline decoration-2 decoration-brand-orange underline-offset-4">
                                View <ChevronRight className="h-4 w-4 ml-1" />
                            </div>
                        </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="mt-6 text-center text-xs font-medium text-gray-400">
              Showing {filteredPYQs.length} papers
            </div>

             <div className="mt-8 xl:hidden">
                <AdPlaceholder size="banner" className="rounded-2xl" label="Study Gear" />
            </div>
          </div>

          {/* Right Sidebar (Ads) - Visible only on XL screens */}
          <aside className="hidden xl:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
                <AdSidePanel />
                <AdPlaceholder size="rectangle" className="h-[250px] rounded-2xl" label="University News" />
            </div>
          </aside>

        </div>
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={!!shareItem}
        onClose={() => setShareItem(null)}
        title={shareItem?.title || ''}
      />

      {/* Detail Modal */}
      {selectedPYQ && (
        <PYQModal 
          isOpen={!!selectedPYQ}
          onClose={() => setSelectedPYQ(null)}
          pyq={selectedPYQ}
          onShare={() => setShareItem({ title: selectedPYQ.title })}
        />
      )}
    </div>
  );
};

export default PYQList;
