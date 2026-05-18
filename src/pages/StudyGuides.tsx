import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Search, Tag } from 'lucide-react';
import { STUDY_GUIDES } from '../content/studyGuides';

const categories = ['All', ...Array.from(new Set(STUDY_GUIDES.map((guide) => guide.category)))];

const StudyGuides: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filteredGuides = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return STUDY_GUIDES.filter((guide) => {
      const matchesCategory = category === 'All' || guide.category === category;
      const matchesQuery =
        !normalizedQuery ||
        [guide.title, guide.description, guide.department, guide.category, ...guide.keyTopics]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-10 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-orange mb-3">
              Study Guides
            </p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-navy-900 dark:text-white mb-5">
              Practical engineering exam guides
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Topic-wise preparation notes for PYQs, semester exams, lab work, viva, and branch subjects.
              Each guide is written to help students revise with clear steps, common mistakes, and answer-writing focus.
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-2xl p-4 md:p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search guides by topic, branch, or keyword..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-navy-700 text-navy-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    category === item
                      ? 'bg-navy-900 text-white border-navy-900 dark:bg-brand-orange dark:border-brand-orange'
                      : 'bg-white dark:bg-navy-950 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-navy-700 hover:border-brand-orange hover:text-brand-orange'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredGuides.map((guide) => (
              <Link
                key={guide.slug}
                to={`/guides/${guide.slug}`}
                className="group bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-brand-orange/40 transition-all flex flex-col min-h-[300px]"
              >
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-brand-orange/10 text-brand-orange text-xs font-bold">
                    <Tag className="h-3.5 w-3.5" />
                    {guide.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    {guide.readingMinutes} min
                  </span>
                </div>

                <BookOpen className="h-8 w-8 text-brand-orange mb-5" />
                <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-3 group-hover:text-brand-orange transition-colors">
                  {guide.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                  {guide.description}
                </p>

                <div className="mt-auto pt-5 border-t border-gray-100 dark:border-navy-800">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {guide.department}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-orange">
                      Read guide <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredGuides.length === 0 && (
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-2xl p-10 text-center">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-2">No guides found</h2>
              <p className="text-gray-600 dark:text-gray-400">Try a different keyword or category.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudyGuides;
