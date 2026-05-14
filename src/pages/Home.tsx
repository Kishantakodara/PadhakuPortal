
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Clock, TrendingUp, Lightbulb, Folder, Megaphone, Calendar, BookOpen, Sparkles, Loader2, ShoppingBag, Tag, Calculator, Cpu } from 'lucide-react';
import { DEPARTMENTS } from '../constants';
import * as Icons from 'lucide-react';
import AdPlaceholder from '../components/AdPlaceholder';
import { supabase } from '../supabaseClient';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('createdAt', { ascending: false })
          .limit(5);

        if (error) throw error;
        setAnnouncements(data || []);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to AI Chat with the query
      navigate(`/ai-tutor?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Helper to render dynamic icons safely
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-6 w-6" /> : <Folder className="h-6 w-6" />;
  };

  return (
    <div className="overflow-x-hidden relative">
      {/* Global Background Pattern */}
      <div className="fixed inset-0 z-[-1] bg-grid-pattern dark:bg-grid-pattern-dark bg-grid opacity-[0.4] pointer-events-none" />

      {/* Hero Section - Mesh Gradient */}
      <div id="hero" className="relative pt-10 pb-20 lg:pt-16 lg:pb-24">
        {/* Soft gradient blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl overflow-hidden z-[-1] opacity-60 dark:opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200 dark:bg-blue-900 blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-lighten" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-orange-100 dark:bg-orange-900 blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-lighten" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 shadow-sm mb-6 animate-fade-in-up">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Semester 4 exams approaching!</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-navy-900 dark:text-white mb-6 tracking-tight animate-fade-in-up-delay-1 opacity-0">
            <Link to="/" className="group inline-flex flex-col items-center">
              <span className="text-sm font-bold text-brand-orange mb-2 tracking-[0.3em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">PadhakuPortal</span>
              <span>The Smarter Way</span>
            </Link>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">to Study.</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delay-2 opacity-0">
            Everything you need to ace your college exams in one place.
            <span className="font-semibold text-navy-900 dark:text-white"> PYQs, Notes, and AI Help.</span>
          </p>

          <div className="animate-fade-in-up-delay-2 opacity-0">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group z-20">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-orange transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn today?"
                className="block w-full pl-12 pr-32 py-5 rounded-2xl border-2 border-transparent bg-white dark:bg-navy-800/80 text-gray-900 placeholder-gray-400 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:border-brand-orange/30 focus:ring-4 focus:ring-brand-orange/10 transition-all dark:text-white dark:placeholder-gray-500 backdrop-blur-xl"
              />
              <div className="absolute inset-y-2 right-2">
                <button type="submit" className="h-full bg-navy-900 text-white px-6 rounded-xl font-medium hover:bg-navy-800 transition-all hover:scale-105 shadow-lg shadow-navy-900/20 flex items-center gap-2 dark:bg-brand-orange dark:hover:bg-brand-hover animate-pulse-slow">
                  Ask AI
                </button>
              </div>
            </form>

            <div className="mt-6 flex justify-center gap-3 flex-wrap text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">Trending:</span>
              <div className="flex gap-2">
                {['Data Structures', 'Thermodynamics', 'Calculus'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/ai-tutor?q=${encodeURIComponent('Explain ' + tag)}`)}
                    className="bg-white dark:bg-navy-800 px-3 py-1 rounded-full border border-gray-200 dark:border-navy-700 hover:border-brand-orange dark:hover:border-brand-orange transition-colors text-xs"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access - Colorful Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/pyqs" className="relative overflow-hidden bg-white dark:bg-navy-900 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-navy-800 animate-fade-in-up opacity-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:rotate-6 transition-transform">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">Latest PYQs</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">Access past exam papers from the last semester to prepare effectively.</p>
              <div className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400">
                Browse Papers <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link to="/notes" className="relative overflow-hidden bg-white dark:bg-navy-900 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-navy-800 animate-fade-in-up-delay-1 opacity-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 dark:bg-orange-900/20 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center text-brand-orange mb-6 group-hover:rotate-6 transition-transform">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-2 group-hover:text-brand-orange transition-colors">Study Notes</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">High-quality lecture notes and summaries curated by top students.</p>
              <div className="flex items-center text-sm font-bold text-brand-orange">
                Read Notes <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Featured Card - Adaptive Style (Light/Dark) */}
          <Link
            to="/exam-tips"
            id="featured-card-tips"
            className="relative overflow-hidden bg-white dark:bg-[#0f172a] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-navy-800 animate-fade-in-up-delay-2 opacity-0"
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 dark:bg-yellow-900/20 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"
            />
            <div className="relative z-10 text-left">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-2xl flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-6 group-hover:rotate-6 transition-transform">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">Exam Tips</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">Strategies and shortcuts from toppers to maximize your score.</p>
              <div className="flex items-center text-sm font-bold text-yellow-600 dark:text-yellow-400">
                Learn More <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Bento Grid Layout for Announcements & Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Announcements - Span 2 */}
          <div className="lg:col-span-2 bg-white dark:bg-navy-900 rounded-3xl border border-gray-100 dark:border-navy-800 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-xl text-red-600 dark:text-red-400">
                  <Megaphone className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-navy-900 dark:text-white">Notice Board</h2>
              </div>
              <button onClick={() => alert('Notice board coming soon!')} className="text-sm text-gray-500 hover:text-navy-900 font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {loadingAnnouncements ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <p className="text-sm">Loading announcements...</p>
                </div>
              ) : announcements.length > 0 ? (
                announcements.map((item) => (
                  <div key={item.id} className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-navy-800/50 border border-transparent hover:border-gray-200 dark:hover:border-navy-700 hover:bg-white dark:hover:bg-navy-800 transition-all cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0 bg-brand-orange" />
                      <div>
                        <h3 className="font-semibold text-navy-900 dark:text-gray-100 group-hover:text-brand-orange transition-colors text-sm md:text-base">{item.text}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString()
                              : 'Just now'}
                          </span>
                          <span className="relative overflow-hidden text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-navy-700 dark:text-blue-400 group-hover:shadow-sm">
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[100%] group-hover:animate-shimmer" />
                            <span className="relative">New</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-brand-orange transition-colors hidden sm:block" />
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 text-sm italic">
                  No active announcements at the moment. Check back later!
                </div>
              )}
            </div>
          </div>

          {/* Ad Space - Span 1 */}
          <div className="h-full">
            <AdPlaceholder size="rectangle" className="h-full min-h-[300px] rounded-3xl shadow-none border border-dashed border-gray-300 dark:border-navy-700 bg-gray-50/50 dark:bg-navy-900/50" label="Sponsored" />
          </div>
        </div>
      </div>


      {/* Departments */}
      <div className="bg-white dark:bg-navy-900 py-16 border-t border-gray-100 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-4">Browse by Department</h2>
            <p className="text-gray-500 dark:text-gray-400">Find materials specific to your engineering branch.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {DEPARTMENTS.map((dept) => (
              <Link
                key={dept.id}
                to={`/pyqs?department=${dept.id}`}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 dark:bg-navy-950 border border-gray-100 dark:border-navy-800 hover:bg-white hover:shadow-lg hover:border-gray-200 dark:hover:bg-navy-800 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${dept.color} bg-opacity-10 dark:bg-opacity-20 group-hover:scale-110 group-hover:animate-wiggle transition-transform duration-300`}>
                  {renderIcon(dept.iconName)}
                </div>
                <h3 className="font-bold text-navy-900 dark:text-white text-sm text-center">{dept.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{dept.code}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-navy-900 to-blue-900 dark:from-navy-800 dark:to-navy-900 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl text-center md:text-left">
          {/* Abstract Shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none animate-blob mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange opacity-20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none animate-blob mix-blend-overlay" style={{ animationDelay: '2s' }}></div>

          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">Share your Knowledge</h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-8 md:mb-0">
              Join thousands of students contributing to the largest open-source study material repository. Help your juniors ace their exams.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link to="/contribute" className="relative overflow-hidden bg-brand-orange text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-hover transition-all shadow-lg shadow-orange-500/20 transform hover:-translate-y-1 text-center group">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[100%] group-hover:animate-shimmer" />
              <span className="relative">Upload Notes</span>
            </Link>
            <a href="https://chat.whatsapp.com/JKjcvjun6roIkbat7O59uJ" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all text-center flex items-center justify-center">
              Join Community
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
