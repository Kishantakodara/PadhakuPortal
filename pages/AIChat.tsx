
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, AlertTriangle, Paperclip, X, Image as ImageIcon, FileText, Plus } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
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

// Lightweight Markdown Renderer for Chat
const MarkdownLite: React.FC<{ text: string }> = ({ text }) => {
  const renderLine = (line: string, index: number) => {
    const processInline = (str: string) => {
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

    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      return (
        <li key={index} className="ml-4 mb-1">
          {processInline(line.trim().substring(2))}
        </li>
      );
    }

    if (!line.trim()) return <div key={index} className="h-1" />;
    
    return (
      <p key={index} className="mb-1 last:mb-0">
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
      text: "Hi there! I'm your **AI Study Companion**. \n\nI can help you with:\n- Solving homework problems (upload a photo!)\n- Explaining complex concepts\n- Finding resources in the library\n\nWhat are you working on today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [attachments, setAttachments] = useState<AttachmentData[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');
  const hasProcessedQuery = useRef(false);

  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const resourceContext = `
      Library Materials:
      Departments: ${DEPARTMENTS.map(d => `${d.name} (${d.code})`).join(', ')}.
      Recent Notes: ${NOTES.slice(0, 5).map(n => n.title).join(', ')}.
      PYQs: ${PYQS.slice(0, 5).map(p => p.title).join(', ')}.
      `;

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are an expert academic tutor. Help students learn with clear, accurate explanations.
          FORMATTING RULES:
          - Use **Markdown** for all responses.
          - Use **bold text** for important definitions and keywords.
          - Use bulleted lists for multi-step explanations.
          - Use inline code (\`formula\`) for mathematical variables or code snippets.
          - Keep paragraphs short and use spacing between sections.
          ${resourceContext}`,
        }
      });
      setChatSession(chat);
    } catch (error) {
      console.error("Failed to initialize AI chat:", error);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, attachments]);

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
     if ((!text.trim() && currentAttachments.length === 0) || isLoading || !chatSession) return;
     
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
      const parts: any[] = [];
      if (text) parts.push({ text: text });
      else if (currentAttachments.length > 0) parts.push({ text: 'Analyze this.' });
      currentAttachments.forEach(att => {
          parts.push({ inlineData: { mimeType: att.mimeType, data: att.base64 } });
      });

      const response: GenerateContentResponse = await chatSession.sendMessage({ message: parts });
      const responseText = response.text;
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (error: any) {
      const isRateLimit = String(error?.message || error).includes('429');
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: isRateLimit ? "Usage limit hit. Please wait a moment." : "Error occurred. Please try again.",
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    const currentAttachments = [...attachments];
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

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 dark:bg-navy-950 animate-fade-in-up">
      <div className="bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-navy-800 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-brand-orange/10 p-2 rounded-lg"><Bot className="h-6 w-6 text-brand-orange" /></div>
          <div>
            <h1 className="text-lg font-bold text-navy-900 dark:text-white flex items-center gap-2">AI Study Companion <Sparkles className="h-4 w-4 text-yellow-500" /></h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Gemini 3 Flash</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-navy-900 dark:bg-white text-white dark:text-navy-900' : 'bg-brand-orange text-white'}`}>
              {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
            </div>
            <div className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.attachments?.length && (
                <div className={`flex flex-wrap gap-2 mb-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.attachments.map((att, i) => (
                    <div key={i} className="overflow-hidden rounded-xl border border-gray-200 dark:border-navy-700 shadow-sm bg-white dark:bg-navy-800 max-w-[200px]">
                      {att.mimeType.startsWith('image/') ? <img src={att.url} alt="Uploaded" className="max-h-40 w-full object-cover" /> : <div className="p-3 flex items-center gap-3"><FileText className="h-6 w-6 text-red-500 flex-shrink-0" /><span className="text-xs font-medium text-navy-900 dark:text-white truncate">{att.name}</span></div>}
                    </div>
                  ))}
                </div>
              )}
              {msg.text && (
                <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
                  msg.role === 'user' ? 'bg-navy-900 text-white rounded-tr-none dark:bg-brand-orange' : msg.isError ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 rounded-tl-none' : 'bg-white dark:bg-navy-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-navy-700 rounded-tl-none'
                }`}>
                  <MarkdownLite text={msg.text} />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-sm"><Bot className="h-5 w-5 animate-pulse" /></div>
              <div className="bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                 <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />
                 <span className="text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white dark:bg-navy-900 border-t border-gray-200 dark:border-navy-800 p-4">
        <div className="max-w-4xl mx-auto">
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-3 animate-slide-up">
              {attachments.map((att, index) => (
                <div key={index} className="group relative flex items-center gap-2 bg-gray-50 dark:bg-navy-950 p-2 rounded-xl border border-gray-200 dark:border-navy-800 max-w-[180px] hover:shadow-md transition-shadow">
                  <div className="relative flex-shrink-0 h-10 w-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-navy-900">
                    {att.mimeType.startsWith('image/') ? <img src={att.previewUrl} alt="Preview" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center bg-red-100 dark:bg-red-900/30"><FileText className="h-5 w-5 text-red-500" /></div>}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-medium text-navy-900 dark:text-white truncate block pr-4" title={att.file.name}>{att.file.name}</span>
                      <span className="text-[10px] text-gray-500 uppercase">{att.mimeType.split('/')[1]}</span>
                  </div>
                  <button onClick={() => removeAttachment(index)} className="absolute -top-2 -right-2 bg-white dark:bg-navy-800 text-gray-500 hover:text-red-500 border border-gray-200 dark:border-navy-700 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity scale-90 hover:scale-100"><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}
          <div className="relative flex items-end gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple accept="image/*,application/pdf" />
            <button onClick={() => fileInputRef.current?.click()} className="bg-gray-100 dark:bg-navy-800 text-gray-500 dark:text-gray-400 p-3.5 rounded-2xl hover:text-navy-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-navy-700 transition-colors flex-shrink-0 relative group">
              <Paperclip className="h-5 w-5" />
              {attachments.length > 0 && <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-navy-900 animate-bounce">{attachments.length}</span>}
            </button>
            <div className="relative flex-1">
              <textarea 
                ref={inputRef} 
                value={input} 
                onChange={(e) => { 
                  setInput(e.target.value); 
                  e.target.style.height = 'auto'; 
                  e.target.style.height = e.target.scrollHeight + 'px'; 
                }} 
                onKeyDown={handleKeyDown} 
                placeholder="Ask a question or upload files..." 
                className="w-full bg-gray-100 dark:bg-navy-950 text-navy-900 dark:text-white border-0 rounded-[1.5rem] pl-5 pr-16 py-5 focus:ring-2 focus:ring-brand-orange resize-none max-h-48 shadow-inner text-base md:text-lg transition-all" 
                rows={1} 
              />
              <button 
                onClick={handleSend} 
                disabled={(!input.trim() && attachments.length === 0) || isLoading} 
                className="absolute right-3 bottom-3 bg-brand-orange text-white p-3 rounded-2xl hover:bg-brand-hover hover:scale-110 active:scale-95 transition-all disabled:opacity-50 shadow-md"
              >
                <Send className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
