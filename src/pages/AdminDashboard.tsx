import React, { useState, useEffect } from 'react';
import { Upload, FileText, Book, CheckCircle, AlertCircle, X, Trash2, Megaphone, Loader2 } from 'lucide-react';
import { DEPARTMENTS, SEMESTERS, YEARS } from '../constants';
import { PaperType } from '../types';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseAdmin } from '../supabaseClient';

import BulkUpload from './BulkUpload';

type Tab = 'manage-pyqs' | 'manage-notes' | 'manage-announcements' | 'bulk-upload' | 'submissions';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('manage-pyqs');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Data State
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0].id);
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [year, setYear] = useState(YEARS[0]);
  const [paperType, setPaperType] = useState<PaperType>(PaperType.ENDSEM);
  const [author, setAuthor] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fetchData = async () => {
    setIsLoadingData(true);

    try {
      if (activeTab === 'submissions') {
        const { data: pyqSubs } = await supabase.from('pyqs').select('*').eq('status', 'pending');
        const { data: noteSubs } = await supabase.from('notes').select('*').eq('status', 'pending');

        const allSubs = [
          ...(pyqSubs || []).map(s => ({ ...s, type: 'pyq' })),
          ...(noteSubs || []).map(s => ({ ...s, type: 'note' }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setPendingSubmissions(allSubs);
      } else {
        const collectionName = activeTab === 'manage-pyqs' ? 'pyqs' : activeTab === 'manage-notes' ? 'notes' : 'announcements';

        const query = supabase.from(collectionName).select('*');

        // Only show published items in the main management tabs (optional, or show all)
        if (activeTab === 'manage-pyqs' || activeTab === 'manage-notes') {
          query.neq('status', 'pending');
        }

        const { data, error } = await query.order('createdAt', { ascending: false });

        if (error) throw error;

        if (activeTab === 'manage-pyqs') setPyqs(data || []);
        else if (activeTab === 'manage-notes') setNotes(data || []);
        else if (activeTab === 'manage-announcements') setAnnouncements(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDirectUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const collectionName = activeTab === 'manage-pyqs' ? 'pyqs' : activeTab === 'manage-notes' ? 'notes' : 'announcements';
    if (activeTab !== 'manage-announcements' && !file) {
      setErrorMsg('Please select a PDF file to upload');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (activeTab === 'manage-announcements') {
        console.log('Publishing announcement...');
        const { error: insertError } = await supabase.from('announcements').insert({
          text: announcementText,
          createdAt: new Date().toISOString()
        });
        if (insertError) throw insertError;
        setAnnouncementText('');
        setSuccessMsg('Announcement posted successfully!');
      } else {
        console.log(`Uploading file for ${activeTab} to Supabase Storage...`);
        const typeFolder = activeTab === 'manage-pyqs' ? 'pyqs' : 'notes';
        // New structure: admin/[dept]/[type]/[filename]
        const fileName = `admin/${department}/${typeFolder}/${Date.now()}_${file!.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('Document')
          .upload(fileName, file!);

        if (uploadError) {
          console.error("Supabase Storage Upload Failed:", uploadError);
          throw new Error(`Storage Error: ${uploadError.message}`);
        }

        console.log('File uploaded, getting public URL...');
        const { data: urlData } = supabase.storage.from('Document').getPublicUrl(fileName);
        const downloadUrl = urlData.publicUrl;
        const storagePath = fileName;


        const commonData = {
          title,
          departmentId: department,
          semester,
          pdfUrl: downloadUrl,
          storagePath: storagePath,
          status: 'published',  // Admin uploads are published immediately — no approval needed
          createdAt: new Date().toISOString(),
          views: 0,
          likes: 0
        };

        console.log('Saving document to Supabase...');
        if (activeTab === 'manage-pyqs') {
          const { error: insertError } = await supabase.from('pyqs').insert({
            ...commonData,
            year,
            type: paperType
          });
          if (insertError) throw insertError;
          setSuccessMsg('PYQ uploaded successfully!');
        } else if (activeTab === 'manage-notes') {
          const { error: insertError } = await supabase.from('notes').insert({
            ...commonData,
            author,
            topics: []
          });
          if (insertError) throw insertError;
          setSuccessMsg('Note uploaded successfully!');
        }

        // Reset forms
        setTitle('');
        setFile(null);
      }

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error("PUBLISH ERROR:", err);
      setErrorMsg(err.message || 'Failed to upload/save data');
      alert(`System Error: ${err.message || 'Failed to publish'}`);
      fetchData(); // Refresh data
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, storagePath?: string, pdfUrl?: string) => {
    const table = activeTab === 'manage-pyqs' ? 'pyqs' : activeTab === 'manage-notes' ? 'notes' : 'announcements';
    console.log(`Deleting from ${table} with ID: ${id}, storagePath: ${storagePath}`);

    try {
      // 1. Delete database record first
      const { error: deleteError, status } = await supabase.from(table).delete().eq('id', id);
      if (deleteError) throw deleteError;
      console.log(`DB delete status: ${status}`);

      // 2. Resolve the storage path — use storagePath field, or extract from pdfUrl for old records
      let resolvedPath = storagePath;
      if (!resolvedPath && pdfUrl) {
        // Extract path after "/Document/" from the public URL
        const match = pdfUrl.match(/\/Document\/(.+)$/);
        if (match) resolvedPath = match[1];
        console.log(`Derived storagePath from pdfUrl: ${resolvedPath}`);
      }

      // 3. Delete file from Supabase Storage using admin client (bypasses RLS)
      if (resolvedPath) {
        const { error: storageError } = await supabaseAdmin.storage.from('Document').remove([resolvedPath]);
        if (storageError) {
          console.error('Storage delete failed:', storageError.message);
          alert(`⚠️ DB record deleted, but storage file was NOT removed.\nError: ${storageError.message}`);
        } else {
          console.log(`✅ Storage file deleted: ${resolvedPath}`);
        }
      } else {
        console.warn('Could not resolve a storage path — storage file was NOT deleted.');
      }

      setSuccessMsg(`Deleted successfully.`);
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchData();
    } catch (err: any) {
      console.error('DELETE ERROR:', err);
      alert(`Delete Failed: ${err.message || 'Check your Supabase RLS delete policies'}`);
      fetchData();
    }
  };

  const handleApprove = async (id: string, type: 'pyq' | 'note') => {
    const table = type === 'pyq' ? 'pyqs' : 'notes';
    try {
      const { error } = await supabase.from(table).update({ status: 'published' }).eq('id', id);
      if (error) throw error;
      setSuccessMsg('Submission approved and published!');
      fetchData();
    } catch (err: any) {
      alert('Approval failed: ' + err.message);
    }
  };

  const handleReject = async (id: string, type: 'pyq' | 'note', storagePath?: string) => {
    const table = type === 'pyq' ? 'pyqs' : 'notes';
    console.log(`Rejecting submission from ${table} with ID: ${id}`);
    try {
      const { error: deleteError } = await supabase.from(table).delete().eq('id', id);
      if (deleteError) throw deleteError;

      if (storagePath) {
        const { error: storageError } = await supabaseAdmin.storage.from('Document').remove([storagePath]);
        if (storageError) {
          console.error('Storage delete failed:', storageError.message);
          alert(`⚠️ DB record deleted but storage file NOT removed.\nReason: ${storageError.message}`);
        }
      }

      setSuccessMsg('Submission rejected and removed.');
      fetchData();
    } catch (err: any) {
      console.error('REJECT ERROR:', err);
      alert('Rejection failed: ' + (err.message || 'Check Supabase RLS delete policies'));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-12 animate-slide-up transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Manage all system data, files, and records securely.</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-red-800 rounded-lg font-medium transition-colors">
            Secure Logout
          </button>
        </div>

        <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl border border-gray-100 dark:border-navy-800 overflow-hidden transition-colors">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-navy-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('manage-pyqs')}
              className={`flex-1 py-4 min-w-[120px] text-sm font-medium text-center flex items-center justify-center gap-2 transition-colors ${activeTab === 'manage-pyqs'
                  ? 'bg-navy-50 dark:bg-navy-800 text-navy-900 dark:text-white border-b-2 border-brand-orange'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-navy-800'
                }`}
            >
              <FileText className="h-4 w-4" /> Manage PYQs
            </button>
            <button
              onClick={() => setActiveTab('manage-notes')}
              className={`flex-1 py-4 min-w-[120px] text-sm font-medium text-center flex items-center justify-center gap-2 transition-colors ${activeTab === 'manage-notes'
                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-900 dark:text-orange-400 border-b-2 border-brand-orange'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-navy-800'
                }`}
            >
              <Book className="h-4 w-4" /> Manage Notes
            </button>
            <button
              onClick={() => setActiveTab('manage-announcements')}
              className={`flex-1 py-4 min-w-[120px] text-sm font-medium text-center flex items-center justify-center gap-2 transition-colors ${activeTab === 'manage-announcements'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-400 border-b-2 border-brand-orange'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-navy-800'
                }`}
            >
              <Megaphone className="h-4 w-4" /> Manage Announcements
            </button>
            <button
              onClick={() => setActiveTab('bulk-upload')}
              className={`flex-1 py-4 min-w-[120px] text-sm font-medium text-center flex items-center justify-center gap-2 transition-colors ${activeTab === 'bulk-upload'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-400 border-b-2 border-brand-orange'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-navy-800'
                }`}
            >
              <Upload className="h-4 w-4" /> Bulk Upload
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex-1 py-4 min-w-[120px] text-sm font-medium text-center flex items-center justify-center gap-2 transition-colors ${activeTab === 'submissions'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-400 border-b-2 border-brand-orange'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-navy-800'
                }`}
            >
              <CheckCircle className="h-4 w-4" /> Submissions
              {pendingSubmissions.length > 0 && (
                <span className="ml-1 bg-brand-orange text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {pendingSubmissions.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'bulk-upload' ? (
            <div className="p-8">
              <BulkUpload embedded={true} />
            </div>
          ) : activeTab === 'submissions' ? (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-navy-900 dark:text-white">Review Submissions</h3>
                <span className="text-sm text-gray-500">{pendingSubmissions.length} pending reviews</span>
              </div>

              {successMsg && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" /> {successMsg}
                </div>
              )}

              {pendingSubmissions.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-navy-950 rounded-2xl border-2 border-dashed border-gray-200 dark:border-navy-800">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-500 dark:text-gray-400">All caught up! No pending submissions.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingSubmissions.map(sub => (
                    <div key={sub.id} className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${sub.type === 'pyq' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-brand-orange'}`}>
                          {sub.type}
                        </span>
                        <span className="text-xs text-gray-400">{new Date(sub.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-navy-900 dark:text-white mb-2 line-clamp-2">{sub.title}</h4>
                      <p className="text-xs text-gray-500 mb-4">
                        Dept: {sub.departmentId} • Sem: {sub.semester}
                        {sub.author && ` • By: ${sub.author}`}
                        {sub.year && ` • Year: ${sub.year}`}
                      </p>

                      <div className="mt-auto space-y-3">
                        <a
                          href={sub.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-navy-800 text-navy-900 dark:text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-navy-700 transition-colors"
                        >
                          <FileText className="h-4 w-4" /> View PDF
                        </a>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(sub.id, sub.type)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(sub.id, sub.type, sub.storagePath)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Left Side: Adding Form */}
              <div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-6">
                  Add New {activeTab === 'manage-pyqs' ? 'PYQ' : activeTab === 'manage-notes' ? 'Note' : 'Announcement'}
                </h3>
                <form onSubmit={handleDirectUpload} className="space-y-6">
                  {successMsg && (
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" /> {successMsg}
                    </div>
                  )}
                  {errorMsg && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" /> {errorMsg}
                    </div>
                  )}

                  {activeTab === 'manage-announcements' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Announcement Text</label>
                      <textarea
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-lg p-3 text-navy-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
                        rows={4}
                        required
                      />
                    </div>
                  ) : (
                    <>
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

                      {activeTab === 'manage-pyqs' && (
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

                      {activeTab === 'manage-notes' && (
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
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            id="file-upload"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            required
                          />
                          <label
                            htmlFor="file-upload"
                            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-navy-700 rounded-xl p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
                          >
                            <Upload className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {file ? file.name : 'Click to select PDF file'}
                            </span>
                          </label>
                          {file && (
                            <div className="flex items-center justify-between bg-brand-orange/10 p-2 rounded-lg text-xs text-brand-orange font-medium">
                              <span className="truncate">{file.name}</span>
                              <button type="button" onClick={() => setFile(null)}><X className="h-4 w-4" /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all ${isSubmitting ? 'bg-navy-700 cursor-wait' : 'bg-navy-900 dark:bg-brand-orange hover:bg-navy-800 dark:hover:bg-brand-hover'
                      }`}
                  >
                    {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Publishing...</> : 'Publish to Database'}
                  </button>
                </form>
              </div>

              {/* Right Side: List & Delete */}
              <div className="bg-gray-50 dark:bg-navy-950 p-6 rounded-2xl border border-gray-200 dark:border-navy-800 max-h-[700px] overflow-y-auto">
                <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-6 sticky top-0 bg-gray-50 dark:bg-navy-950 pb-2 z-10 flex items-center justify-between border-b dark:border-navy-800">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-brand-orange rounded-full" />
                    Manage Repository
                  </span>
                  <button
                    onClick={fetchData}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-navy-800 rounded-full transition-colors"
                    title="Refresh Data"
                  >
                    <Loader2 className={`h-5 w-5 text-brand-orange ${isLoadingData ? 'animate-spin' : ''}`} />
                  </button>
                </h3>

                <div className="space-y-4">
                  {!isLoadingData && activeTab === 'manage-pyqs' && pyqs.map(item => (
                    <div key={item.id} className="bg-white dark:bg-navy-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-navy-800 flex items-center justify-between gap-4 group/item hover:border-brand-orange/50 transition-colors">
                      <div className="min-w-0">
                        <h4 className="font-bold text-navy-900 dark:text-white line-clamp-1 group-hover/item:text-brand-orange transition-colors">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">{item.departmentId} • Sem {item.semester} • {item.year}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id, item.storagePath, item.pdfUrl)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0 transition-all hover:scale-110 active:scale-95"
                        title="Delete Record"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}

                  {!isLoadingData && activeTab === 'manage-notes' && notes.map(item => (
                    <div key={item.id} className="bg-white dark:bg-navy-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-navy-800 flex items-center justify-between gap-4 hover:border-brand-orange/50 transition-colors">
                      <div className="min-w-0">
                        <h4 className="font-bold text-navy-900 dark:text-white line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 font-medium italic">By {item.author} • {item.departmentId}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id, item.storagePath, item.pdfUrl)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0 transition-all hover:scale-110 active:scale-95"
                        title="Delete Record"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}

                  {!isLoadingData && activeTab === 'manage-announcements' && announcements.map(item => (
                    <div key={item.id} className="bg-white dark:bg-navy-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-navy-800 flex items-center justify-between gap-4 hover:border-brand-orange/50 transition-colors">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-brand-orange uppercase mb-1">Announcement</p>
                        <p className="text-sm text-navy-900 dark:text-gray-300 line-clamp-2">{item.text}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0 transition-all hover:scale-110 active:scale-95"
                        title="Delete Announcement"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}

                  {!isLoadingData &&
                    ((activeTab === 'manage-pyqs' && pyqs.length === 0) ||
                      (activeTab === 'manage-notes' && notes.length === 0) ||
                      (activeTab === 'manage-announcements' && announcements.length === 0)) && (
                      <div className="text-center py-10 text-gray-500 text-sm">
                        No records found.
                      </div>
                    )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;