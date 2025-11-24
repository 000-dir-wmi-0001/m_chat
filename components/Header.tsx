'use client';

import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b px-4 py-3" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--fg)' }}>
            M Chat
          </h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Temporary chat rooms
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--fg)' }}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
}