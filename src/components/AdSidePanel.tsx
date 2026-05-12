
import React from 'react';
import { Info } from 'lucide-react';

interface AdSidePanelProps {
  className?: string;
  height?: string;
}

const AdSidePanel: React.FC<AdSidePanelProps> = ({ className = '', height = 'h-[600px]' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-gray-100 dark:border-navy-800 p-4 flex flex-col items-center text-center overflow-hidden">
        <div className="w-full flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Advertisement</span>
            <Info className="h-3 w-3 text-gray-300" />
        </div>
        
        {/* Ad Content / Placeholder simulating AdSense Vertical Unit */}
        <div className={`w-full ${height} bg-gray-50 dark:bg-navy-950 rounded-xl border border-gray-100 dark:border-navy-800 flex flex-col items-center justify-center group relative overflow-hidden`}>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full pointer-events-none" />
            
            {/* Mock Ad Content */}
            <div className="p-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-blue-500 font-bold text-xl">Ads</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400 font-bold text-lg mb-1">Master Coding</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 max-w-[150px] leading-relaxed">
                    Join the top rated course for Full Stack Development today.
                </span>
                
                <button className="mt-6 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm">
                    Learn More
                </button>
            </div>

            <div className="absolute bottom-2 text-[10px] text-gray-300 dark:text-gray-700 font-mono">
                Google AdSense
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdSidePanel;
