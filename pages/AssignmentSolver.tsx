
import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  BookOpen, 
  CheckCircle2, 
  Loader2, 
  Download, 
  Sparkles, 
  FileEdit, 
  ChevronRight, 
  X,
  Plus,
  AlertCircle
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import saveAs from 'file-saver';
import { retryWithBackoff } from '../utils/api';

interface ProcessedQuestion {
  id: number;
  question: string;
  answer?: string;
  status: 'pending' | 'solving' | 'completed' | 'error';
}

// Lightweight Markdown Renderer
const MarkdownLite: React.FC<{ text: string }> = ({ text }) => {
  const renderLine = (line: string, index: number) => {
    // Process Bold and Inline Code
    const processInline = (str: string) => {
      // Bold: **text**
      // Code: `code`
      const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i}>{part.slice(1, -1)}</code>;
        }
        return part;
      });
    };

    // Lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      return (
        <li key={index} className="ml-4 mb-1">
          {processInline(line.trim().substring(2))}
        </li>
      );
    }

    // Paragraphs
    if (!line.trim()) return <div key={index} className="h-2" />;
    
    return (
      <p key={index} className="mb-2">
        {processInline(line)}
      </p>
    );
  };

  const lines = text.split('\n');
  return <div className="prose prose-sm dark:prose-invert max-w-none">{lines.map(renderLine)}</div>;
};

