import React from 'react';
import { X, Download, Eye, Share2, FileText, Calendar, Database } from 'lucide-react';
import { PYQ } from '../types';
import { DEPARTMENTS } from '../constants';

interface PYQModalProps {
  isOpen: boolean;
  onClose: () => void;
  pyq: PYQ;
  onShare: () => void;
}

const PYQModal: React.FC<PYQModalProps> = ({ isOpen, onClose, pyq, onShare }) => {
  if (!isOpen) return null;

  const dept = DEPARTMENTS.find(d => d.id === pyq.departmentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white dark:bg-navy-900 rounded-3xl shadow-2xl w-full max-w-lg p-6 border border-gray-100 dark:border-navy-700 transform transition-all scale-100 overflow-hidden">
        
        {/* Header Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange to-red-500" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-navy-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-8 mt-4">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-lg ${dept?.color || 'bg-gray-100'} bg-opacity-20`}>
                <FileText className={`h-10 w-10 ${dept?.color.split(' ')[1] || 'text-gray-600'}`} />
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-3">
                 <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${dept?.color || 'bg-gray-100 text-gray-600'}`}>
                    {dept?.code}
                 </span>
                 <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300">
                    {pyq.year}
                 </span>
            </div>
            
            <h3 className="text-2xl font-display font-bold text-navy-900 dark:text-white leading-tight mb-2 px-4">
                {pyq.title}
            </h3>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {dept?.name} • Semester {pyq.semester}
            </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-navy-950/50 p-4 rounded-2xl border border-gray-100 dark:border-navy-800 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">File Size</span>
                <span className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                    <Database className="h-4 w-4 text-brand-orange" /> {pyq.size}
                </span>
            </div>
            <div className="bg-gray-50 dark:bg-navy-950/50 p-4 rounded-2xl border border-gray-100 dark:border-navy-800 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Exam Type</span>
                <span className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand-orange" /> {pyq.type}
                </span>
            </div>
        </div>

        <div className="flex flex-col gap-3">
            <button className="w-full py-3.5 bg-brand-orange hover:bg-brand-hover text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transform duration-200">
                <Download className="h-5 w-5" /> Download PDF
            </button>
            <div className="flex gap-3">
                <button className="flex-1 py-3.5 text-navy-900 dark:text-white hover:bg-gray-50 dark:hover:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    <Eye className="h-5 w-5" /> Preview
                </button>
                <button 
                    onClick={onShare}
                    className="flex-1 py-3.5 text-navy-900 dark:text-white hover:bg-gray-50 dark:hover:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                    <Share2 className="h-5 w-5" /> Share
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PYQModal;