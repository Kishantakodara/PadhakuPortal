import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-navy-800">
        <h1 className="text-4xl font-display font-bold text-navy-900 dark:text-white mb-6">About Us</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
          <p>
            Welcome to <strong>PadhakuPortal</strong>, the ultimate academic companion built exclusively for students. Our mission is to democratize education by providing a centralized, accessible, and high-quality repository of study materials.
          </p>
          
          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">Our Vision</h2>
          <p>
            We believe that finding the right study material should not be a hurdle in a student's academic journey. Whether it's last-minute revision notes, previous year question papers (PYQs), or specific assignment solutions, PadhakuPortal aims to be the one-stop destination for all your educational needs.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">What We Offer</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Curated Notes:</strong> High-quality, verified lecture notes from top-performing students.</li>
            <li><strong>PYQ Database:</strong> An extensive archive of past examination papers to help you understand question patterns.</li>
            <li><strong>AI Tutor:</strong> A state-of-the-art AI study companion to help answer complex academic queries instantly.</li>
            <li><strong>Community Driven:</strong> A platform where students can contribute and help their peers succeed.</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">The Team</h2>
          <p>
            PadhakuPortal is maintained by a dedicated group of student developers and educators who understand the common pain points of university life. We are continuously working to improve the platform and add features that directly benefit the student community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