const AssignmentSolver: React.FC = () => {
  const [step, setStep] = useState(1);
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [questions, setQuestions] = useState<ProcessedQuestion[]>([]);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const syllabusInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleStartSolving = async () => {
    if (!assignmentFile) return;

    setIsProcessing(true);
    setStep(2);
    setProcessingStatus('Parsing assignment and syllabus...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const assignmentBase64 = await fileToBase64(assignmentFile);
      const syllabusBase64 = syllabusFile ? await fileToBase64(syllabusFile) : null;
      const referenceBase64 = referenceFile ? await fileToBase64(referenceFile) : null;

      const extractionResponse = await retryWithBackoff(async () => {
        const extractPrompt = `
          Analyze this assignment document. 
          Identify all individual questions. 
          List them clearly in a JSON array of strings. 
          Only include the question text.
        `;

        const parts: any[] = [
          { text: extractPrompt },
          { inlineData: { mimeType: assignmentFile.type, data: assignmentBase64 } }
        ];

        return await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: { parts },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                questions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["questions"]
            }
          }
        });
      });

      const parsed = JSON.parse(extractionResponse.text || '{"questions": []}');
      const extractedQuestions: ProcessedQuestion[] = parsed.questions.map((q: string, i: number) => ({
        id: i + 1,
        question: q,
        status: 'pending' as const
      }));

      setQuestions(extractedQuestions);

      for (let i = 0; i < extractedQuestions.length; i++) {
        setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'solving' } : q));
        setProcessingStatus(`Solving Question ${i + 1} of ${extractedQuestions.length}...`);

        const qText = extractedQuestions[i].question;
        
        try {
          const solveResponse = await retryWithBackoff(async () => {
            const solvePrompt = `
              You are an expert academic tutor. 
              Solve the following question accurately based on the provided syllabus and reference materials. 
              
              SYLLABUS CONTEXT: Provided as document.
              REFERENCE MATERIAL: Provided as document (if available).
              
              QUESTION: "${qText}"
              
              FORMATTING INSTRUCTION: 
              - Use **Markdown** for readability.
              - Use **bold text** for key terms and final answers.
              - Use bullet points for steps or lists.
              - Use inline code (\`formula\`) for mathematical notation or code.
              - Provide a direct, professional answer ready for submission.
              - Avoid all conversational filler.
            `;

            const solveParts: any[] = [{ text: solvePrompt }];
            if (syllabusBase64) {
              solveParts.push({ inlineData: { mimeType: syllabusFile?.type || 'application/pdf', data: syllabusBase64 } });
            }
            if (referenceBase64) {
              solveParts.push({ inlineData: { mimeType: referenceFile?.type || 'application/pdf', data: referenceBase64 } });
            }

            return await ai.models.generateContent({
              model: 'gemini-3-pro-preview',
              contents: { parts: solveParts },
            });
          });

          const answer = solveResponse.text;
          setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'completed', answer } : q));
        } catch (err: any) {
          console.error(`Failed to solve question ${i + 1}:`, err);
          setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'error', answer: 'Failed to generate solution. Rate limit might be exceeded.' } : q));
          if (err.message?.includes('429')) {
             setProcessingStatus('Rate limit exceeded. Try again later or with fewer questions.');
             setIsProcessing(false);
             return;
          }
        }
        await new Promise(r => setTimeout(r, 1000));
      }

      setProcessingStatus('All questions solved!');
      setIsProcessing(false);
    } catch (error: any) {
      console.error("Solver error:", error);
      const msg = error?.message?.includes('429') 
        ? 'You exceeded your current quota. Please wait a few minutes and try again.' 
        : 'An error occurred during processing. Please try again.';
      setProcessingStatus(msg);
      setIsProcessing(false);
    }
  };

  const downloadDocx = async () => {
    setIsGeneratingDoc(true);
    try {
      const docChildren: any[] = [
        new Paragraph({
          text: assignmentFile?.name.replace(/\.[^/.]+$/, "") || "Assignment Solutions",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Generated by PadhakuPortal AI Assignment Solver",
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        }),
      ];

      questions.forEach(q => {
        // Question Header
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: `Question ${q.id}: `, bold: true, size: 28 }),
              new TextRun({ text: q.question, size: 28 }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );

        // Answer Content
        if (q.answer) {
          const lines = q.answer.split('\n');
          lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;

            // Handle Bullet Points
            let isBullet = false;
            let content = trimmed;
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              isBullet = true;
              content = trimmed.substring(2);
            }

            // Simple Bold Parsing
            const parts = content.split(/(\*\*.*?\*\*)/g);
            const textRuns = parts.map(part => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return new TextRun({ text: part.slice(2, -2), bold: true });
              }
              return new TextRun({ text: part });
            });

            docChildren.push(
              new Paragraph({
                children: textRuns,
                bullet: isBullet ? { level: 0 } : undefined,
                spacing: { after: 120 },
              })
            );
          });
        } else {
          docChildren.push(
            new Paragraph({
              text: "No answer generated.",
              spacing: { after: 400 },
            })
          );
        }
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: docChildren
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${assignmentFile?.name.replace(/\.[^/.]+$/, "")}_Solved.docx`);
    } catch (err) {
      console.error("Doc gen error:", err);
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  const copyToClipboard = () => {
    const text = questions.map(q => `Question ${q.id}: ${q.question}\n\n${q.answer || 'No answer'}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
    alert('Solutions copied to clipboard! You can now paste them into Google Docs.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-12 transition-colors relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-orange/5 to-transparent pointer-events-none" />
       
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-brand-orange text-xs font-bold mb-4 uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> New Feature
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-navy-900 dark:text-white mb-4">
                Assignment <span className="text-brand-orange">Solver</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Upload your assignment, syllabus, and reference material. 
                Our AI will generate a submission-ready document in seconds.
            </p>
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`group relative overflow-hidden border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${
                            assignmentFile 
                                ? 'bg-orange-50 border-brand-orange dark:bg-orange-900/20' 
                                : 'bg-white border-gray-200 dark:bg-navy-900 dark:border-navy-800 hover:border-brand-orange'
                        }`}
                    >
                        <input type="file" ref={fileInputRef} onChange={(e) => setAssignmentFile(e.target.files?.[0] || null)} className="hidden" accept=".pdf,.docx" />
                        <div className={`p-5 rounded-3xl mb-6 transition-transform group-hover:scale-110 ${
                            assignmentFile ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-navy-800 text-gray-400'
                        }`}>
                            <FileEdit className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">{assignmentFile ? assignmentFile.name : 'Upload Assignment File'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">PDF or DOCX (Max 10MB)</p>
                        {assignmentFile && (
                            <button onClick={(e) => { e.stopPropagation(); setAssignmentFile(null); }} className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-navy-800/80 rounded-full hover:text-red-500 transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div onClick={() => syllabusInputRef.current?.click()} className={`p-6 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex items-center gap-4 ${syllabusFile ? 'bg-blue-50 border-blue-400 dark:bg-blue-900/20' : 'bg-white border-gray-200 dark:bg-navy-900 dark:border-navy-800 hover:border-blue-400'}`}>
                    <input type="file" ref={syllabusInputRef} onChange={(e) => setSyllabusFile(e.target.files?.[0] || null)} className="hidden" accept=".pdf" />
                    <div className={`p-3 rounded-2xl ${syllabusFile ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-navy-800 text-gray-400'}`}><BookOpen className="h-6 w-6" /></div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-navy-900 dark:text-white text-sm truncate">{syllabusFile ? syllabusFile.name : 'Add Syllabus'}</h4>
                        <p className="text-xs text-gray-500">Provide academic context</p>
                    </div>
                    {syllabusFile && <button onClick={(e) => { e.stopPropagation(); setSyllabusFile(null); }} className="text-gray-400 hover:text-red-500"><X className="h-4 w-4" /></button>}
                </div>

                <div onClick={() => referenceInputRef.current?.click()} className={`p-6 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex items-center gap-4 ${referenceFile ? 'bg-purple-50 border-purple-400 dark:bg-purple-900/20' : 'bg-white border-gray-200 dark:border-navy-900 dark:border-navy-800 hover:border-purple-400'}`}>
                    <input type="file" ref={referenceInputRef} onChange={(e) => setReferenceFile(e.target.files?.[0] || null)} className="hidden" accept=".pdf,.txt" />
                    <div className={`p-3 rounded-2xl ${referenceFile ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-navy-800 text-gray-400'}`}><Plus className="h-6 w-6" /></div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-navy-900 dark:text-white text-sm truncate">{referenceFile ? referenceFile.name : 'Reference Material'}</h4>
                        <p className="text-xs text-gray-500">Optional methodology source</p>
                    </div>
                    {referenceFile && <button onClick={(e) => { e.stopPropagation(); setReferenceFile(null); }} className="text-gray-400 hover:text-red-500"><X className="h-4 w-4" /></button>}
                </div>
            </div>

            <div className="flex flex-col items-center gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex items-start gap-3 max-w-lg">
                    <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800 dark:text-blue-300"><b>Pro Tip:</b> Providing the syllabus helps the AI use specific course terminology and focus on topics your professor values.</p>
                </div>
                <button onClick={handleStartSolving} disabled={!assignmentFile} className={`group px-12 py-5 rounded-[1.5rem] font-bold text-lg flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20 ${assignmentFile ? 'bg-brand-orange text-white hover:bg-brand-hover hover:-translate-y-1' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                    Start Solving <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </div>
        )}

        {step === 2 && (
            <div className="animate-slide-up space-y-8">
                <div className="bg-white dark:bg-navy-900 rounded-[2rem] p-10 shadow-xl border border-gray-100 dark:border-navy-800 text-center relative overflow-hidden">
                    {isProcessing && (
                         <div className="absolute top-0 left-0 w-full h-1">
                            <div className="h-full bg-brand-orange animate-[shimmer_2s_infinite] w-full" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent, #f97316, transparent)' }} />
                         </div>
                    )}
                    <div className="inline-flex items-center justify-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-full mb-8">
                        {isProcessing ? <Loader2 className="h-12 w-12 text-brand-orange animate-spin" /> : <CheckCircle2 className="h-12 w-12 text-green-500" />}
                    </div>
                    <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">{isProcessing ? 'Thinking & Writing...' : 'Assignment Ready!'}</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{processingStatus}</p>
                </div>

                <div className="space-y-4">
                    {questions.map((q) => (
                        <div key={q.id} className={`bg-white dark:bg-navy-900 rounded-2xl p-6 border transition-all ${q.status === 'solving' ? 'border-brand-orange shadow-lg' : 'border-gray-100 dark:border-navy-800'}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Question {q.id}</span>
                                        {q.status === 'completed' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                                        {q.status === 'solving' && <Loader2 className="h-3 w-3 text-brand-orange animate-spin" />}
                                        {q.status === 'error' && <AlertCircle className="h-3 w-3 text-red-500" />}
                                    </div>
                                    <h4 className="font-bold text-navy-900 dark:text-white text-lg leading-snug">{q.question}</h4>
                                    {q.answer && (
                                        <div className={`mt-4 pt-4 border-t border-gray-50 dark:border-navy-800 ${q.status === 'error' ? 'text-red-500 italic' : ''}`}>
                                            <MarkdownLite text={q.answer} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {!isProcessing && (
                    <div className="flex justify-center gap-4 pt-8">
                        <button onClick={() => { setStep(1); setQuestions([]); }} className="px-8 py-4 rounded-xl font-bold text-gray-500 hover:text-navy-900 dark:hover:text-white transition-colors">Start New</button>
                {questions.some(q => q.status === 'completed') && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={copyToClipboard} className="bg-white dark:bg-navy-900 text-navy-900 dark:text-white border border-gray-200 dark:border-navy-800 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-navy-800 transition-all flex items-center gap-3">
                        <FileText className="h-5 w-5" /> Copy for Google Docs
                    </button>
                    <button onClick={downloadDocx} disabled={isGeneratingDoc} className="bg-navy-900 dark:bg-brand-orange text-white px-10 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-xl flex items-center gap-3">
                        {isGeneratingDoc ? <><Loader2 className="h-5 w-5 animate-spin" /> Generating...</> : <><Download className="h-5 w-5" /> Download .docx</>}
                    </button>
                  </div>
                )}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentSolver;
