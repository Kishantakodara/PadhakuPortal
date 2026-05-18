import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ArrowRight, Calendar, CheckCircle, Clock, GraduationCap, ListChecks } from 'lucide-react';
import { getRelatedGuides, getStudyGuideBySlug, SITE_URL } from '../content/studyGuides';
import NotFound from './NotFound';

const StudyGuideView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = getStudyGuideBySlug(slug);
  const path = guide ? `/guides/${guide.slug}` : `/guides/${slug ?? ''}`;

  if (!guide) {
    return <NotFound />;
  }

  const relatedGuides = getRelatedGuides(guide);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-8 animate-slide-up">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-orange transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all guides
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem] gap-8 items-start">
          <article className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-2xl p-6 md:p-10 shadow-sm">
            <header className="mb-10 pb-8 border-b border-gray-100 dark:border-navy-800">
              <div className="flex flex-wrap gap-3 mb-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 dark:bg-brand-orange/10 px-3 py-1 text-xs font-bold text-brand-orange">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {guide.category}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-navy-800 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <Clock className="h-3.5 w-3.5" />
                  {guide.readingMinutes} min read
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold text-navy-900 dark:text-white leading-tight mb-5">
                {guide.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {guide.description}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span>By {guide.author}</span>
                <span className="hidden sm:inline">|</span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Updated {new Date(`${guide.updatedAt}T00:00:00`).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-4">Overview</h2>
                <p>{guide.summary}</p>
                <p>{guide.whyItMatters}</p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-4">Key Topics to Cover</h2>
                <ul className="space-y-3">
                  {guide.keyTopics.map((topic) => (
                    <li key={topic} className="flex gap-3 list-none ml-0">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-4">Recommended Practice Plan</h2>
                <ol className="space-y-4 pl-0">
                  {guide.practicePlan.map((step, index) => (
                    <li key={step} className="flex gap-4 list-none ml-0">
                      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-sm font-bold text-white dark:bg-brand-orange">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-4">Common Mistakes to Avoid</h2>
                <ul className="space-y-3">
                  {guide.commonMistakes.map((mistake) => (
                    <li key={mistake} className="flex gap-3 list-none ml-0">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-1 shrink-0" />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-4">Exam Room Tips</h2>
                <ul className="space-y-3">
                  {guide.examRoomTips.map((tip) => (
                    <li key={tip} className="flex gap-3 list-none ml-0">
                      <ListChecks className="h-5 w-5 text-brand-orange mt-1 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {guide.faqs.map((faq) => (
                    <div key={faq.question} className="rounded-xl border border-gray-100 dark:border-navy-800 bg-gray-50 dark:bg-navy-950 p-5">
                      <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2">{faq.question}</h3>
                      <p className="m-0">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </article>

          <aside className="lg:sticky lg:top-28 space-y-6">
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-2xl p-5">
              <h2 className="text-base font-bold text-navy-900 dark:text-white mb-3">Guide Details</h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Department</dt>
                  <dd className="font-semibold text-navy-900 dark:text-white">{guide.department}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Canonical URL</dt>
                  <dd>
                    <a href={`${SITE_URL}${path}`} className="text-brand-orange hover:underline break-all">
                      {`${SITE_URL}${path}`}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            {relatedGuides.length > 0 && (
              <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-2xl p-5">
                <h2 className="text-base font-bold text-navy-900 dark:text-white mb-4">Related Guides</h2>
                <div className="space-y-3">
                  {relatedGuides.map((related) => (
                    <Link
                      key={related.slug}
                      to={`/guides/${related.slug}`}
                      className="block rounded-xl border border-gray-100 dark:border-navy-800 p-4 hover:border-brand-orange/50 transition-colors group"
                    >
                      <h3 className="font-bold text-sm text-navy-900 dark:text-white group-hover:text-brand-orange transition-colors mb-1">
                        {related.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange">
                        Read next <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default StudyGuideView;
