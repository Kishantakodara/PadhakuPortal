import React, { useState, useEffect } from 'react';
import { Shield, X, Check, ArrowRight } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent-choice');
    if (!consent) {
      // Trigger the slide-in animation after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const consentData = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent-choice', JSON.stringify(consentData));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const consentData = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent-choice', JSON.stringify(consentData));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const consentData = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent-choice', JSON.stringify(consentData));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 sm:bottom-6 left-0 sm:left-6 right-0 sm:right-auto z-50 px-4 pb-4 sm:pb-0 w-full sm:max-w-md animate-slide-up">
      <div className="glass dark:bg-navy-900/90 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-navy-800 p-5 md:p-6 overflow-hidden relative">
        {/* Top brand accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange to-red-500" />
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-brand-orange/10 flex items-center justify-center text-brand-orange flex-shrink-0 mt-0.5">
            <Shield className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h3 className="font-bold text-navy-900 dark:text-white text-base">Cookie Consent</h3>
              <button 
                onClick={handleRejectAll}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {!showPreferences ? (
              <>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  PadhakuPortal uses cookies to deliver reliable, secure academic materials, analyze site traffic, and support free access via Google advertising partners.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button 
                    onClick={handleAcceptAll}
                    className="flex-1 bg-navy-900 dark:bg-brand-orange hover:bg-navy-800 dark:hover:bg-brand-hover text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-1"
                  >
                    Accept All <Check className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => setShowPreferences(true)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-200 text-xs font-medium py-2.5 px-4 rounded-xl transition-colors border border-transparent dark:border-navy-700"
                  >
                    Customize Choice
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3">
                <div className="space-y-2.5 mb-4">
                  {/* Essential */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-navy-950 border border-gray-100 dark:border-navy-900 text-xs">
                    <div>
                      <span className="font-bold text-navy-900 dark:text-white block">Essential Cookies</span>
                      <span className="text-[10px] text-gray-400">Required for website security & database routing.</span>
                    </div>
                    <span className="text-[10px] bg-gray-200 dark:bg-navy-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded font-medium">Always On</span>
                  </div>

                  {/* Analytics */}
                  <label className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-navy-950 border border-gray-100 dark:border-navy-900 text-xs cursor-pointer hover:border-brand-orange/30 transition-colors">
                    <div>
                      <span className="font-bold text-navy-900 dark:text-white block">Performance & Traffic</span>
                      <span className="text-[10px] text-gray-400">Helps us track and improve notes & AI Tutor latency.</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="rounded border-gray-300 text-brand-orange focus:ring-brand-orange h-4 w-4"
                    />
                  </label>

                  {/* Marketing */}
                  <label className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-navy-950 border border-gray-100 dark:border-navy-900 text-xs cursor-pointer hover:border-brand-orange/30 transition-colors">
                    <div>
                      <span className="font-bold text-navy-900 dark:text-white block">Personalized Advertising</span>
                      <span className="text-[10px] text-gray-400">Allows Google AdSense partners to serve relevant ads.</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="rounded border-gray-300 text-brand-orange focus:ring-brand-orange h-4 w-4"
                    />
                  </label>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleSavePreferences}
                    className="flex-1 bg-navy-900 dark:bg-brand-orange hover:bg-navy-800 dark:hover:bg-brand-hover text-white text-xs font-bold py-2 px-3 rounded-lg transition-all"
                  >
                    Save Preferences
                  </button>
                  <button 
                    onClick={() => setShowPreferences(false)}
                    className="text-gray-500 hover:text-navy-950 dark:hover:text-white text-xs font-medium px-2 transition-colors flex items-center gap-0.5"
                  >
                    Back <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
