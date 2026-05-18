
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bot, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { getRouteMeta, usePageMeta } from '../utils/seo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  usePageMeta(getRouteMeta(location.pathname));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) =>
    (path === '/' ? location.pathname === '/' : location.pathname === path || location.pathname.startsWith(`${path}/`))
      ? 'text-brand-orange font-semibold bg-orange-50 dark:bg-navy-800/50'
      : 'text-gray-600 dark:text-gray-300 hover:text-navy-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-navy-800/50';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-navy-950 text-slate-900 dark:text-gray-100 transition-colors duration-300">

      {/* Floating Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pb-2 pointer-events-none">
        <nav className={`mx-auto max-w-6xl rounded-2xl transition-all duration-300 pointer-events-auto border border-white/20 shadow-sm ${scrolled
          ? 'glass shadow-lg py-2 px-4'
          : 'bg-white/90 dark:bg-navy-900/90 backdrop-blur-sm py-3 px-6 border-transparent'
          }`}>
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-navy-900 dark:text-white font-display hidden lg:block whitespace-nowrap">
                Padhaku<span className="text-brand-orange">Portal</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/" className={`${isActive('/')} transition-all px-4 py-2 rounded-full text-sm font-medium`}>Home</Link>
              <Link to="/pyqs" className={`${isActive('/pyqs')} transition-all px-4 py-2 rounded-full text-sm font-medium`}>PYQs</Link>
              <Link to="/notes" className={`${isActive('/notes')} transition-all px-4 py-2 rounded-full text-sm font-medium`}>Notes</Link>
              <Link to="/guides" className={`${isActive('/guides')} transition-all px-4 py-2 rounded-full text-sm font-medium`}>Guides</Link>

              <div className="w-px h-6 bg-gray-200 dark:bg-navy-700 mx-2"></div>

              <Link to="/ai-tutor" className={`transition-all px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 ${location.pathname === '/ai-tutor'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-navy-800 text-blue-600 dark:text-blue-400'
                }`}>
                <Bot className="h-4 w-4" /> AI Tutor
              </Link>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />

              <Link to="/admin" className="p-2 text-gray-400 hover:text-navy-900 dark:hover:text-white transition-colors">
                <User className="h-5 w-5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-full bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="block h-5 w-5" /> : <Menu className="block h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 space-y-1 border-t border-gray-100 dark:border-navy-700 mt-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-medium text-navy-900 dark:text-white hover:bg-gray-50 dark:hover:bg-navy-800">Home</Link>
              <Link to="/pyqs" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800">PYQs</Link>
              <Link to="/notes" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800">Notes</Link>
              <Link to="/guides" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800">Guides</Link>
              <Link to="/ai-tutor" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-medium text-brand-orange bg-orange-50 dark:bg-navy-800/50 flex items-center gap-2">
                <Bot className="h-4 w-4" /> AI Tutor
              </Link>

              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800">
                Admin Login
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-navy-900 border-t border-gray-200 dark:border-navy-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 group mb-4">
                <div className="bg-navy-900 dark:bg-transparent p-1.5 rounded-lg">
                  <img src="/logo.png" alt="PadhakuPortal Logo" className="h-8 w-auto object-contain" />
                </div>
                <span className="text-lg font-bold text-navy-900 dark:text-white font-display">
                  Padhaku<span className="text-brand-orange">Portal</span>
                </span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Your academic success partner. Access study materials, notes, and exam papers in one organized place.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-navy-900 dark:text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/pyqs" className="hover:text-brand-orange transition-colors">Previous Year Papers</Link></li>
                <li><Link to="/notes" className="hover:text-brand-orange transition-colors">Lecture Notes</Link></li>
                <li><Link to="/guides" className="hover:text-brand-orange transition-colors">Study Guides</Link></li>
                <li><Link to="/exam-tips" className="hover:text-brand-orange transition-colors">Exam Tips</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-navy-900 dark:text-white mb-4">PadhakuPortal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/about" className="hover:text-brand-orange transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-brand-orange transition-colors">Contact Us</Link></li>
                <li><Link to="/contribute" className="hover:text-brand-orange transition-colors">Contribute Material</Link></li>
                <li><Link to="/sitemap" className="hover:text-brand-orange transition-colors">Sitemap</Link></li>
                <li><a href="https://chat.whatsapp.com/JKjcvjun6roIkbat7O59uJ" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">Join Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-navy-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/privacy%20policy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-brand-orange transition-colors">Terms of Service</Link></li>
                <li><Link to="/disclaimer" className="hover:text-brand-orange transition-colors">Disclaimer</Link></li>
                <li><Link to="/sitemap" className="hover:text-brand-orange transition-colors">HTML Sitemap</Link></li>
                <li><Link to="/admin" className="hover:text-brand-orange transition-colors mt-2 block opacity-50 hover:opacity-100">Admin Login</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-navy-800 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} PadhakuPortal Education. Built for students, by students.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
