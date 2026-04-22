import React, { useState, useEffect } from 'react';
import { Upload, FileText, Book, CheckCircle, AlertCircle, X, Trash2, Megaphone, Loader2 } from 'lucide-react';
import { DEPARTMENTS, SEMESTERS, YEARS } from '../constants';
import { PaperType } from '../types';
import { db, storage, auth } from '../utils/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { handleFirestoreError } from '../utils/errorHandlers';

type Tab = 'manage-pyqs' | 'manage-notes' | 'manage-announcements';

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

  useEffect(() => {
    setIsLoadingData(true);
    const collectionName = activeTab === 'manage-pyqs' ? 'pyqs' : activeTab === 'manage-notes' ? 'notes' : 'announcements';
    
    // Real-time listener for current active tab data
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (activeTab === 'manage-pyqs') setPyqs(data);
      else if (activeTab === 'manage-notes') setNotes(data);
      else if (activeTab === 'manage-announcements') setAnnouncements(data);
      setIsLoadingData(false);
    }, (err) => {
      console.error(err);
      handleFirestoreError(err, 'list', collectionName);
      setIsLoadingData(false);
    });

    return () => unsubscribe();
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
        await addDoc(collection(db, 'announcements'), {
          text: announcementText,
          createdAt: serverTimestamp()
        });
        setAnnouncementText('');
        setSuccessMsg('Announcement posted successfully!');
      } else {
        // Upload File to Storage
        const fileRef = ref(storage, `uploads/${activeTab}/${Date.now()}_${file!.name}`);
        const snapshot = await uploadBytes(fileRef, file!);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        const commonData = {
          title,
          departmentId: department,
          semester,
          pdfUrl: downloadUrl,
          storagePath: snapshot.ref.fullPath,
          createdAt: serverTimestamp(),
          views: 0,
          likes: 0
        };

        if (activeTab === 'manage-pyqs') {
          await addDoc(collection(db, 'pyqs'), {
            ...commonData,
            year,
            type: paperType
          });
          setSuccessMsg('PYQ uploaded successfully!');
        } else if (activeTab === 'manage-notes') {
          await addDoc(collection(db, 'notes'), {
            ...commonData,
            author,
            topics: []
          });
          setSuccessMsg('Note uploaded successfully!');
        }

        // Reset forms
        setTitle('');
        setFile(null);
      }
      
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to upload/save data');
      handleFirestoreError(err, 'create', collectionName);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, storagePath?: string) => {
    const collectionName = activeTab === 'manage-pyqs' ? 'pyqs' : activeTab === 'manage-notes' ? 'notes' : 'announcements';
    if (!confirm('Are you sure you want to delete this specific item? This action is irreversible.')) return;

    try {
      await deleteDoc(doc(db, collectionName, id));

      if (storagePath) {
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef).catch(e => console.log('File deletion issue:', e));
      }

      setSuccessMsg('Record erased successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
      alert('Failed to delete record.');
      handleFirestoreError(err, 'delete', `${collectionName}/${id}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
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
              className={`flex-1 py-4 min-w-[120px] text-sm font-medium text-center flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'manage-pyqs' 
                  ? 'bg-navy-50 dark:bg-navy-800 text-navy-900 dark:text-white border-b-2 border-brand-orange' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-navy-800'
              }`}
            >
              <FileText className="h-4 w-4" /> Manage PYQs
            </button>
            <button
              onClick={() => setActiveTab('manage-notes')}
              className={`flex-1 py-4 min-w-[120px] text-sm font-medium text-center flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'manage-notes' 
                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-900 dark:text-orange-400 border-b-2 border-brand-orange' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-navy-800'
              }`}
            >
              <Book className="h-4 w-4" /> Manage Notes
            </button>
            <button
              onClick={() => setActiveTab('manage-announcements')}
              className={`flex-1 py-4 min-w-[120px] text-sm font-medium text-center flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'manage-announcements' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-400 border-b-2 border-brand-orange' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-navy-800'
              }`}
            >
              <Megaphone className="h-4 w-4" /> Announcements
            </button>
          </div>

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
                            <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navy-50 dark:file:bg-navy-800 file:text-navy-700 dark:file:text-gray-200 hover:file:bg-navy-100 dark:hover:file:bg-navy-700 cursor-pointer" required />
                            </div>
                        </>
                    )}

                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all ${
                        isSubmitting ? 'bg-navy-700 cursor-wait' : 'bg-navy-900 dark:bg-brand-orange hover:bg-navy-800 dark:hover:bg-brand-hover'
                    }`}
                    >
                    {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin mr-2"/> Publishing...</> : 'Publish to Database'}
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
                    {isLoadingData && <Loader2 className="h-5 w-5 text-brand-orange animate-spin" />}
                </h3>

                <div className="space-y-4">
                    {!isLoadingData && activeTab === 'manage-pyqs' && pyqs.map(item => (
                        <div key={item.id} className="bg-white dark:bg-navy-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-navy-800 flex items-center justify-between gap-4 group/item hover:border-brand-orange/50 transition-colors">
                            <div className="min-w-0">
                                <h4 className="font-bold text-navy-900 dark:text-white line-clamp-1 group-hover/item:text-brand-orange transition-colors">{item.title}</h4>
                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">{item.departmentId} • Sem {item.semester} • {item.year}</p>
                            </div>
                            <button onClick={() => handleDelete(item.id, item.storagePath)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    ))}

                    {!isLoadingData && activeTab === 'manage-notes' && notes.map(item => (
                        <div key={item.id} className="bg-white dark:bg-navy-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-navy-800 flex items-center justify-between gap-4 group/item hover:border-brand-orange/50 transition-colors">
                            <div className="min-w-0">
                                <h4 className="font-bold text-navy-900 dark:text-white line-clamp-1 group-hover/item:text-brand-orange transition-colors">{item.title}</h4>
                                <p className="text-xs text-gray-500 mt-1 font-medium italic">By {item.author} • {item.departmentId}</p>
                            </div>
                            <button onClick={() => handleDelete(item.id, item.storagePath)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    ))}

                    {!isLoadingData && activeTab === 'manage-announcements' && announcements.map(item => (
                        <div key={item.id} className="bg-white dark:bg-navy-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-navy-800 flex items-center justify-between gap-4 group/item hover:border-brand-orange/50 transition-colors">
                            <p className="text-sm text-navy-900 dark:text-gray-300 line-clamp-2">{item.text}</p>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity">
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;