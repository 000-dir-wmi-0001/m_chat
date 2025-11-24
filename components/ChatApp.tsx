'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import SafetyWarning from './SafetyWarning';
import HomeScreen from './HomeScreen';
import ChatScreen from './ChatScreen';
import Header from './Header';
import Footer from './Footer';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
}

export default function ChatApp() {
  const [screen, setScreen] = useState<'warning' | 'home' | 'chat'>('warning');
  const [roomCode, setRoomCode] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [displayCode, setDisplayCode] = useState<string>('');

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'ws://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const generateCode = () => {
    console.log('Emitting createRoom event');
    socket?.emit('createRoom', {}, (response: { code?: string; error?: string }) => {
      console.log('Received createRoom response:', response);
      if (response.error) {
        alert(response.error);
        return;
      }
      if (response.code) {
        setRoomCode(response.code);
        setDisplayCode(response.code);
      }
    });
  };

  const joinCode = (code: string) => {
    socket?.emit('joinRoom', { code }, (response: any) => {
      if (response.success) {
        setRoomCode(code);
        setMessages(response.messages?.map((msg: any, index: number) => ({
          id: index.toString(),
          text: msg.text,
          sender: msg.sender === socket?.id ? 'me' : 'other',
          timestamp: new Date(msg.timestamp)
        })) || []);
        setScreen('chat');
      } else {
        alert(response.error || 'Failed to join room');
      }
    });
  };

  const sendMessage = (message: string) => {
    socket?.emit('sendMessage', { code: roomCode, text: message }, (response: { success: boolean }) => {
      if (response.success) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: message,
          sender: 'me',
          timestamp: new Date()
        }]);
      }
    });
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: { sender: string; text: string; timestamp: string }) => {
      if (data.sender !== socket.id) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: data.text,
          sender: 'other',
          timestamp: new Date(data.timestamp)
        }]);
      }
    };

    const handleUserJoined = (data: { userId: string }) => {
      console.log('User joined:', data.userId);
      // Auto-redirect to chat when someone joins your room
      if (screen === 'home' && roomCode) {
        setScreen('chat');
      }
    };

    const handleUserLeft = (data: { userId: string }) => {
      console.log('User left:', data.userId);
    };

    const handleUserDisconnected = () => {
      alert('Other user disconnected. Returning to home.');
      setScreen('home');
      setRoomCode('');
      setMessages([]);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('userDisconnected', handleUserDisconnected);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('userDisconnected', handleUserDisconnected);
    };
  }, [socket, screen, roomCode]);

  const acceptWarning = () => {
    setScreen('home');
  };

  const leaveChat = () => {
    // Emit leave room event to notify other user
    socket?.emit('leaveRoom', { code: roomCode });
    setScreen('home');
    setRoomCode('');
    setMessages([]);
  };

  if (screen === 'warning') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
        <Header />
        <SafetyWarning onAccept={acceptWarning} />
        <Footer />
      </div>
    );
  }

  if (screen === 'home') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
        <Header />
        <HomeScreen onGenerateCode={generateCode} onJoinCode={joinCode} generatedCode={displayCode} />
        <Footer />
      </div>
    );
  }

  return (
    <ChatScreen
      roomCode={roomCode}
      messages={messages}
      onSendMessage={sendMessage}
      onLeaveChat={leaveChat}
    />
  );
}