import React, { useState } from 'react';
import { db } from '../utils/firebase';
import { supabase } from '../supabaseClient';
import { collection, addDoc, serverTimestamp, getDocs, query, deleteDoc, doc } from 'firebase/firestore';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { DEPARTMENTS } from '../constants';

const BulkUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [department, setDepartment] = useState('it');
  const [targetSemester, setTargetSemester] = useState('auto');

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
    // Auto scroll bottom could be added here
  };

  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).filter(f => f.name.toLowerCase().endsWith('.pdf'));
    if (files.length === 0) {
      addLog('No PDF files found in the selected folder.');
      return;
    }

    setTotal(files.length);
    setProgress(0);
    setIsUploading(true);
    addLog(`Found ${files.length} PDF files. Starting upload...`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        addLog(`[${i + 1}/${files.length}] Processing ${file.name}...`);

        // Parse metadata
        // Example path: "Computer Network/3150710 Computer Networks/CN - S2021 [3150710] [GTURanker].pdf"
        const pathParts = file.webkitRelativePath.split('/');
        const subjectFolder = pathParts.length > 2 ? pathParts[1] : pathParts[0];

        const match = file.name.match(/^([A-Z\-]+)\s*-\s*([SW])(\d{4})\s*\[(\d+)\]/i);
        let year = 2024;
        let semester = 1;
        let season = 'S';

        if (targetSemester !== 'auto') {
          semester = parseInt(targetSemester, 10);
        }

        if (match) {
          season = match[2].toUpperCase();
          year = parseInt(match[3], 10);
          if (targetSemester === 'auto') {
            const courseCode = match[4];
            if (courseCode.length >= 3) {
              semester = parseInt(courseCode.charAt(2), 10);
            }
          }
        } else {
          addLog(`Regex failed for: ${file.name}. Using year ${year}, sem ${semester}`);
        }

        const title = `${subjectFolder} PYQ ${season}${year}`;

        // 1. Upload to Supabase
        const storagePath = `pyqs/${department}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
        addLog(`-> Uploading to Supabase as ${storagePath}`);

        const { error: uploadError } = await supabase.storage
          .from('Document')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw new Error(`Supabase Upload Error: ${uploadError.message}`);

        const { data: urlData } = supabase.storage.from('Document').getPublicUrl(storagePath);
        const downloadUrl = urlData.publicUrl;

        // 2. Add to Firestore
        addLog(`-> Saving metadata to Firestore...`);
        await addDoc(collection(db, 'pyqs'), {
          title,
          departmentId: department,
          semester,
          pdfUrl: downloadUrl,
          storagePath: storagePath,
          createdAt: serverTimestamp(),
          views: 0,
          likes: 0,
          year,
          type: 'Endsem'
        });

        addLog(`✓ Successfully processed ${file.name}`);
      } catch (err: any) {
        addLog(`❌ Failed to process ${file.name}: ${err.message}`);
      }
      setProgress(i + 1);
    }

    setIsUploading(false);
    addLog('🎉 Bulk upload complete!');
  };

  const handleCleanup = async () => {
    setIsUploading(true);
    addLog('Starting cleanup of broken uploads...');
    try {
      const q = query(collection(db, 'pyqs'));
      const querySnapshot = await getDocs(q);
      let deletedCount = 0;

      for (const document of querySnapshot.docs) {
        const data = document.data();
        const isBrokenTitle = data.title && (data.title.includes('ELe PYQ') || data.title.includes('IT PYQ'));
        const isNotPdf = !data.pdfUrl || !data.pdfUrl.toLowerCase().includes('.pdf');

        let isMissingFile = false;
        if (data.pdfUrl && !isBrokenTitle && !isNotPdf) {
          try {
            const res = await fetch(data.pdfUrl, { method: 'HEAD' });
            if (res.status === 404 || res.status === 400) {
              isMissingFile = true;
            }
          } catch (e) {
            try {
              const res = await fetch(data.pdfUrl);
              if (res.status === 404 || res.status === 400) {
                isMissingFile = true;
              }
            } catch (err) {
              // Ignore network errors, don't delete blindly
            }
          }
        }

        if (isBrokenTitle || isNotPdf || isMissingFile) {
          addLog(`Deleting broken record: ${data.title || 'Untitled'} (Missing or Bad PDF)`);
          if (data.storagePath) {
            const { error } = await supabase.storage.from('Document').remove([data.storagePath]);
            if (error) addLog(`Warning: Failed to delete file: ${error.message}`);
          }
          await deleteDoc(doc(db, 'pyqs', document.id));
          deletedCount++;
        }
      }
      addLog(`Cleanup complete. Deleted ${deletedCount} broken records.`);
    } catch (err: any) {
      addLog(`Cleanup Error: ${err.message}`);
    }
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-navy-900 rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">Bulk PYQ Uploader</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Select a department and semester, then choose the local folder to automatically parse and upload PDFs.</p>

        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-navy-900 dark:text-white mb-2">Target Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={isUploading}
              className="w-full bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-navy-900 dark:text-white mb-2">Target Semester</label>
            <select
              value={targetSemester}
              onChange={(e) => setTargetSemester(e.target.value)}
              disabled={isUploading}
              className="w-full bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-navy-700 rounded-xl px-4 py-3 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
            >
              <option value="auto">Auto-detect from Subject Code</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 dark:border-navy-700 rounded-2xl p-12 text-center relative hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors">
          <input
            type="file"
            // @ts-ignore - webkitdirectory is a non-standard attribute but works in all modern browsers
            webkitdirectory="true"
            directory="true"
            multiple
            onChange={handleFolderSelect}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center pointer-events-none">
            {isUploading ? (
              <Loader2 className="h-12 w-12 text-brand-orange animate-spin mb-4" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
            )}
            <p className="text-lg font-bold text-navy-900 dark:text-white mb-2">
              {isUploading ? 'Uploading...' : 'Click or Drag to Select Folder'}
            </p>
            <p className="text-sm text-gray-500">
              {isUploading ? `Processed ${progress} of ${total} files` : 'Select the folder containing subject subfolders'}
            </p>
          </div>
        </div>

        {total > 0 && (
          <div className="mt-8">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-navy-900 dark:text-white">Upload Progress</span>
              <span className="text-brand-orange">{Math.round((progress / total) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-navy-800 rounded-full h-2.5">
              <div className="bg-brand-orange h-2.5 rounded-full transition-all duration-300" style={{ width: `${(progress / total) * 100}%` }}></div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-900 rounded-xl p-4 h-64 overflow-y-auto font-mono text-xs text-green-400">
          {logs.map((log, i) => (
            <div key={i} className="mb-1">{log}</div>
          ))}
          {logs.length === 0 && <span className="text-gray-500">System ready. Waiting for folder...</span>}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleCleanup}
            disabled={isUploading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4" /> Cleanup Broken Uploads
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
