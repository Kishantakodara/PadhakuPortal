import React, { useState, useRef, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../supabaseClient';
import { Upload, CheckCircle, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import { DEPARTMENTS } from '../constants';

const BulkUpload = ({ embedded = false }: { embedded?: boolean }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [department, setDepartment] = useState('it');
  const [targetSemester, setTargetSemester] = useState('auto');
  const logEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
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

        addLog(`[${i + 1}/${files.length}] Processing ${file.name}...`);

        // Parse from filename: "Computer Networks - S2021 [3140913] [GTURanker].pdf"
        // Groups: [1]=Subject Name  [2]=S/W  [3]=Year  [4]=Code
        const match = file.name.match(/^(.+?)\s*-\s*([SW])(\d{4})\s*\[(\d+)\]/i);

        let subjectName = '';
        let subjectCode = '';
        let year = 2024;
        let semester = 1;
        let season = 'W';

        if (match) {
          subjectName = match[1].trim();        // e.g. "Computer Networks"
          season      = match[2].toUpperCase();   // "S" or "W"
          year        = parseInt(match[3], 10);   // 2021
          subjectCode = match[4];               // "3140913"

          if (targetSemester !== 'auto') {
            semester = parseInt(targetSemester, 10);
          } else if (subjectCode.length >= 3) {
            semester = parseInt(subjectCode.charAt(2), 10);
          }
        } else {
          // Fallback parsing for simpler filenames or those that don't match the exact pattern
          const cleanName = file.name.replace(/\.pdf$/i, '');
          
          // Try to find a code in brackets like [3140913]
          const codeMatch = cleanName.match(/\[(\d+)\]/);
          subjectCode = codeMatch ? codeMatch[1] : '';
          
          // Try to find season/year like S2021 or W2022
          const yearMatch = cleanName.match(/([SW])(\d{4})/i);
          if (yearMatch) {
            season = yearMatch[1].toUpperCase();
            year = parseInt(yearMatch[2], 10);
          }
          
          // Use the part before any bracket or hyphen as the subject name
          // If no hyphen/bracket, use the whole filename
          subjectName = cleanName.split(/[\[\-]/)[0].trim();
          
          // If subjectName is too generic (like "Upload" or empty), try folder name
          if (!subjectName || subjectName.toLowerCase() === 'upload') {
            const pathParts = file.webkitRelativePath.split('/');
            const subjectFolder = pathParts.length > 2 ? pathParts[1] : pathParts[0];
            const folderMatch = subjectFolder.match(/^(\d+)\s+(.+)$/);
            if (folderMatch) {
              subjectCode = subjectCode || folderMatch[1];
              subjectName = folderMatch[2].trim();
            } else if (subjectFolder && subjectFolder.toLowerCase() !== 'upload') {
              subjectName = subjectFolder;
            }
          }
          
          if (targetSemester !== 'auto') semester = parseInt(targetSemester, 10);
          addLog(`⚠ Pattern not fully matched for: ${file.name}. Parsed as "${subjectName}"`);
        }

        // Build standardized filename: "SubjectName,Code,W2024 by PadhakuPortal.pdf"
        const codePart = subjectCode ? `,${subjectCode}` : '';
        const standardFileName = `${subjectName}${codePart},${season}${year} by PadhakuPortal.pdf`;
        const title = standardFileName.replace('.pdf', '');

        // 1. Upload to Supabase with standardized filename
        const storagePath = `bulk/${department}/pyqs/${standardFileName}`;
        addLog(`-> Uploading as: ${standardFileName}`);

        const { error: uploadError } = await supabaseAdmin.storage
          .from('Document')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw new Error(`Supabase Upload Error: ${uploadError.message}`);

        const { data: urlData } = supabase.storage.from('Document').getPublicUrl(storagePath);
        const downloadUrl = urlData.publicUrl;

        // 2. Save metadata to Supabase
        addLog(`-> Saving metadata to Supabase...`);
        const { error: insertError } = await supabase.from('pyqs').insert({
          title,
          departmentId: department,
          semester,
          pdfUrl: downloadUrl,
          storagePath: storagePath,
          status: 'published',
          createdAt: new Date().toISOString(),
          views: 0,
          likes: 0,
          year,
          type: 'Endsem'
        });
        if (insertError) throw insertError;

        addLog(`✓ Done: ${standardFileName}`);
      } catch (err: any) {
        addLog(`❌ Failed: ${file.name} — ${err.message}`);
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
      const { data: pyqs, error: fetchError } = await supabase.from('pyqs').select('*');
      if (fetchError) throw fetchError;
      let deletedCount = 0;

      for (const data of (pyqs || [])) {
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
          
          // Resolve storage path — use stored field or derive from pdfUrl
          let resolvedPath = data.storagePath;
          if (!resolvedPath && data.pdfUrl) {
            const match = data.pdfUrl.match(/\/Document\/(.+)$/);
            if (match) resolvedPath = match[1];
          }

          if (resolvedPath) {
            const { error } = await supabaseAdmin.storage.from('Document').remove([resolvedPath]);
            if (error) addLog(`⚠️ Failed to delete storage file: ${error.message}`);
            else addLog(`✅ Storage file deleted: ${resolvedPath}`);
          } else {
            addLog(`⚠️ No storage path found for: ${data.title}`);
          }

          await supabase.from('pyqs').delete().eq('id', data.id);
          deletedCount++;
        }
      }
      addLog(`Cleanup complete. Deleted ${deletedCount} broken records.`);
    } catch (err: any) {
      addLog(`Cleanup Error: ${err.message}`);
    }
    setIsUploading(false);
  };

  const content = (
    <div className={`${embedded ? '' : 'max-w-3xl mx-auto bg-white dark:bg-navy-900 rounded-3xl shadow-xl p-8'}`}>
      <h1 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white mb-2">Bulk PYQ Uploader</h1>
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
          accept=".pdf"
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
            {isUploading ? 'Uploading...' : 'Click or Drag to Select Files'}
          </p>
          <p className="text-sm text-gray-500">
            {isUploading ? `Processed ${progress} of ${total} files` : 'Select one or more PDF files to automatically parse and upload'}
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
          <div key={i} className="mb-1 flex items-start gap-2">
            <span className="text-gray-600 shrink-0 select-none">[{i+1}]</span>
            <span>{log}</span>
          </div>
        ))}
        <div ref={logEndRef} />
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
  );

  if (embedded) return content;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-12 px-4 sm:px-6 lg:px-8">
      {content}
    </div>
  );
};

export default BulkUpload;
