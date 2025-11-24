'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { Copy, Moon, Sun, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
}

interface ChatScreenProps {
  roomCode: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onLeaveChat: () => void;
}

export default function ChatScreen({ roomCode, messages, onSendMessage, onLeaveChat }: ChatScreenProps) {
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() && !isSending) {
      setIsSending(true);
      onSendMessage(messageInput.trim());
      setMessageInput('');
      setTimeout(() => setIsSending(false), 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="shadow-sm border-b px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="text-xs sm:text-sm" style={{ color: 'var(--muted)' }}>Room:</span>
          <span className="font-mono text-base sm:text-lg font-bold" style={{ color: 'var(--fg)' }}>{roomCode}</span>
          <button
            onClick={copyCode}
            className="p-1.5 rounded transition-colors border"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--fg)' }}
            title="Copy room code"
          >
            <Copy size={14} />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--fg)' }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={onLeaveChat}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors border"
            style={{ background: 'var(--fg)', color: 'var(--bg)', borderColor: 'var(--fg)' }}
          >
            Leave Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4" style={{ maxHeight: 'calc(100vh - 140px)' }}>
        {messages.length === 0 ? (
          <div className="text-center mt-6 sm:mt-8" style={{ color: 'var(--muted)' }}>
            <p className="text-sm sm:text-base">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="group relative">
                <div
                  className="max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-2xl border"
                  style={{
                    background: message.sender === 'me' ? 'var(--fg)' : 'var(--card)',
                    color: message.sender === 'me' ? 'var(--bg)' : 'var(--fg)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <p className="text-sm sm:text-base break-words">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(message.text)}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity p-1 rounded-full border touch-manipulation"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--fg)' }}
                  title="Copy message"
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-3 sm:p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex space-x-2 sm:space-x-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border rounded-full focus:outline-none text-sm sm:text-base"
            style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--fg)' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isSending}
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-colors border disabled:opacity-50 flex items-center justify-center min-w-[60px] sm:min-w-[80px] text-sm sm:text-base"
            style={{ background: 'var(--fg)', color: 'var(--bg)', borderColor: 'var(--fg)' }}
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-current border-t-transparent"></div>
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Made by <a href="https://momin-mohasin.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium" style={{ color: 'var(--fg)' }}>Momin Mohasin</a>
          </p>
        </div>
      </div>
    </div>
  );
}