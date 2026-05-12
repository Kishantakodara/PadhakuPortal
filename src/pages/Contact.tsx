import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-navy-800">
        <h1 className="text-4xl font-display font-bold text-navy-900 dark:text-white mb-6">Contact Us</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-10 text-lg">
          Have a question, suggestion, or experiencing an issue? We'd love to hear from you. Please reach out to us using the information below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-navy-900 dark:text-white">Get in Touch</h3>
            
            <div className="flex items-start gap-4">
              <div className="bg-brand-orange/10 p-3 rounded-xl text-brand-orange">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-navy-900 dark:text-white">Email</h4>
                <p className="text-gray-500 dark:text-gray-400 mt-1">support@padhakuportal.com</p>
                <p className="text-xs text-gray-400 mt-1">We aim to reply within 24 hours.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-navy-900 dark:text-white">Office Location</h4>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  123 University Road,<br />
                  Knowledge City, Education State 400001
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-navy-950 p-6 rounded-2xl border border-gray-100 dark:border-navy-800">
             <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Form submitted!'); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all" placeholder="Your Name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all" placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea rows={4} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all resize-none" placeholder="How can we help?" required></textarea>
                </div>
                <button type="submit" className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold hover:bg-brand-hover transition-colors">
                  Send Message
                </button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
