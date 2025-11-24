'use client';

export default function Footer() {
  return (
    <footer className="border-t px-4 py-3" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Made by <a href="https://momin-mohasin.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium" style={{ color: 'var(--fg)' }}>Momin Mohasin</a>
        </p>
      </div>
    </footer>
  );
}