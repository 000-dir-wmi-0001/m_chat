'use client';

export default function Footer() {
  return (
    <footer className="border-t px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-xs sm:text-sm lg:text-base" style={{ color: 'var(--muted)' }}>
          Made by <a href="https://momin-mohasin.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium transition-colors" style={{ color: 'var(--fg)' }}>Momin Mohasin</a>
        </p>
      </div>
    </footer>
  );
}