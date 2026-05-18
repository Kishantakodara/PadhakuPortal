
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, AlertTriangle, Paperclip, X, FileText, Zap, MessageSquare, Book, Brain, GraduationCap } from 'lucide-react';
import { GoogleGenAI, type Chat } from "@google/genai";
import { useSearchParams } from 'react-router-dom';
import { NOTES, PYQS, DEPARTMENTS } from '../constants';

interface Message {
  role: 'user' | 'model';
  text: string;
  attachments?: {
    name: string;
    type: 'image' | 'file';
    url?: string;
    mimeType: string;
  }[];
  isError?: boolean;
}

interface AttachmentData {
  file: File;
  base64: string;
  previewUrl: string;
  mimeType: string;
}

// Modern Markdown Renderer
const MarkdownLite: React.FC<{ text: string }> = ({ text }) => {
  const renderLine = (line: string, index: number) => {
    const processInline = (str: string) => {
      const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-navy-900 dark:text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i} className="bg-gray-100 dark:bg-navy-900 px-1.5 py-0.5 rounded text-brand-orange text-xs font-mono">{part.slice(1, -1)}</code>;
        }
        return part;
      });
    };

    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      return (
        <li key={index} className="ml-4 mb-2 text-gray-700 dark:text-gray-300">
          {processInline(line.trim().substring(2))}
        </li>
      );
    }

    if (!line.trim()) return <div key={index} className="h-2" />;

    return (
      <p key={index} className="mb-2 last:mb-0 text-gray-700 dark:text-gray-300 leading-relaxed">
        {processInline(line)}
      </p>
    );
  };

  const lines = text.split('\n');
  return <div className="prose prose-sm dark:prose-invert max-w-none">{lines.map(renderLine)}</div>;
};

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Welcome to **Padhaku AI Tutor**.\n\nUse me for study support, concept revision, and practice prompts. AI answers can make mistakes, so verify important formulas, facts, and exam instructions.\n\nTry asking me about:\n- **Numerical Problems**: Upload a photo for a step-by-step explanation.\n- **Concept Summaries**: Get simpler explanations for tough topics.\n- **Exam Resources**: Ask for relevant notes, PYQs, or guide topics."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [attachments, setAttachments] = useState<AttachmentData[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');
  const hasProcessedQuery = useRef(false);

  useEffect(() => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      if (!apiKey) return;
      const genAI = new GoogleGenAI({ apiKey });
      const chat = genAI.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: "You are an academic tutor for engineering students. Help students learn with clear, accurate explanations using Markdown formatting. Remind users to verify important academic facts when appropriate."
        }
      });
      setChatSession(chat);
    } catch (error) {
      console.error("Failed to initialize AI chat:", error);
    }
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, attachments, isLoading]);

  useEffect(() => {
    if (chatSession && initialQuery && !hasProcessedQuery.current) {
      hasProcessedQuery.current = true;
      sendMessage(initialQuery, []);
      setSearchParams({}, { replace: true });
    }
  }, [chatSession, initialQuery]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments: AttachmentData[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (file.size > 10 * 1024 * 1024) continue;
        if (attachments.length + newAttachments.length >= 5) break;
        try {
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(file);
          });
          const base64 = await base64Promise;
          newAttachments.push({ file, base64, previewUrl: URL.createObjectURL(file), mimeType: file.type });
        } catch (err) { console.error(err); }
      }
      setAttachments(prev => [...prev, ...newAttachments]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async (text: string, currentAttachments: AttachmentData[]) => {
    if ((!text.trim() && currentAttachments.length === 0) || isLoading) return;

    setMessages(prev => [...prev, {
      role: 'user',
      text: text,
      attachments: currentAttachments.length > 0 ? currentAttachments.map(att => ({
        name: att.file.name,
        type: att.mimeType.startsWith('image/') ? 'image' : 'file',
        url: att.previewUrl,
        mimeType: att.mimeType
      })) : undefined
    }]);

    setIsLoading(true);

    try {
      const nvidiaKey = import.meta.env.VITE_NVIDIA_NIM_API_KEY;
      const hasImages = currentAttachments.some(att => att.mimeType.startsWith('image/'));
      
      if (nvidiaKey && !hasImages) {
        const history = messages.map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text
        })).filter(m => m.content);

        const response = await fetch("/api/nvidia/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${nvidiaKey}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            model: "meta/llama-3.1-70b-instruct",
            messages: [
              {
                role: "system",
                content: `You are an expert academic tutor for PadhakuPortal. Use Markdown.
                Context:
                Departments: ${DEPARTMENTS.map(d => `${d.name} (${d.code})`).join(', ')}.
                Recent Notes: ${NOTES.slice(0, 5).map(n => n.title).join(', ')}.`
              },
              ...history,
              { role: "user", content: text || "Help me with this." }
            ],
            temperature: 0.2,
            top_p: 0.7,
            max_tokens: 1024,
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || errorData.message || `NVIDIA API Error: ${response.status}`);
        }
        
        const data = await response.json();
        const responseText = data.choices?.[0]?.message?.content;
        
        if (responseText) {
          setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } else {
          throw new Error("Empty response from AI");
        }
      } else if (chatSession) {
        const parts: any[] = [];
        if (text) parts.push({ text: text });
        else if (currentAttachments.length > 0) parts.push({ text: 'Analyze this.' });
        
        currentAttachments.forEach(att => {
          parts.push({ inlineData: { mimeType: att.mimeType, data: att.base64 } });
        });

        const result = await chatSession.sendMessage({ message: parts });
        const responseText = result.text;
        
        if (responseText) {
          setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        }
      } else {
        throw new Error("AI service unavailable. Please check your API keys.");
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage = error?.message || String(error);
      const isRateLimit = errorMessage.includes('429');
      const isCors = errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS');
      
      setMessages(prev => [...prev, {
        role: 'model',
        text: isRateLimit 
          ? "Usage limit hit. Please wait a moment." 
          : isCors 
            ? "Connection blocked by browser (CORS). NVIDIA NIM requires a proxy to work locally. Gemini fallback failed." 
            : `Error: ${errorMessage}`,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    const currentAttachments = [...attachments];
    if (!text && currentAttachments.length === 0) return;
    setInput('');
    setAttachments([]);
    if (inputRef.current) inputRef.current.style.height = 'auto';
    await sendMessage(text, currentAttachments);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const starterTopics = [
    { title: 'Explain Bohr Model', icon: <Zap className="h-4 w-4 text-yellow-500" /> },
    { title: 'Solve Integration', icon: <Brain className="h-4 w-4 text-purple-500" /> },
    { title: 'Find ME Notes', icon: <Book className="h-4 w-4 text-blue-500" /> },
    { title: 'Last Year PYQs', icon: <GraduationCap className="h-4 w-4 text-green-500" /> },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#fcfcfd] dark:bg-navy-950 overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-navy-800 px-6 py-4 flex justify-between items-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] z-20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="bg-gradient-to-tr from-brand-orange to-orange-400 p-2.5 rounded-2xl shadow-lg shadow-orange-500/20">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-navy-900 rounded-full shadow-sm animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-navy-900 dark:text-white flex items-center gap-2 tracking-tight">
              Padhaku AI <Sparkles className="h-4 w-4 text-yellow-500" />
            </h1>
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1 h-1 bg-brand-orange rounded-full"></span> Study help with verification
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-full bg-gray-50 dark:bg-navy-800 border border-gray-100 dark:border-navy-700 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                Online
            </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"></div>
        </div>

        <div 
          ref={chatContainerRef} 
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 space-y-8 relative z-10 scrollbar-hide"
        >
          {messages.length === 1 && (
            <div className="max-w-2xl mx-auto mt-12 animate-fade-in">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-brand-orange/10 text-brand-orange text-xs font-bold mb-4 border border-brand-orange/20 animate-bounce">
                        <Zap className="h-3.5 w-3.5" /> AI study support active
                    </div>
                    <h2 className="text-3xl font-display font-bold text-navy-900 dark:text-white mb-4">How can I help your studies?</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Ask me anything from your syllabus, or upload a photo of a problem you're stuck on.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {starterTopics.map((topic, i) => (
                        <button 
                            key={topic.title}
                            onClick={() => { setInput(topic.title); inputRef.current?.focus(); }}
                            style={{ animationDelay: `${i * 100}ms` }}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 shadow-sm hover:shadow-md hover:border-brand-orange/30 transition-all text-left animate-slide-up group"
                        >
                            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-navy-800 group-hover:bg-brand-orange/10 transition-colors">
                                {topic.icon}
                            </div>
                            <span className="text-sm font-bold text-navy-900 dark:text-gray-200">{topic.title}</span>
                        </button>
                    ))}
                </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-4 sm:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-md transition-transform hover:scale-105 ${
                msg.role === 'user' 
                  ? 'bg-navy-900 dark:bg-white text-white dark:text-navy-900' 
                  : 'bg-gradient-to-tr from-brand-orange to-orange-400 text-white'
              }`}>
                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              
              <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.attachments?.length && (
                  <div className={`flex flex-wrap gap-2 mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.attachments.map((att, i) => (
                      <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 dark:border-navy-800 shadow-sm bg-white dark:bg-navy-900 p-1 group">
                        {att.mimeType.startsWith('image/') ? (
                          <img src={att.url} alt="Uploaded" className="max-h-48 rounded-xl object-cover transition-transform group-hover:scale-105" />
                        ) : (
                          <div className="px-4 py-3 flex items-center gap-3">
                            <FileText className="h-6 w-6 text-brand-orange" />
                            <span className="text-xs font-bold text-navy-900 dark:text-white truncate max-w-[120px]">{att.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {msg.text && (
                  <div className={`relative px-6 py-4 rounded-3xl text-sm md:text-base shadow-sm transition-all ${
                    msg.role === 'user' 
                      ? 'bg-navy-900 text-white rounded-tr-none dark:bg-brand-orange shadow-navy-500/10' 
                      : msg.isError 
                        ? 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 rounded-tl-none shadow-red-500/5' 
                        : 'bg-white dark:bg-navy-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-navy-800 rounded-tl-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]'
                    }`}>
                    <MarkdownLite text={msg.text} />
                    
                    {/* Timestamp bubble tail-like accent */}
                    <div className={`absolute bottom-[-18px] text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 ${msg.role === 'user' ? 'right-2' : 'left-2'}`}>
                        {msg.role === 'user' ? 'Sent' : 'AI Assistant'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 sm:gap-6 animate-pulse">
              <div className="w-10 h-10 rounded-2xl bg-brand-orange/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-brand-orange animate-bounce" />
              </div>
              <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 px-6 py-5 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-4">
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-brand-orange rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-brand-orange rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-brand-orange rounded-full animate-bounce"></div>
                </div>
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-tight">AI is crafting your response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Modern Input Area */}
      <div className="p-4 sm:p-6 bg-white dark:bg-navy-900 border-t border-gray-100 dark:border-navy-800 relative z-30">
        <div className="max-w-4xl mx-auto">
          {attachments.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-3 animate-slide-up">
              {attachments.map((att, index) => (
                <div key={index} className="group relative flex items-center gap-3 bg-gray-50 dark:bg-navy-950 p-2 pr-4 rounded-2xl border border-gray-100 dark:border-navy-800 hover:shadow-md transition-all scale-100 active:scale-95">
                  <div className="relative flex-shrink-0 h-11 w-11 rounded-xl overflow-hidden bg-gray-200 dark:bg-navy-900 shadow-inner">
                    {att.mimeType.startsWith('image/') ? <img src={att.previewUrl} alt="Preview" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center bg-brand-orange/10"><FileText className="h-5 w-5 text-brand-orange" /></div>}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-navy-900 dark:text-white truncate block max-w-[120px]">{att.file.name}</span>
                    <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest">{(att.file.size / 1024).toFixed(0)} KB</span>
                  </div>
                  <button onClick={() => removeAttachment(index)} className="absolute -top-2 -right-2 bg-white dark:bg-navy-800 text-gray-400 hover:text-red-500 border border-gray-100 dark:border-navy-700 rounded-full p-1.5 shadow-md transition-colors"><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2 bg-white dark:bg-navy-950 border border-gray-200/80 dark:border-navy-800 rounded-2xl p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-brand-orange/20 focus-within:border-brand-orange transition-all group">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple accept="image/*,application/pdf" />
            <button 
                onClick={() => fileInputRef.current?.click()} 
                className="p-2.5 text-gray-400 hover:text-brand-orange hover:bg-gray-50 dark:hover:bg-navy-900 rounded-xl transition-colors relative"
            >
              <Paperclip className="h-5 w-5" />
              {attachments.length > 0 && <span className="absolute top-1 right-1 bg-brand-orange text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-navy-950">{attachments.length}</span>}
            </button>
            
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className="flex-1 bg-transparent text-navy-900 dark:text-white border-0 focus:ring-0 outline-none resize-none py-2.5 px-1 text-sm max-h-32"
              rows={1}
            />
            
            <button
              onClick={handleSend}
              disabled={(!input.trim() && attachments.length === 0) || isLoading}
              className="bg-brand-orange text-white p-2.5 rounded-xl hover:bg-brand-hover transition-all disabled:opacity-20 shadow-sm shrink-0"
            >
              {isLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Send className="h-4.5 w-4.5" />}
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-4 font-medium uppercase tracking-[0.2em]">
             AI can make mistakes. Verify important facts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
