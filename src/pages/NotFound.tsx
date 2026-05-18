import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, Search } from 'lucide-react';
import { usePageMeta } from '../utils/seo';

const NotFound: React.FC = () => {
  usePageMeta({
    title: 'Page Not Found - PadhakuPortal',
    description: 'The requested page could not be found. Browse PadhakuPortal study resources, guides, PYQs, and notes.',
    path: window.location.pathname,
    robots: 'noindex,follow',
  });

  return (
    <div className="min-h-[70vh] bg-gray-50 dark:bg-navy-950 flex items-center py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-orange mb-3">404</p>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-navy-900 dark:text-white mb-5">
          This page is not available
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
          The link may be outdated, or the resource may have moved during a site update.
          Use the links below to continue browsing study material.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-navy-900 dark:bg-brand-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-navy-800 dark:hover:bg-brand-hover transition-colors"
          >
            <Home className="h-5 w-5" />
            Go home
          </Link>
          <Link
            to="/sitemap"
            className="inline-flex items-center justify-center gap-2 bg-white dark:bg-navy-900 text-navy-900 dark:text-white border border-gray-200 dark:border-navy-800 px-6 py-3 rounded-xl font-bold hover:border-brand-orange hover:text-brand-orange transition-colors"
          >
            <Search className="h-5 w-5" />
            Open sitemap
          </Link>
          <Link
            to="/guides"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-brand-orange hover:underline"
          >
            Study guides <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
