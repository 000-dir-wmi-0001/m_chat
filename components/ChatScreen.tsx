'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

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
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="shadow-sm border-b px-4 py-3 flex items-center justify-between" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center space-x-3">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>Room Code:</span>
          <span className="font-mono text-lg font-bold" style={{ color: 'var(--fg)' }}>{roomCode}</span>
          <button
            onClick={copyCode}
            className="text-xs px-2 py-1 rounded transition-colors border"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--fg)' }}
          >
            Copy
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--fg)' }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            onClick={onLeaveChat}
            className="px-4 py-2 rounded-lg text-sm transition-colors border"
            style={{ background: 'var(--fg)', color: 'var(--bg)', borderColor: 'var(--fg)' }}
          >
            Leave Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center mt-8" style={{ color: 'var(--muted)' }}>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl border"
                style={{
                  background: message.sender === 'me' ? 'var(--fg)' : 'var(--card)',
                  color: message.sender === 'me' ? 'var(--bg)' : 'var(--fg)',
                  borderColor: 'var(--border)'
                }}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-3 border rounded-full focus:outline-none"
            style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--fg)' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isSending}
            className="px-6 py-3 rounded-full transition-colors border disabled:opacity-50 flex items-center justify-center min-w-[80px]"
            style={{ background: 'var(--fg)', color: 'var(--bg)', borderColor: 'var(--fg)' }}
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}