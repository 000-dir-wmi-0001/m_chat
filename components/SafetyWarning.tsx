'use client';

import { useTheme } from './ThemeProvider';

interface SafetyWarningProps {
  onAccept: () => void;
}

export default function SafetyWarning({ onAccept }: SafetyWarningProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ background: 'var(--bg)' }}>
      <div className="rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-lg border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--fg)' }}>
              🚨 Safety Warning
            </h1>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--muted)' }}>
              Please read before using M-Chat
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--fg)' }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <div className="space-y-4 text-sm sm:text-base" style={{ color: 'var(--fg)' }}>
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>❌ Do NOT share:</h3>
            <ul className="space-y-1 text-xs sm:text-sm" style={{ color: 'var(--muted)' }}>
              <li>• Passwords or OTPs</li>
              <li>• Bank details or financial info</li>
              <li>• Aadhaar, PAN, or ID documents</li>
              <li>• Personal sensitive information</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>⚠️ Do NOT use for:</h3>
            <ul className="space-y-1 text-xs sm:text-sm" style={{ color: 'var(--muted)' }}>
              <li>• Illegal activities or threats</li>
              <li>• Harassment or abuse</li>
              <li>• Financial scams or fraud</li>
              <li>• Sharing harmful content</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--muted)' }}>
              ℹ️ All messages are temporary and not stored. Use responsibly.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={onAccept}
            className="w-full font-medium py-3 px-6 rounded-lg transition-colors border"
            style={{ background: 'var(--fg)', color: 'var(--bg)', borderColor: 'var(--fg)' }}
          >
            I Understand - Continue
          </button>
          <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
            Report misuse: <span style={{ color: 'var(--fg)' }}>report@m-chat.com</span>
          </p>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Made by <a href="https://momin-mohasin.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium" style={{ color: 'var(--fg)' }}>Momin Mohasin</a>
          </p>
        </div>
      </div>
    </div>
  );
}