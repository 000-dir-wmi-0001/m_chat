'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Copy } from 'lucide-react';

interface HomeScreenProps {
  onGenerateCode: () => void;
  onJoinCode: (code: string) => void;
  generatedCode?: string;
}

export default function HomeScreen({ onGenerateCode, onJoinCode, generatedCode = '' }: HomeScreenProps) {
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');


  const handleGenerateCode = () => {
    setIsGenerating(true);
    onGenerateCode();
    setTimeout(() => setIsGenerating(false), 3000);
  };

  const copyGeneratedCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  // Generate QR code when code is available
  useEffect(() => {
    if (generatedCode) {
      const roomUrl = `${window.location.origin}?join=${generatedCode}`;
      QRCode.toDataURL(roomUrl, { width: 200, margin: 2 })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('QR Code generation failed:', err));
    } else {
      setQrCodeUrl('');
    }
  }, [generatedCode]);

  // Check URL for join parameter on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const joinCode = urlParams.get('join');
    if (joinCode && joinCode.length === 6) {
      setJoinCodeInput(joinCode);
      handleJoinCode(joinCode);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

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
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6" style={{ background: 'var(--bg)' }}>
      <div className="rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 w-full max-w-sm sm:max-w-md lg:max-w-4xl xl:max-w-5xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          <div className="text-center">
            {generatedCode ? (
              <div className="p-3 sm:p-4 lg:p-6 border rounded-lg" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <p className="text-xs sm:text-sm lg:text-base mb-3 lg:mb-4" style={{ color: 'var(--muted)' }}>Your Chat Code:</p>
                
                {/* Code Display */}
                <div className="text-center mb-4 lg:mb-6">
                  <div className="inline-flex items-center gap-3 lg:gap-4 p-3 lg:p-4 border rounded-lg" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                    <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold tracking-widest" style={{ color: 'var(--fg)' }}>
                      {generatedCode}
                    </span>
                    <button
                      onClick={copyGeneratedCode}
                      className="p-2 lg:p-3 rounded-md border transition-colors hover:opacity-80"
                      style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--fg)' }}
                      title="Copy code"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                {/* QR Code Display */}
                {qrCodeUrl && (
                  <div className="text-center">
                    <p className="text-xs sm:text-sm lg:text-base mb-2 lg:mb-3" style={{ color: 'var(--muted)' }}>Or scan QR code:</p>
                    <div className="inline-block p-2 lg:p-3 border rounded-lg" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                      <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48" />
                    </div>
                  </div>
                )}
                
                <p className="text-xs sm:text-sm lg:text-base mt-3 lg:mt-4 text-center" style={{ color: 'var(--muted)' }}>
                  Share code or QR with someone to start chatting
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold" style={{ color: 'var(--muted)' }}>M Chat</h2>
              </div>
            )}
          </div>

          <div className="lg:border-l lg:border-t-0 border-t lg:pl-12 pt-4 sm:pt-6 lg:pt-0" style={{ borderColor: 'var(--border)' }}>
            <div className="space-y-6 lg:space-y-8">
              <div className="text-center">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 lg:mb-6" style={{ color: 'var(--fg)' }}>
                  Generate Chat Code
                </h2>
                <button
                  onClick={handleGenerateCode}
                  disabled={isGenerating}
                  className="w-full font-medium py-2.5 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8 rounded-lg transition-colors border disabled:opacity-50 flex items-center justify-center text-sm sm:text-base lg:text-lg"
                  style={{ background: 'var(--fg)', color: 'var(--bg)', borderColor: 'var(--fg)' }}
                >
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-current border-t-transparent"></div>
                  ) : (
                    'Generate Chat Code'
                  )}
                </button>
                <p className="text-xs sm:text-sm lg:text-base mt-2 lg:mt-3" style={{ color: 'var(--muted)' }}>
                  Share the code with someone to start chatting
                </p>
              </div>

              <div className="text-center">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 lg:mb-6" style={{ color: 'var(--fg)' }}>
                  Join with Code or QR Scan
                </h2>
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={joinCodeInput}
                    onChange={(e) => handleCodeInput(e.target.value)}
                    className="w-full px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 border rounded-lg focus:outline-none text-center text-base sm:text-lg lg:text-xl tracking-widest"
                    style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--fg)' }}
                    maxLength={6}
                    disabled={isJoining}
                  />
                  <p className="text-xs sm:text-sm lg:text-base text-center" style={{ color: 'var(--muted)' }}>
                    Auto-joins when 6 digits entered or QR scanned
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
                      className="w-full font-medium py-2 lg:py-3 px-3 sm:px-4 lg:px-6 rounded-lg transition-colors border text-xs sm:text-sm lg:text-base"
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
      </div>
    </div>
  );
}