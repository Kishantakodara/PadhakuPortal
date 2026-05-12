import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-navy-800">
        <h1 className="text-4xl font-display font-bold text-navy-900 dark:text-white mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">1. Terms</h2>
          <p>
            By accessing this Website, accessible from PadhakuPortal, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on PadhakuPortal's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose or for any public display;</li>
            <li>attempt to reverse engineer any software contained on PadhakuPortal's Website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">3. Disclaimer</h2>
          <p>
            All the materials on PadhakuPortal's Website are provided "as is". PadhakuPortal makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, PadhakuPortal does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">4. Limitations</h2>
          <p>
            PadhakuPortal or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on PadhakuPortal's Website, even if PadhakuPortal or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4">5. Revisions and Errata</h2>
          <p>
            The materials appearing on PadhakuPortal's Website may include technical, typographical, or photographic errors. PadhakuPortal will not promise that any of the materials in this Website are accurate, complete, or current. PadhakuPortal may change the materials contained on its Website at any time without notice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
