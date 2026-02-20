import React, { useState } from 'react';
import { Upload, FileText, Book, CheckCircle, AlertCircle, X, Check, Eye } from 'lucide-react';
import { DEPARTMENTS, SEMESTERS, YEARS, PENDING_SUBMISSIONS } from '../constants';
import { PaperType, ApprovalStatus } from '../types';

type Tab = 'pyq' | 'note' | 'review';

const AdminUpload: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('review'); // Default to review for demo
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Review Queue State (Mocked)
  const [pendingItems, setPendingItems] = useState(PENDING_SUBMISSIONS);

  // Form State (for direct upload)
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0].id);
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [year, setYear] = useState(YEARS[0]);
  const [paperType, setPaperType] = useState<PaperType>(PaperType.ENDSEM);
  const [author, setAuthor] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDirectUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a PDF file to upload');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(`${activeTab === 'pyq' ? 'Paper' : 'Note'} uploaded successfully!`);
      setTitle('');
      setFile(null);
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 2000);
  };

  const handleApprove = (id: string) => {
    if(confirm('Are you sure you want to publish this item?')) {
        setPendingItems(prev => prev.filter(item => item.id !== id));
        // In real app, call API to update status to 'published'
        alert('Item published successfully!');
    }
  };

  const handleReject = (id: string) => {
    if(confirm('Reject this submission?')) {
        setPendingItems(prev => prev.filter(item => item.id !== id));
        // In real app, call API to update status to 'rejected'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-12 animate-slide-up transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage content and review student submissions.</p>
        </div>

        <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl border border-gray-100 dark:border-navy-800 overflow-hidden transition-colors">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-navy-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('review')}
              className={`flex-1 py-4 min-w-[120px] text-sm font-medium text-center flex items-center justify-center gap-2 transition-colors relative ${
                activeTab === 'review' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-400 border-b-2 border-blue-600' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-navy-800'
              }`}
            >
              <CheckCircle className="h-4 w-4" /> Review Queue
              {pendingItems.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full absolute top-3 right-4 sm:right-8">
                      {pendingItems.length}
                  </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('pyq')}
              className={`flex-1 py-4 min-w-[120px] text-sm font-medium text-center flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'pyq' 
                  ? 'bg-navy-50 dark:bg-navy-800 text-navy-900 dark:text-white border-b-2 border-brand-orange' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-navy-800'
              }`}
            >
              <FileText className="h-4 w-4" /> Upload PYQ
            </button>
            <button
              onClick={() => setActiveTab('note')}
              className={`flex-1 py-4 min-w-[120px] text-sm font-medium text-center flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'note' 
                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-900 dark:text-orange-400 border-b-2 border-brand-orange' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-navy-800'
              }`}
            >
              <Book className="h-4 w-4" /> Upload Note
            </button>
          </div>

          <div className="p-8">
            {/* Review Queue Content */}
            {activeTab === 'review' && (
                <div className="space-y-6">
                    {pendingItems.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <CheckCircle className="h-12 w-12 mx-auto text-green-400 mb-4" />
                            <p>All caught up! No pending submissions.</p>
                        </div>
                    ) : (
                        pendingItems.map(item => (
                            <div key={item.id} className="border border-gray-200 dark:border-navy-700 rounded-xl p-5 hover:shadow-md transition-shadow bg-gray-50 dark:bg-navy-800">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-1 rounded bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 ${'type' in item ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                                {'type' in item ? 'PYQ' : 'NOTE'}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Submitted by: {item.submittedBy}</span>
                                        </div>
                                        <h3 className="font-bold text-navy-900 dark:text-white text-lg">{item.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                            {DEPARTMENTS.find(d => d.id === item.departmentId)?.name} • Sem {item.semester}
                                            {'year' in item && ` • ${item.year}`}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 self-end md:self-center">
                                        <button className="p-2 text-gray-500 dark:text-gray-300 hover:text-navy-900 dark:hover:text-white bg-white dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-lg shadow-sm" title="View PDF">
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleReject(item.id)}
                                            className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg font-medium transition-colors"
                                        >
                                            Reject
                                        </button>
                                        <button 
                                            onClick={() => handleApprove(item.id)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
                                        >
                                            <Check className="h-4 w-4" /> Approve
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Direct Upload Forms (Existing Logic) */}
            {(activeTab === 'pyq' || activeTab === 'note') && (
                 <form onSubmit={handleDirectUpload} className="space-y-6">
                    {/* Success Message */}
                    {successMsg && (
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" /> {successMsg}
                        </div>
                    )}
                    
                    {/* Common Fields */}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-lg p-3 text-navy-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
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

                     {/* Note Specific Fields */}
                    {activeTab === 'note' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author Name</label>
                        <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g. Rahul S."
                        className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-lg p-3 text-navy-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
                        required
                        />
                    </div>
                    )}

                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload PDF</label>
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navy-50 dark:file:bg-navy-800 file:text-navy-700 dark:file:text-gray-200 hover:file:bg-navy-100 dark:hover:file:bg-navy-700 cursor-pointer" required />
                    </div>

                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all ${
                        isSubmitting ? 'bg-navy-700 cursor-wait' : 'bg-navy-900 dark:bg-brand-orange hover:bg-navy-800 dark:hover:bg-brand-hover'
                    }`}
                    >
                    {isSubmitting ? 'Uploading...' : `Publish ${activeTab === 'pyq' ? 'Paper' : 'Note'}`}
                    </button>
                </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;