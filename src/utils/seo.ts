import { useEffect } from 'react';
import { CONTENT_UPDATED_AT, SITE_NAME, SITE_URL, getStudyGuideBySlug } from '../content/studyGuides';

export interface PageMeta {
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article';
  image?: string;
  robots?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const DEFAULT_DESCRIPTION =
  'PadhakuPortal helps engineering students find previous year question papers, study notes, exam guides, and practical revision strategies.';

const STATIC_ROUTE_META: Record<string, PageMeta> = {
  '/': {
    title: 'PadhakuPortal - Engineering Notes, PYQs and Study Guides',
    description: DEFAULT_DESCRIPTION,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        email: 'padhakuportal@gmail.com',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/ai-tutor?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  },
  '/pyqs': {
    title: 'Previous Year Question Papers - PadhakuPortal',
    description: 'Browse engineering previous year question papers by department, semester, year, subject, and exam type.',
  },
  '/notes': {
    title: 'Study Notes Library - PadhakuPortal',
    description: 'Find student-contributed engineering notes and summaries organized by branch, semester, and subject.',
  },
  '/guides': {
    title: 'Engineering Study Guides - PadhakuPortal',
    description: 'Read practical engineering study guides for PYQs, mathematics, core subjects, labs, viva, and exam planning.',
  },
  '/exam-tips': {
    title: 'Exam Tips for Engineering Students - PadhakuPortal',
    description: 'Evidence-aware exam preparation tips covering active recall, spaced repetition, PYQ practice, and answer writing.',
  },
  '/ai-tutor': {
    title: 'AI Tutor for Engineering Study Help - PadhakuPortal',
    description: 'Ask academic questions, revise concepts, and get study support with PadhakuPortal AI Tutor.',
  },
  '/contribute': {
    title: 'Contribute Study Material - PadhakuPortal',
    description: 'Submit notes or previous year question papers for review so other students can benefit from verified study resources.',
  },
  '/about': {
    title: 'About PadhakuPortal',
    description: 'Learn about PadhakuPortal, a student-focused education resource for engineering notes, PYQs, and exam preparation.',
  },
  '/contact': {
    title: 'Contact PadhakuPortal',
    description: 'Contact PadhakuPortal for corrections, privacy questions, content removal requests, and study material support.',
  },
  '/privacypolicy': {
    title: 'Privacy Policy - PadhakuPortal',
    description: 'Read how PadhakuPortal collects, uses, protects, and discloses data, including cookies, analytics, and Google advertising disclosures.',
  },
  '/terms-of-service': {
    title: 'Terms of Service - PadhakuPortal',
    description: 'Review the terms for using PadhakuPortal, contributing content, and accessing study resources.',
  },
  '/terms': {
    title: 'Terms of Service - PadhakuPortal',
    description: 'Review the terms for using PadhakuPortal, contributing content, and accessing study resources.',
  },
  '/disclaimer': {
    title: 'Educational Disclaimer - PadhakuPortal',
    description: 'Read the educational, accuracy, external-link, and contributor-content disclaimer for PadhakuPortal.',
  },
  '/sitemap': {
    title: 'HTML Sitemap - PadhakuPortal',
    description: 'Find all key PadhakuPortal pages, study resources, legal pages, and engineering study guides in one place.',
  },
};

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
};

const upsertLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
};

const upsertJsonLd = (jsonLd: PageMeta['jsonLd']) => {
  const existing = document.getElementById('route-json-ld');
  existing?.remove();

  if (!jsonLd) return;

  const script = document.createElement('script');
  script.id = 'route-json-ld';
  script.type = 'application/ld+json';
  script.text = JSON.stringify(jsonLd);
  document.head.appendChild(script);
};

export const getRouteMeta = (pathname: string): PageMeta => {
  if (pathname.startsWith('/notes/')) {
    return {
      title: 'Study Note - PadhakuPortal',
      description: 'Read an engineering study note on PadhakuPortal with author information, update details, and related revision tools.',
      path: pathname,
      type: 'article',
    };
  }

  if (pathname.startsWith('/guides/')) {
    const slug = pathname.replace('/guides/', '').split('/')[0];
    const guide = getStudyGuideBySlug(slug);

    if (guide) {
      return {
        title: `${guide.title} - PadhakuPortal`,
        description: guide.description,
        path: pathname,
        type: 'article',
        jsonLd: [
          buildArticleJsonLd({
            title: guide.title,
            description: guide.description,
            path: pathname,
            author: guide.author,
            dateModified: guide.updatedAt,
          }),
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Study Guides', path: '/guides' },
            { name: guide.title, path: pathname },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: guide.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ],
      };
    }

    return {
      title: 'Study Guide Not Found - PadhakuPortal',
      description: 'The requested PadhakuPortal study guide could not be found.',
      path: pathname,
      robots: 'noindex,follow',
    };
  }

  return STATIC_ROUTE_META[pathname] ?? {
    title: 'Page Not Found - PadhakuPortal',
    description: 'The requested PadhakuPortal page could not be found. Use the navigation or sitemap to find study resources.',
    path: pathname,
    robots: 'noindex,follow',
  };
};

export const usePageMeta = (meta: PageMeta) => {
  useEffect(() => {
    const path = meta.path ?? window.location.pathname;
    const canonical = `${SITE_URL}${path === '/' ? '' : path}`;
    const title = meta.title.includes(SITE_NAME) ? meta.title : `${meta.title} - ${SITE_NAME}`;
    const description = meta.description || DEFAULT_DESCRIPTION;
    const image = meta.image ?? `${SITE_URL}/logo.png`;

    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: meta.robots ?? 'index,follow' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: meta.type ?? 'website' });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
    upsertLink('canonical', canonical);
    upsertJsonLd(meta.jsonLd);
  }, [meta.description, meta.image, meta.jsonLd, meta.path, meta.robots, meta.title, meta.type]);
};

export const buildBreadcrumbJsonLd = (items: Array<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path === '/' ? '' : item.path}`,
  })),
});

export const buildArticleJsonLd = (input: {
  title: string;
  description: string;
  path: string;
  author: string;
  dateModified?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: input.title,
  description: input.description,
  author: {
    '@type': 'Organization',
    name: input.author,
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
    },
  },
  datePublished: input.dateModified ?? CONTENT_UPDATED_AT,
  dateModified: input.dateModified ?? CONTENT_UPDATED_AT,
  mainEntityOfPage: `${SITE_URL}${input.path}`,
});
