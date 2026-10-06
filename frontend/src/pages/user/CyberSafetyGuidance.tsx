import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { GuidelineItem } from '../../types';
import {
  ShieldCheck,
  Bot,
  Send,
  Loader2,
  PhoneCall,
  Globe,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const CyberSafetyGuidance: React.FC = () => {
  const [guidelines, setGuidelines] = useState<GuidelineItem[]>([]);
  const [loadingGuidelines, setLoadingGuidelines] = useState(true);

  // AI Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am the FraudLens AI Cyber Safety Advisor. If you have been targeted by cyber fraud, need immediate steps for lost money, or want to verify if a message is a scam, ask me below!',
    },
  ]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const loadGuidelines = async () => {
      try {
        const data = await api.getGuidelines();
        if (data && data.length > 0) {
          setGuidelines(data);
        }
      } catch (err) {
        console.error('Failed to load guidelines:', err);
      } finally {
        setLoadingGuidelines(false);
      }
    };
    loadGuidelines();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatLoading) return;

    const userMsg = input.trim();
    setInput('');
    const updatedMessages: ChatMessage[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(updatedMessages);
    setChatLoading(true);

    try {
      const historyForApi = updatedMessages.map((m) => ({ role: m.role, content: m.content }));
      const reply = await api.askCyberAssistant(userMsg, historyForApi.slice(0, -1));
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue connecting to the AI engine. Please call the 1930 National Cyber Helpline immediately.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
            Official Cyber Defense Resources
          </span>
          <h1 className="text-2xl font-extrabold mt-1">Cyber Safety & Victim Guidance</h1>
          <p className="text-sm text-blue-100 mt-1 max-w-xl">
            Official Cyber Safety Guidelines backed by 24/7 AI-powered emergency advice.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="bg-white/10 border border-white/20 px-4 py-3 rounded-xl flex items-center gap-3">
            <PhoneCall className="text-red-300" size={24} />
            <div>
              <p className="text-[11px] text-blue-200 font-bold uppercase">National Helpline</p>
              <p className="text-lg font-black tracking-wide">1930</p>
            </div>
          </div>
          <div className="bg-white/10 border border-white/20 px-4 py-3 rounded-xl flex items-center gap-3">
            <Globe className="text-emerald-300" size={24} />
            <div>
              <p className="text-[11px] text-blue-200 font-bold uppercase">National Portal</p>
              <p className="text-xs font-bold font-mono">cybercrime.gov.in</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Section: AI Advisor & Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: AI Cyber Safety Assistant */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 flex flex-col h-[580px]">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">AI Cyber Safety Advisor</h2>
              <p className="text-xs text-gray-500">Ask emergency questions or verify scam scenarios</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    <Bot size={15} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-800 text-white rounded-tr-none'
                      : 'bg-gray-100 text-gray-800 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-400 p-2">
                <Loader2 size={14} className="animate-spin text-blue-600" />
                <span>AI Advisor is analyzing...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="pt-3 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              placeholder="e.g. Someone sent an APK file for electricity bill..."
              className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={chatLoading || !input.trim()}
              className="bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <Send size={13} />
              <span>Ask</span>
            </button>
          </form>
        </div>

        {/* Right: Safety Guidelines */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-700" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Standard Safety Guidelines</h2>
          </div>

          {loadingGuidelines ? (
            <div className="p-8 text-center text-gray-400">
              <Loader2 size={24} className="animate-spin mx-auto mb-2 text-blue-700" />
              <p className="text-xs">Loading official safety guidelines...</p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
              {guidelines.map((g, idx) => (
                <div
                  key={g._id || idx}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-gray-300 transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-bold text-sm text-gray-900">{g.title}</h3>
                    {g.category && (
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {g.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{g.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CyberSafetyGuidance;
