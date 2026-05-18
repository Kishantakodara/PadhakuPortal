import React, { useEffect, useRef } from 'react';

interface AdPlaceholderProps {
  className?: string;
  size?: 'banner' | 'rectangle' | 'leaderboard';
  label?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ className = '', size = 'banner', label = 'Sponsored' }) => {
  const containerRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if the script is already present in this instance to avoid duplicates
    const existingScript = containerRef.current.querySelector('script');
    if (existingScript) return;

    const script = document.createElement('script');
    script.src = 'https://data527.click/js/responsive.js';
    script.async = true;
    
    containerRef.current.appendChild(script);
  }, []);

  const heightClass = size === 'rectangle' ? 'min-h-[250px]' : size === 'leaderboard' ? 'min-h-[90px]' : 'min-h-[120px]';
  
  return (
    <div className={`bg-white dark:bg-navy-900 border border-gray-200/50 dark:border-navy-800 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group ${heightClass} ${className} transition-colors p-4 w-full shadow-sm`}>
      {/* Subtle label showing it's a sponsored unit */}
      <span className="absolute top-3 right-4 text-[9px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 bg-gray-50/80 dark:bg-navy-950/80 px-2 py-0.5 rounded border border-gray-150 dark:border-navy-800 pointer-events-none z-10">
        {label}
      </span>
      
      {/* Real Advertisement Container */}
      <div className="w-full flex justify-center items-center py-2 z-0">
        <ins
          ref={containerRef as any}
          style={{ width: '0px', height: '0px', display: 'inline-block' }}
          data-width="0"
          data-height="0"
          className="eb40b3652c7"
          data-domain="//data527.click"
          data-affquery="/104387d53f36fc600a7b/b40b3652c7/?placementName=Adverticement"
        />
      </div>
    </div>
  );
};

export default AdPlaceholder;