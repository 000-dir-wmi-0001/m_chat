'use client';

import { useState, useRef, useEffect } from 'react';
import { Activity } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Download, Volume2, Speaker } from 'lucide-react';
import { Socket } from 'socket.io-client';

interface VideoCallProps {
  roomCode: string;
  socket: Socket | null;
  onEndCall: () => void;
  totalUsers: number;
  isInitiator: boolean;
}

export default function VideoCall({ roomCode, socket, onEndCall, totalUsers, isInitiator }: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const iceCandidateQueueRef = useRef<RTCIceCandidateInit[]>([]);
  const remoteDescriptionSetRef = useRef(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [remoteVolume, setRemoteVolume] = useState(100);
  const [audioLevel, setAudioLevel] = useState(0);
  const [speakingUser, setSpeakingUser] = useState<'local' | 'remote' | null>(null);
  const offerSentRef = useRef(false);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!callActive) return;
    callStartTimeRef.current = Date.now();
    const timer = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - callStartTimeRef.current!) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [callActive]);

  useEffect(() => {
    if (!socket) return;

    const handleCallEnded = () => {
      console.log('Other user ended the call');
      endCall();
    };

    const handleOffer = async (data: { offer: RTCSessionDescriptionInit; from: string }) => {
      try {
        if (!peerConnectionRef.current) initPeerConnection();
        
        if (!localStreamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true
          });
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          stream.getTracks().forEach(track => peerConnectionRef.current!.addTrack(track, stream));
        }
        
        await peerConnectionRef.current!.setRemoteDescription(new RTCSessionDescription(data.offer));
        remoteDescriptionSetRef.current = true;
        
        while (iceCandidateQueueRef.current.length > 0) {
          const candidate = iceCandidateQueueRef.current.shift();
          if (candidate) {
            await peerConnectionRef.current!.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error('Queued ICE error:', e));
          }
        }
        
        const answer = await peerConnectionRef.current!.createAnswer();
        await peerConnectionRef.current!.setLocalDescription(answer);
        socket.emit('answer', { answer, code: roomCode });
        
        setCallActive(true);
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    };

    const handleAnswer = async (data: { answer: RTCSessionDescriptionInit }) => {
      try {
        if (peerConnectionRef.current && peerConnectionRef.current.signalingState === 'have-local-offer') {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          remoteDescriptionSetRef.current = true;
          
          while (iceCandidateQueueRef.current.length > 0) {
            const candidate = iceCandidateQueueRef.current.shift();
            if (candidate) {
              await peerConnectionRef.current!.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error('Queued ICE error:', e));
            }
          }
        }
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    };

    const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit }) => {
      try {
        if (peerConnectionRef.current && data.candidate) {
          if (remoteDescriptionSetRef.current) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          } else {
            iceCandidateQueueRef.current.push(data.candidate);
          }
        }
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    };

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('callEnded', handleCallEnded);

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('callEnded', handleCallEnded);
    };
  }, [socket, roomCode]);

  useEffect(() => {
    if (totalUsers === 2 && !callActive && !offerSentRef.current && isInitiator) {
      const timer = setTimeout(() => startCall(), 500);
      return () => clearTimeout(timer);
    }
  }, [totalUsers, callActive, isInitiator]);

  const initPeerConnection = () => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }]
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('ice-candidate', { candidate: event.candidate, code: roomCode });
      }
    };

    peerConnection.ontrack = (event) => {
      if (event.track.kind === 'video' && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play().catch(e => {
          if (e.name !== 'AbortError') console.error('Play error:', e);
        });
      } else if (event.track.kind === 'audio' && remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
        remoteAudioRef.current.volume = Math.min(remoteVolume / 100, 1);
      }
    };

    peerConnectionRef.current = peerConnection;
  };

  const startCall = async () => {
    try {
      if (offerSentRef.current) return;
      offerSentRef.current = true;

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      if (!peerConnectionRef.current) initPeerConnection();
      stream.getTracks().forEach(track => peerConnectionRef.current!.addTrack(track, stream));

      const offer = await peerConnectionRef.current!.createOffer();
      await peerConnectionRef.current!.setLocalDescription(offer);
      socket?.emit('offer', { offer, code: roomCode });

      setCallActive(true);
    } catch (error) {
      console.error('Error starting call:', error);
      offerSentRef.current = false;
      alert('Camera/microphone access denied');
    }
  };

  const startRecording = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d')!;

      const localStream = localVideoRef.current?.srcObject as MediaStream;
      const remoteStream = remoteVideoRef.current?.srcObject as MediaStream;

      const canvasStream = canvas.captureStream(30);
      remoteStream?.getAudioTracks().forEach(track => canvasStream.addTrack(track));

      const recorder = new MediaRecorder(canvasStream, { mimeType: 'video/webm' });
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => recordedChunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `call-${roomCode}-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      const drawFrame = () => {
        if (localVideoRef.current && remoteVideoRef.current) {
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(localVideoRef.current, 0, 0, 640, 720);
          ctx.drawImage(remoteVideoRef.current, 640, 0, 640, 720);
        }
        if (mediaRecorderRef.current?.state === 'recording') {
          requestAnimationFrame(drawFrame);
        }
      };
      drawFrame();
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Recording failed');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  };

  const endCall = () => {
    if (isRecording) stopRecording();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (remoteVideoRef.current?.srcObject) {
      (remoteVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
    if (remoteAudioRef.current?.srcObject) {
      (remoteAudioRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    localStreamRef.current = null;
    offerSentRef.current = false;
    remoteDescriptionSetRef.current = false;
    iceCandidateQueueRef.current = [];
    setCallActive(false);
    setCallDuration(0);
    socket?.emit('endCall', { code: roomCode });
    socket?.emit('leaveVideoRoom', { code: roomCode });
    onEndCall();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <audio ref={remoteAudioRef} autoPlay playsInline />
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Local Video */}
        <div className="relative rounded-lg overflow-hidden border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
            You
          </div>
        </div>

        {/* Remote Video */}
        <div className="relative rounded-lg overflow-hidden border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
            Guest
          </div>
          {callActive && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <Volume2 size={16} style={{ color: 'var(--fg)' }} />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={remoteVolume}
                onChange={(e) => {
                  const vol = Number(e.target.value);
                  setRemoteVolume(vol);
                  if (remoteAudioRef.current) {
                    remoteAudioRef.current.volume = Math.min(vol / 100, 1);
                  }
                }}
                className="w-20"
              />
            </div>
          )}
        </div>
      </div>

      {/* Call Duration */}
      <Activity mode={callActive ? 'visible' : 'hidden'}>
        <div className="text-center py-2" style={{ background: 'var(--card)', borderColor: 'var(--border)', borderTop: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--fg)', fontSize: '14px', fontWeight: '500' }}>
            {formatDuration(callDuration)} {isRecording && <Download size={14} className="inline ml-2" style={{ color: '#ef4444' }} />}
          </span>
        </div>
      </Activity>

      {/* Controls */}
      <div className="border-t p-4 flex items-center justify-center gap-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <Activity mode={!callActive ? 'visible' : 'hidden'}>
          <button
            onClick={startCall}
            disabled={totalUsers < 2}
            className="px-6 py-3 rounded-full font-medium flex items-center gap-2 border transition-all disabled:opacity-50"
            style={{ background: 'var(--fg)', color: 'var(--bg)', borderColor: 'var(--fg)' }}
          >
            <Phone size={18} />
            {totalUsers < 2 ? 'Waiting for other user...' : 'Start Call'}
          </button>
        </Activity>

        <Activity mode={callActive ? 'visible' : 'hidden'}>
          <button
            onClick={toggleMute}
            className="px-4 py-3 rounded-full border transition-all"
            style={{ background: isMuted ? 'var(--fg)' : 'var(--card)', color: isMuted ? 'var(--bg)' : 'var(--fg)', borderColor: 'var(--border)' }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button
            onClick={toggleVideo}
            className="px-4 py-3 rounded-full border transition-all"
            style={{ background: isVideoOff ? 'var(--fg)' : 'var(--card)', color: isVideoOff ? 'var(--bg)' : 'var(--fg)', borderColor: 'var(--border)' }}
            title={isVideoOff ? 'Turn on video' : 'Turn off video'}
          >
            {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
          </button>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className="px-4 py-3 rounded-full border transition-all"
            style={{ background: isRecording ? '#ef4444' : 'var(--card)', color: isRecording ? 'white' : 'var(--fg)', borderColor: isRecording ? '#ef4444' : 'var(--border)' }}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            <Download size={18} />
          </button>
          <button
            onClick={endCall}
            className="px-6 py-3 rounded-full font-medium flex items-center gap-2 border transition-all"
            style={{ background: '#ef4444', color: 'white', borderColor: '#ef4444' }}
          >
            <PhoneOff size={18} />
            End Call
          </button>
        </Activity>
      </div>
    </div>
  );
}
