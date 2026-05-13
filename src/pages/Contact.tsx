import React, { useState } from 'react';
import { Mail, MapPin, Phone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    formData.append('access_key', '510341b5-dde2-41cf-9465-a2f7f6fee02c');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
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
                <p className="text-gray-500 dark:text-gray-400 mt-1">padhakuportal@gmail.com</p>
                <p className="text-xs text-gray-400 mt-1">We aim to reply within 24 hours.</p>
              </div>
            </div>

          </div>

          <div className="bg-gray-50 dark:bg-navy-950 p-6 rounded-2xl border border-gray-100 dark:border-navy-800">
             <form className="space-y-4" onSubmit={handleSubmit}>
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl flex items-center gap-3">
                    <CheckCircle className="h-5 w-5" />
                    <span>Message sent successfully! We will get back to you soon.</span>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl flex items-center gap-3">
                    <AlertCircle className="h-5 w-5" />
                    <span>Something went wrong. Please try again later.</span>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input type="text" name="name" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all" placeholder="Your Name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input type="email" name="email" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all" placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea name="message" rows={4} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all resize-none" placeholder="How can we help?" required></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold hover:bg-brand-hover transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Sending...</>
                  ) : (
                    'Send Message'
                  )}
                </button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
