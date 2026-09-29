import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, DailyStats, UserPreferences } from '../types';
import { sendCoachMessage, CoachContext } from '../services/aiCoachService';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ArrowRight,
  Clock,
  Flame,
  Shield,
  MessageSquare,
} from 'lucide-react';

interface Props {
  stats: DailyStats;
  prefs: UserPreferences;
  sittingMinutes: number;
  onStartRoutine: (routineId?: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const AICoachPage: React.FC<Props> = ({
  stats,
  prefs,
  sittingMinutes,
  onStartRoutine,
  onNavigateTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-intro',
      sender: 'bot',
      text: `Hello ${prefs.name}! I'm DeskMate, your personal workplace wellness companion. You've been sitting for ${sittingMinutes} minutes today with ${stats.breaksTaken} movement breaks logged.\n\nHow is your body feeling right now? Let me know if your neck, shoulders, or lower back could use a reset.`,
      timestamp: 'Just now',
      actions: [
        { label: 'Start 2-Minute Reset', actionType: 'start_break' },
        { label: "I've been sitting for 3 hours", actionType: 'prompt', payload: "I've been sitting for three hours" },
        { label: 'My neck feels stiff', actionType: 'prompt', payload: 'My neck and shoulders feel stiff' },
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    const context: CoachContext = {
      sittingTimeMinutes: sittingMinutes,
      breaksToday: stats.breaksTaken,
      movementScore: stats.movementScore,
      postureStatus: stats.postureChecks > 0 ? 'Checked today' : 'Needs alignment check',
      primaryGoal: prefs.goals[0] || 'Better posture',
    };

    try {
      const response = await sendCoachMessage(text, context, messages);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: 'Just now',
        actions: response.actions,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.warn('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: NonNullable<ChatMessage['actions']>[number]) => {
    if (action.actionType === 'start_break') {
      onStartRoutine('quick-reset');
    } else if (action.actionType === 'check_posture') {
      onNavigateTab('posture');
    } else if (action.actionType === 'open_exercise') {
      onNavigateTab('exercises');
    } else if (action.actionType === 'prompt' && action.payload) {
      handleSendMessage(action.payload);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Wellness Assistant</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            DeskMate Coach
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Personalized, non-medical micro-movement recommendations based on your workday rhythm.
          </p>
        </div>

        {/* Real-time Context Snapshot */}
        <div className="flex items-center gap-3 text-xs font-medium text-stone-600 bg-white border border-stone-200/80 px-3.5 py-2 rounded-2xl shadow-xs self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Sitting: {sittingMinutes}m</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-emerald-600" />
            <span>Breaks: {stats.breaksTaken}</span>
          </div>
        </div>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-stone-400 whitespace-nowrap">Ask:</span>
        {[
          "I've been sitting for three hours",
          'My neck and shoulders feel stiff',
          'Give me a 60-second stretch',
          'I am feeling an afternoon energy slump',
          'How should I position my desk chair?',
        ].map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700 whitespace-nowrap shadow-2xs transition active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-5 sm:p-6 min-h-[460px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-2xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'bot'
                  ? 'bg-emerald-800 text-emerald-100 shadow-xs'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-2.5">
              <div
                className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-none font-medium'
                    : 'bg-stone-50 text-stone-800 border border-stone-200/70 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {msg.text}
              </div>

              {/* Action Buttons inside Bot message */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {msg.actions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => handleActionClick(act)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition shadow-xs active:scale-95"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-700" />
                      <span>{act.label}</span>
                      <ArrowRight className="w-3 h-3 text-emerald-700" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-emerald-100 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>DeskMate is thinking of a gentle routine...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tell DeskMate how your workday feels (e.g. 'I feel tight between my shoulder blades')..."
          className="flex-1 pl-4 pr-12 py-3 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition text-stone-900 placeholder:text-stone-400 shadow-xs"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:pointer-events-none transition shadow-xs active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Safety Note Footer */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 text-center">
        <Shield className="w-3.5 h-3.5 text-stone-400" />
        <span>
          DeskMate provides wellness ergonomics recommendations and is not intended for medical diagnosis.
        </span>
      </div>
    </div>
  );
};
