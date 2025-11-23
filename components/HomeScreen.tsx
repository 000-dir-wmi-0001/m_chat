'use client';

import { useState } from 'react';
import { useTheme } from './ThemeProvider';

interface HomeScreenProps {
  onGenerateCode: () => void;
  onJoinCode: (code: string) => void;
  generatedCode?: string;
}

export default function HomeScreen({ onGenerateCode, onJoinCode, generatedCode = '' }: HomeScreenProps) {
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleGenerateCode = () => {
    setIsGenerating(true);
    onGenerateCode();
    setTimeout(() => setIsGenerating(false), 3000);
  };

  const copyGeneratedCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  const handleJoinCode = (code: string) => {
    if (code.length === 6) {
      setIsJoining(true);
      onJoinCode(code);
      setTimeout(() => setIsJoining(false), 2000);
    }
  };

  const handleCodeInput = (value: string) => {
    const code = value.slice(0, 6);
    setJoinCodeInput(code);
    // Auto-join when 6 digits are entered
    if (code.length === 6) {
      handleJoinCode(code);
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
        
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--fg)' }}>
              Generate Chat Code
            </h2>
            <button
              onClick={handleGenerateCode}
              disabled={isGenerating}
              className="w-full font-medium py-3 px-6 rounded-lg transition-colors border disabled:opacity-50 flex items-center justify-center"
              style={{ background: 'var(--fg)', color: 'var(--bg)', borderColor: 'var(--fg)' }}
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
              ) : (
                'Generate Chat Code'
              )}
            </button>
            <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
              Share the code with someone to start chatting
            </p>
            {generatedCode && (
              <div className="mt-4 p-4 border rounded-lg" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>Your Chat Code:</p>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-2xl font-bold tracking-widest" style={{ color: 'var(--fg)' }}>
                    {generatedCode}
                  </span>
                  <button
                    onClick={copyGeneratedCode}
                    className="px-3 py-1 text-sm border rounded transition-colors"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--fg)' }}
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
                  Share this code with someone to start chatting
                </p>
              </div>
            )}
          </div>

          <div className="border-t pt-6" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-semibold mb-4 text-center" style={{ color: 'var(--fg)' }}>
              Join with Code
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={joinCodeInput}
                onChange={(e) => handleCodeInput(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none text-center text-lg tracking-widest"
                style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--fg)' }}
                maxLength={6}
                disabled={isJoining}
              />
              <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
                Auto-joins when 6 digits entered
              </p>
              {isJoining && (
                <div className="w-full py-3 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" style={{ borderColor: 'var(--fg)' }}></div>
                  <span className="ml-2" style={{ color: 'var(--fg)' }}>Joining...</span>
                </div>
              )}
              {generatedCode && (
                <button
                  onClick={() => handleCodeInput(generatedCode)}
                  className="w-full font-medium py-2 px-4 rounded-lg transition-colors border text-sm"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--fg)' }}
                >
                  Join Your Own Room
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}