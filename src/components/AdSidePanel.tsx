import React, { useEffect, useRef } from 'react';
import { Info } from 'lucide-react';

interface AdSidePanelProps {
  className?: string;
  height?: string;
}

const AdSidePanel: React.FC<AdSidePanelProps> = ({ className = '', height = 'min-h-[250px]' }) => {
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

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white dark:bg-navy-900 rounded-3xl shadow-sm border border-gray-200/50 dark:border-navy-800 p-4 flex flex-col items-center text-center overflow-hidden">
        <div className="w-full flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Sponsored</span>
          <Info className="h-3.5 w-3.5 text-gray-300 dark:text-navy-700" />
        </div>
        
        {/* Real Advertisement Container */}
        <div className={`w-full ${height} bg-gray-50/50 dark:bg-navy-950/50 rounded-2xl border border-gray-150 dark:border-navy-800 flex flex-col items-center justify-center p-3 relative overflow-hidden`}>
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
      </div>
    </div>
  );
};

export default AdSidePanel;
