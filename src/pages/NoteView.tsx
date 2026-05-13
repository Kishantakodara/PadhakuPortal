
import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, Share2, Bookmark, ThumbsUp, ChevronRight, Hash, BookOpen, AlertCircle, ArrowLeft, BrainCircuit, Loader2, Sparkles, PenTool, FileText, Eye, X, Download } from 'lucide-react';
import { DEPARTMENTS } from '../constants';
import { useParams, Link } from 'react-router-dom';
import AdPlaceholder from '../components/AdPlaceholder';
import AdSidePanel from '../components/AdSidePanel';
import ShareModal from '../components/ShareModal';
import FlashcardDeck from '../components/FlashcardDeck';
import { GoogleGenAI, Type } from '@google/genai';
import { Flashcard, Note } from '../types';
import { db } from '../utils/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const NoteView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  
  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'notes', id), (snapshot) => {
        if (snapshot.exists()) {
            const data = { id: snapshot.id, ...snapshot.data() } as Note;
            setNote(data);
            if (!activeSection && data.sections?.[0]) {
                setActiveSection(data.sections[0].id);
            }
        }
        setIsLoading(false);
    }, (err) => {
        console.error("Error loading note:", err);
        setIsLoading(false);
    });
    return () => unsubscribe();
  }, [id, activeSection]);

  const dept = note ? DEPARTMENTS.find(s => s.id === note.departmentId) : undefined;
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  // Flashcard State
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [showFlashcards, setShowFlashcards] = useState(false);

  // Collaboration State
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    if (!note || !note.sections) return;
    const handleScroll = () => {
      if (!note.sections) return;
      const sections = note.sections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 150; 
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(note.sections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [note]);

  const generateFlashcards = async () => {
    if (!note) return;
    setIsGeneratingCards(true);
    
    // Combine note content for context
    const fullText = note.sections ? note.sections.map(s => s.title + ": " + s.content).join("\n\n") : "Please provide a summary of this document based on the title: " + note.title;
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Create 5 study flashcards based on the following text. The output must be a JSON array of objects, where each object has a "question" and an "answer" property. Text: ${fullText.substring(0, 5000)}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            answer: { type: Type.STRING }
                        },
                        required: ["question", "answer"]
                    }
                }
            }
        });
        
        const jsonText = response.text;
        if (jsonText) {
            const parsedCards = JSON.parse(jsonText);
            const cardsWithIds = parsedCards.map((c: any, i: number) => ({ ...c, id: `fc-${i}` }));
            setFlashcards(cardsWithIds);
            setShowFlashcards(true);
        }
    } catch (e) {
        console.error("Failed to generate flashcards", e);
        alert("Could not generate flashcards. Please try again.");
    } finally {
        setIsGeneratingCards(false);
    }
  };

  const handleSuggestSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert("Thanks! Your suggestion has been sent to the original author for review.");
      setIsSuggesting(false);
      setSuggestion('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 text-brand-orange animate-spin mb-4" />
        <p className="text-gray-500 font-medium font-display uppercase tracking-widest text-xs">Opening Document...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Note Not Found</h2>
        <Link to="/notes" className="text-brand-orange hover:underline">Back to Notes</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-navy-950 animate-slide-up transition-colors pb-20">
      {/* Floating Back Button for Mobile */}
      <div className="lg:hidden p-4">
        <Link to="/notes" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium">
           <ArrowLeft className="h-4 w-4" /> Back to Library
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Main Paper Content */}
          <article className="flex-1 min-w-0">
             {/* Paper Container */}
            <div className="bg-white dark:bg-navy-900 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-200/50 dark:border-navy-800 p-8 md:p-12 lg:p-16 relative overflow-hidden">
                {/* Decorative top accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-orange via-red-500 to-brand-orange" />
                
                <div className="mb-10">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <Link to={`/notes?department=${dept?.id}`} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${dept?.color || 'bg-gray-100 text-gray-600'} hover:opacity-80 transition-opacity`}>
                            {dept?.name}
                        </Link>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Semester {note.semester}</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-navy-900 dark:text-white mb-6 leading-[1.15]">
                        {note.title}
                    </h1>
                    
                    <div className="flex items-center justify-between py-6 border-y border-gray-100 dark:border-navy-800">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                {note.author.charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-navy-900 dark:text-white">{note.author}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <span>{note.lastUpdated}</span>
                                    <span>•</span>
                                    <span>{note.views} reads</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setIsSuggesting(true)} className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-navy-800 hover:bg-gray-100 dark:hover:bg-navy-700 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">
                                <PenTool className="h-4 w-4" /> Edit
                            </button>
                            <button onClick={() => setIsShareOpen(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-navy-800 text-gray-400 hover:text-navy-900 dark:hover:text-white transition-colors">
                                <Share2 className="h-5 w-5" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-navy-800 text-gray-400 hover:text-brand-orange transition-colors">
                                <Bookmark className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* AI Flashcard Generator Section */}
                <div className="mb-10 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-navy-800 dark:to-navy-900 rounded-2xl p-6 border border-indigo-100 dark:border-navy-700">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white dark:bg-navy-800 p-2 rounded-lg shadow-sm">
                                <BrainCircuit className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-navy-900 dark:text-white">AI Study Mode</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Generate flashcards to test your knowledge.</p>
                            </div>
                        </div>
                        {!showFlashcards && (
                            <button 
                                onClick={generateFlashcards}
                                disabled={isGeneratingCards}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20"
                            >
                                {isGeneratingCards ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                                ) : (
                                    <><Sparkles className="h-4 w-4" /> Generate Flashcards</>
                                )}
                            </button>
                        )}
                    </div>

                    {showFlashcards && (
                        <div className="mt-6 border-t border-indigo-100 dark:border-navy-700 pt-6">
                            <FlashcardDeck cards={flashcards} title="Generated Quiz" onClose={() => setShowFlashcards(false)} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none font-serif">
                    {note.pdfUrl ? (
                      <>
                        <div className="flex flex-col items-center justify-center py-10 bg-gray-50 dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700">
                          <FileText className="h-16 w-16 text-brand-orange mb-4" />
                          <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">Document Attached</h3>
                          <p className="text-gray-500 mb-6 text-center max-w-md">This note contains a PDF document. You can preview it full-screen directly on the website.</p>
                          <button 
                            onClick={() => setIsFullscreen(true)} 
                            className="bg-brand-orange hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md inline-flex items-center gap-2"
                          >
                            <Eye className="h-5 w-5" /> Preview Document
                          </button>
                        </div>
                        
                        {isFullscreen && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 animate-fade-in">
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsFullscreen(false)} />
                            <div className="relative bg-white dark:bg-navy-900 shadow-2xl w-full h-full max-w-none rounded-none p-0 flex flex-col transform transition-all duration-300 scale-100 overflow-hidden">
                              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange to-red-500 z-20" />
                              <button 
                                onClick={() => setIsFullscreen(false)}
                                className="absolute top-3 right-4 text-gray-400 hover:text-navy-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors z-20"
                              >
                                <X className="h-5 w-5" />
                              </button>
                              <div className="flex flex-col h-full w-full bg-gray-100 dark:bg-navy-950">
                                <div className="bg-white dark:bg-navy-900 flex items-center justify-between p-4 pr-16 border-b border-gray-200 dark:border-navy-700 z-10 shadow-sm relative">
                                  <h3 className="text-xl font-bold text-navy-900 dark:text-white truncate">{note.title}</h3>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {note.pdfUrl && (
                                      <a href={note.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-500 hover:text-brand-orange hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-navy-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2" title="Download PDF">
                                        <Download className="h-4 w-4" /> <span className="hidden sm:inline">Download</span>
                                      </a>
                                    )}
                                    <button 
                                      onClick={() => setIsFullscreen(false)}
                                      className="text-sm font-bold text-brand-orange hover:bg-orange-50 dark:hover:bg-navy-800 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                      Close Preview
                                    </button>
                                  </div>
                                </div>
                                <div className="flex-1 w-full overflow-hidden">
                                  <iframe 
                                    src={`${note.pdfUrl}#toolbar=0`} 
                                    className="w-full h-full border-0" 
                                    title={note.title}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      note.sections?.map((section) => (
                        <section key={section.id} id={section.id} className="scroll-mt-32 mb-12">
                        <h2 className="text-2xl font-sans font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2 relative group">
                            <span className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity text-brand-orange/50 hidden lg:block">
                                <Hash className="h-5 w-5" />
                            </span>
                            {section.title}
                        </h2>
                        <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            <p>{section.content}</p>
                            <p className="mt-4 text-gray-500 dark:text-gray-400 italic text-base border-l-2 border-gray-200 dark:border-navy-700 pl-4">
                            Extended explanation context would go here. The typography is set to be comfortable for long reading sessions, mimicking a high-quality textbook layout.
                            </p>
                        </div>
                        </section>
                      ))
                    )}
                </div>
                
                {/* Collaboration Modal (Inline) */}
                {isSuggesting && (
                    <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/30">
                        <h3 className="font-bold text-navy-900 dark:text-white mb-2 flex items-center gap-2">
                            <PenTool className="h-4 w-4" /> Suggest an Edit
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">Help improve this note. Your suggestion will be reviewed by the author.</p>
                        <form onSubmit={handleSuggestSubmit}>
                            <textarea 
                                value={suggestion}
                                onChange={(e) => setSuggestion(e.target.value)}
                                placeholder="Describe the change or addition..."
                                className="w-full p-3 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-950 focus:ring-2 focus:ring-brand-orange outline-none text-sm mb-3"
                                rows={4}
                                required
                            />
                            <div className="flex gap-2 justify-end">
                                <button type="button" onClick={() => setIsSuggesting(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-navy-900">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-bold shadow-sm">Submit Suggestion</button>
                            </div>
                        </form>
                    </div>
                )}

                 {/* Bottom Action */}
                <div className="mt-16 p-6 bg-gray-50 dark:bg-navy-800 rounded-2xl flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Find this note helpful?</span>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-navy-900 rounded-xl shadow-sm text-sm font-bold text-navy-900 dark:text-white hover:text-brand-orange transition-colors">
                        <ThumbsUp className="h-4 w-4" /> Like Note
                    </button>
                </div>
            </div>
          </article>

          {/* Sidebar - Sticky Bookmark */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32 space-y-6">
               {/* TOC Card */}
              <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-gray-100 dark:border-navy-800 p-6">
                <div className="flex items-center gap-2 mb-6 text-navy-900 dark:text-white font-bold">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                    Contents
                </div>
                <nav className="space-y-1 relative">
                   {/* Track Line */}
                   <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gray-100 dark:bg-navy-800" />
                   
                  {note.sections && note.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleScrollTo(section.id)}
                      className={`group flex items-start w-full py-2 pl-6 text-sm font-medium transition-all relative ${
                        activeSection === section.id
                          ? 'text-brand-orange'
                          : 'text-gray-500 dark:text-gray-400 hover:text-navy-900 dark:hover:text-white'
                      }`}
                    >
                      <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-colors z-10 ${
                          activeSection === section.id ? 'bg-white border-brand-orange scale-100' : 'bg-white dark:bg-navy-900 border-gray-200 dark:border-navy-700 scale-75 group-hover:border-gray-400'
                      }`} />
                      <span className="truncate">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Sidebar Ad Panel */}
              <AdSidePanel height="h-[400px]" />
            </div>
          </aside>
        </div>
      </div>

      <ShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={note.title}
      />
    </div>
  );
};

export default NoteView;
