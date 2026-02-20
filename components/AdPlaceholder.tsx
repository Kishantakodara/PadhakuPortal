import React from 'react';

interface AdPlaceholderProps {
  className?: string;
  size?: 'banner' | 'rectangle' | 'leaderboard';
  label?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ className = '', size = 'banner', label = 'Advertisement' }) => {
  const heightClass = size === 'rectangle' ? 'h-64' : size === 'leaderboard' ? 'h-24' : 'h-32';
  
  return (
    <div className={`bg-gray-100/80 dark:bg-navy-800/50 border border-gray-200 dark:border-navy-700 rounded-lg flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 relative overflow-hidden group ${heightClass} ${className} transition-colors`}>
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent w-full h-full pointer-events-none" />
      
      <div className="flex flex-col items-center z-10">
        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300 dark:text-gray-600 border border-gray-300 dark:border-navy-600 px-2 py-0.5 rounded mb-2 bg-white/50 dark:bg-navy-900/50">
          {label}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
          Sponsored Content
        </span>
      </div>
    </div>
  );
};

export default AdPlaceholder;