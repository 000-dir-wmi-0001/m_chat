'use client';

import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { X, QrCode } from 'lucide-react';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!videoRef.current) return;

    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        const url = new URL(result.data);
        const code = url.searchParams.get('join');
        if (code && code.length === 6) {
          onScan(code);
        } else {
          setError('Invalid QR code. Please scan a valid M Chat QR code.');
        }
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    qrScanner.start().catch((err) => {
      setError('Camera access denied or not available');
      console.error('QR Scanner error:', err);
    });

    setScanner(qrScanner);

    return () => {
      qrScanner.destroy();
    };
  }, [onScan]);

  const handleClose = () => {
    scanner?.destroy();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6" style={{ background: 'var(--bg)', backdropFilter: 'blur(8px)' }}>
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-12 sm:-top-14 lg:-top-16 right-0 p-2 sm:p-3 lg:p-4 rounded-full border transition-all hover:scale-105 z-10"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--fg)' }}
        >
          <X size={16} className="sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5" />
        </button>
        
        {/* Scanner Container */}
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          {/* Header */}
          <div className="p-4 sm:p-6 lg:p-8 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 lg:mb-4" style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
              <QrCode size={20} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 lg:mb-2" style={{ color: 'var(--fg)' }}>Scan QR Code</h3>
            <p className="text-xs sm:text-sm lg:text-base" style={{ color: 'var(--muted)' }}>Position the QR code within the frame</p>
          </div>
          
          {/* Camera View */}
          <div className="relative mx-3 sm:mx-6 lg:mx-8 mb-3 sm:mb-6 lg:mb-8">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden" style={{ aspectRatio: '1' }}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                style={{ background: 'var(--bg)' }}
              />
              
              {/* Scanning Frame Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
                  {/* Corner Brackets */}
                  <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 border-l-2 sm:border-l-3 lg:border-l-4 border-t-2 sm:border-t-3 lg:border-t-4 rounded-tl-lg" style={{ borderColor: 'var(--fg)' }}></div>
                  <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 border-r-2 sm:border-r-3 lg:border-r-4 border-t-2 sm:border-t-3 lg:border-t-4 rounded-tr-lg" style={{ borderColor: 'var(--fg)' }}></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 border-l-2 sm:border-l-3 lg:border-l-4 border-b-2 sm:border-b-3 lg:border-b-4 rounded-bl-lg" style={{ borderColor: 'var(--fg)' }}></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 border-r-2 sm:border-r-3 lg:border-r-4 border-b-2 sm:border-b-3 lg:border-b-4 rounded-br-lg" style={{ borderColor: 'var(--fg)' }}></div>
                  
                  {/* Scanning Line Animation */}
                  <div className="absolute inset-x-3 sm:inset-x-4 lg:inset-x-5 top-1/2 h-0.5 lg:h-1 animate-pulse" style={{ background: 'var(--fg)', opacity: 0.8 }}></div>
                </div>
              </div>
              
              {/* Error Overlay */}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
                  <div className="text-center px-4 sm:px-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full mx-auto mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
                      <X size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-400" />
                    </div>
                    <p className="text-white text-xs sm:text-sm lg:text-base font-medium">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 text-center">
            <p className="text-xs sm:text-sm lg:text-base" style={{ color: 'var(--muted)' }}>
              Ensure good lighting for best results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}