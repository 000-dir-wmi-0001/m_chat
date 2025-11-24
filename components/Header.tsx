'use client';

import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold" style={{ color: 'var(--fg)' }}>
            M Chat
          </h1>
          <p className="text-xs sm:text-sm lg:text-base" style={{ color: 'var(--muted)' }}>
            Temporary chat rooms
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 lg:p-3 rounded-lg border transition-all hover:scale-105"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--fg)' }}
        >
          {theme === 'light' ? <Moon size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" /> : <Sun size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
        </button>
      </div>
    </header>
  );
}