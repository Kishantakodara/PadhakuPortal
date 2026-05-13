import React, { useState } from 'react';
import { Upload, FileText, Book, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEPARTMENTS, SEMESTERS, YEARS } from '../constants';
import { PaperType } from '../types';
import { supabase } from '../supabaseClient';

type UploadType = 'pyq' | 'note';

const Contribute: React.FC = () => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<UploadType>('pyq');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0].id);
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [year, setYear] = useState(YEARS[0]);
  const [paperType, setPaperType] = useState<PaperType>(PaperType.ENDSEM);
  const [author, setAuthor] = useState(''); // For notes
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsSubmitting(true);
    
    try {
      // 1. Upload to Supabase Storage
      // Path structure: submissions/pyqs/ or submissions/notes/
      const typeFolder = activeTab === 'pyq' ? 'pyqs' : 'notes';
      const storagePath = `submissions/${department}/${typeFolder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('Document')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('Document')
        .getPublicUrl(storagePath);

      // 3. Insert into Database with 'pending' status
      const commonData = {
        title,
        departmentId: department,
        semester,
        pdfUrl: publicUrl,
        storagePath: storagePath,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0
      };

      if (activeTab === 'pyq') {
        const { error: dbError } = await supabase.from('pyqs').insert({
          ...commonData,
          year,
          type: paperType
        });
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('notes').insert({
          ...commonData,
          author,
        });
        if (dbError) throw dbError;
      }

      setStep(3); // Success state
    } catch (error: any) {
      console.error('Submission Error:', error);
      alert('Failed to submit: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="animate-fade-in-up">
      <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">What are you uploading?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => { setActiveTab('pyq'); setStep(2); }}
          className="p-6 border-2 border-gray-100 dark:border-navy-800 hover:border-brand-orange dark:hover:border-brand-orange rounded-xl text-left group transition-all hover:shadow-md dark:bg-navy-900"
        >
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full w-fit mb-4 group-hover:scale-110 transition-transform">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-bold text-navy-900 dark:text-white mb-1">Question Paper (PYQ)</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Upload Midsem, Endsem, or Quiz papers.</p>
        </button>

        <button
          onClick={() => { setActiveTab('note'); setStep(2); }}
          className="p-6 border-2 border-gray-100 dark:border-navy-800 hover:border-brand-orange dark:hover:border-brand-orange rounded-xl text-left group transition-all hover:shadow-md dark:bg-navy-900"
        >
          <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-full w-fit mb-4 group-hover:scale-110 transition-transform">
            <Book className="h-6 w-6 text-brand-orange" />
          </div>
          <h3 className="font-bold text-navy-900 dark:text-white mb-1">Study Notes</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Share your lecture notes or summaries.</p>
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <form onSubmit={handleSubmit} className="animate-fade-in-up space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-navy-900 dark:text-white">Enter Details</h2>
        <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-brand-orange dark:text-gray-400 dark:hover:text-brand-orange">
          Change Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-lg p-3 text-navy-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
            className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-lg p-3 text-navy-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
          >
            {SEMESTERS.map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title / Subject Name</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={activeTab === 'pyq' ? "e.g. Data Structures End Sem 2023" : "e.g. Binary Trees Detailed Notes"}
          className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-lg p-3 text-navy-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-orange outline-none"
          required
        />
      </div>

      {activeTab === 'pyq' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-lg p-3 text-navy-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
            >
              {YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paper Type</label>
            <select
              value={paperType}
              onChange={(e) => setPaperType(e.target.value as PaperType)}
              className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-lg p-3 text-navy-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
            >
              {Object.values(PaperType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {activeTab === 'note' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author Name (Your Name)</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. John Doe"
            className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-lg p-3 text-navy-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-orange outline-none"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload PDF</label>
        <input 
          type="file" 
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navy-50 dark:file:bg-navy-800 file:text-navy-700 dark:file:text-gray-200 hover:file:bg-navy-100 dark:hover:file:bg-navy-700 cursor-pointer"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold hover:bg-brand-hover transition-colors shadow-lg disabled:opacity-70"
      >
        {isSubmitting ? 'Submitting...' : 'Submit for Review'}
      </button>
    </form>
  );

  const renderStep3 = () => (
    <div className="text-center animate-fade-in-up py-8">
      <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Submission Received!</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Thank you for contributing. Your {activeTab === 'pyq' ? 'paper' : 'note'} has been sent to the admins for approval. It will be live once verified.
      </p>
      <div className="flex justify-center gap-4">
        <button 
            onClick={() => { setStep(1); setTitle(''); setFile(null); }}
            className="bg-navy-900 dark:bg-brand-orange text-white px-6 py-2 rounded-lg hover:bg-navy-800 dark:hover:bg-brand-hover transition-colors"
        >
            Upload Another
        </button>
        <Link to="/" className="px-6 py-2 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800">
            Go Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-12 transition-colors">
      <div className="max-w-2xl mx-auto px-4">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Contribute to UniStack</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Help your juniors by sharing study resources.</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-10 space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-brand-orange text-white' : 'bg-gray-200 dark:bg-navy-800 text-gray-500 dark:text-gray-400'}`}>1</div>
            <div className={`h-1 w-10 ${step >= 2 ? 'bg-brand-orange' : 'bg-gray-200 dark:bg-navy-800'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-brand-orange text-white' : 'bg-gray-200 dark:bg-navy-800 text-gray-500 dark:text-gray-400'}`}>2</div>
            <div className={`h-1 w-10 ${step >= 3 ? 'bg-brand-orange' : 'bg-gray-200 dark:bg-navy-800'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-brand-orange text-white' : 'bg-gray-200 dark:bg-navy-800 text-gray-500 dark:text-gray-400'}`}>3</div>
        </div>

        <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl border border-gray-100 dark:border-navy-800 p-8 transition-colors">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Admins review all submissions to ensure quality and relevance.</span>
        </div>
      </div>
    </div>
  );
};

export default Contribute;