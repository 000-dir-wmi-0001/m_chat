'use client';

import { AlertTriangle, X, AlertCircle, Info, Shield, CheckCircle, ArrowRight, Mail } from 'lucide-react';

interface SafetyWarningProps {
  onAccept: () => void;
}

export default function SafetyWarning({ onAccept }: SafetyWarningProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-auto" style={{ background: 'var(--bg)' }}>
      <div className="rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full mb-3 sm:mb-4" style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
            <AlertTriangle size={20} className="sm:w-6 sm:h-6 md:w-8 md:h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
            Safety Warning
          </h1>
          <p className="text-sm sm:text-base md:text-lg" style={{ color: 'var(--muted)' }}>
            Read before using M Chat
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="p-3 sm:p-4 md:p-5 rounded-xl border transition-all hover:scale-[1.02]" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <div className="p-1.5 sm:p-2 rounded-lg" style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
                <X size={14} className="sm:w-4 sm:h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base md:text-lg" style={{ color: 'var(--fg)' }}>Never Share</h3>
            </div>
            <ul className="text-xs sm:text-sm space-y-1.5 sm:space-y-2" style={{ color: 'var(--muted)' }}>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ background: 'var(--fg)' }}></div>
                <span>Passwords/OTPs</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ background: 'var(--fg)' }}></div>
                <span>Bank details</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ background: 'var(--fg)' }}></div>
                <span>ID documents</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ background: 'var(--fg)' }}></div>
                <span>Personal info</span>
              </li>
            </ul>
          </div>

          <div className="p-3 sm:p-4 md:p-5 rounded-xl border transition-all hover:scale-[1.02]" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <div className="p-1.5 sm:p-2 rounded-lg" style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
                <AlertCircle size={14} className="sm:w-4 sm:h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base md:text-lg" style={{ color: 'var(--fg)' }}>Prohibited</h3>
            </div>
            <ul className="text-xs sm:text-sm space-y-1.5 sm:space-y-2" style={{ color: 'var(--muted)' }}>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ background: 'var(--fg)' }}></div>
                <span>Illegal activities</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ background: 'var(--fg)' }}></div>
                <span>Harassment</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ background: 'var(--fg)' }}></div>
                <span>Scams/fraud</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ background: 'var(--fg)' }}></div>
                <span>Harmful content</span>
              </li>
            </ul>
          </div>

          <div className="p-3 sm:p-4 md:p-5 rounded-xl border transition-all hover:scale-[1.02] md:col-span-2 lg:col-span-1" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <div className="p-1.5 sm:p-2 rounded-lg" style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
                <Shield size={14} className="sm:w-4 sm:h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base md:text-lg" style={{ color: 'var(--fg)' }}>Privacy</h3>
            </div>
            <p className="text-xs sm:text-sm mb-3" style={{ color: 'var(--muted)' }}>Messages auto-delete after session</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm" style={{ color: 'var(--fg)' }}>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ background: 'var(--fg)' }}></div>
                <span>Temporary</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ background: 'var(--fg)' }}></div>
                <span>No Storage</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onAccept}
            className="w-full font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl border text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3"
            style={{ background: 'var(--fg)', color: 'var(--bg)', borderColor: 'var(--fg)' }}
          >
            <CheckCircle size={16} className="sm:w-5 sm:h-5" />
            <span>I Understand & Accept</span>
            <ArrowRight size={16} className="sm:w-5 sm:h-5" />
          </button>
          
          <div className="text-center p-3 sm:p-4 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Info size={14} className="sm:w-4 sm:h-4" style={{ color: 'var(--muted)' }} />
              <span className="font-bold text-xs sm:text-sm" style={{ color: 'var(--fg)' }}>Need Help?</span>
            </div>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--muted)' }}>
              Report misuse or get support:
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <Mail size={12} className="sm:w-3 sm:h-3" style={{ color: 'var(--fg)' }} />
              <span className="font-bold text-xs sm:text-sm" style={{ color: 'var(--fg)' }}>report@m-chat.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}