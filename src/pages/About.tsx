import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
      <article className="bg-white dark:bg-navy-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-navy-800">
        <h1 className="text-4xl font-display font-bold text-navy-900 dark:text-white mb-6">About PadhakuPortal</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
          <p>
            PadhakuPortal is a student-focused educational website created to help engineering students find previous
            year question papers, study notes, revision guides, and practical exam preparation support in one organized
            place.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">Our Purpose</h2>
          <p>
            Students often lose time searching scattered drives, chats, and unofficial folders before every exam.
            PadhakuPortal brings commonly needed academic resources into a clearer structure by branch, semester,
            subject, and resource type. The goal is simple: make preparation easier without encouraging shortcuts,
            plagiarism, or blind dependence on repeated questions.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">What You Can Find Here</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Previous year papers:</strong> PYQs organized with filters for department, semester, year, and paper type.</li>
            <li><strong>Study notes:</strong> Submitted notes and summaries that are reviewed before public listing.</li>
            <li><strong>Study guides:</strong> Original guides on subjects, PYQ strategy, answer writing, lab work, and revision planning.</li>
            <li><strong>AI Tutor:</strong> Academic support for explanations, practice prompts, and concept revision. AI answers should be verified before use.</li>
            <li><strong>Contribution flow:</strong> A way for students to submit useful material for admin review.</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">Editorial and Review Approach</h2>
          <p>
            Public study guides are written for clarity, usefulness, and student safety. Contributed notes and papers are
            reviewed by admins before publication. We aim to remove low-quality uploads, copyrighted material that should
            not be shared, misleading claims, and resources that do not match the educational purpose of the site.
          </p>
          <p>
            PadhakuPortal is not an official university website and does not claim endorsement by any college,
            university, exam board, or government body. Students should cross-check important academic details with
            their official syllabus, faculty instructions, and university notices.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">Contact and Corrections</h2>
          <p>
            If you find incorrect information, want to request removal of material, or need to contact the site team,
            email <a href="mailto:padhakuportal@gmail.com" className="text-brand-orange hover:underline">padhakuportal@gmail.com</a>.
            You can also use the <Link to="/contact" className="text-brand-orange hover:underline">contact page</Link>.
          </p>
        </div>
      </article>
    </div>
  );
};

export default About;
