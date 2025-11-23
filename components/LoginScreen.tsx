'use client';

import { useState } from 'react';
import { useTheme } from './ThemeProvider';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogin = () => {
    if (username.trim()) {
      setIsLogging(true);
      setTimeout(() => {
        onLogin(username.trim());
        setIsLogging(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="rounded-2xl shadow-lg p-8 w-full max-w-md border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            Temporary Chat
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--fg)' }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <div className="text-center space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--fg)' }}>
              Login Required
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
              Enter your username to access secure temporary chat
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none text-center"
              style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--fg)' }}
            />
            <button
              onClick={handleLogin}
              disabled={!username.trim() || isLogging}
              className="w-full font-medium py-3 px-6 rounded-lg transition-colors border disabled:opacity-50 flex items-center justify-center"
              style={{ background: 'var(--fg)', color: 'var(--bg)', borderColor: 'var(--fg)' }}
            >
              {isLogging ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
              ) : (
                'Login'
              )}
            </button>
          </div>

          <div className="text-xs space-y-2" style={{ color: 'var(--muted)' }}>
            <p>🔐 Secure temporary chat rooms</p>
            <p>💬 No message storage or history</p>
            <p>⏰ Rooms expire automatically</p>
          </div>
        </div>
      </div>
    </div>
  );
}