import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-navy-800">
        <h1 className="text-4xl font-display font-bold text-navy-900 dark:text-white mb-6">Disclaimer</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
          <p>
            If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at support@padhakuportal.com.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">Disclaimers for PadhakuPortal</h2>
          <p>
            All the information on this website - padhakuportal.com - is published in good faith and for general information and educational purposes only. PadhakuPortal does not make any warranties about the completeness, reliability, and accuracy of this information. Any action you take upon the information you find on this website (PadhakuPortal), is strictly at your own risk. PadhakuPortal will not be liable for any losses and/or damages in connection with the use of our website.
          </p>
          <p>
            The study materials, notes, and previous year question papers (PYQs) provided on this platform are uploaded by students and contributors. While we strive to ensure quality, we do not guarantee the absolute accuracy of the academic content. Students are advised to cross-verify the material with their official university syllabus and professors.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">External Links</h2>
          <p>
            From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">Consent</h2>
          <p>
            By using our website, you hereby consent to our disclaimer and agree to its terms.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">Update</h2>
          <p>
            Should we update, amend or make any changes to this document, those changes will be prominently posted here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
