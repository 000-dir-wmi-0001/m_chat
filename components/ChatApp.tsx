'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'react';
import { io, Socket } from 'socket.io-client';
import SafetyWarning from './SafetyWarning';
import HomeScreen from './HomeScreen';
import ChatScreen from './ChatScreen';
import VideoCall from './VideoCall';
import Header from './Header';
import Footer from './Footer';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  file?: { name: string; data: string; type: string; size: number };
}

export default function ChatApp() {
  const [screen, setScreen] = useState<'warning' | 'home' | 'chat' | 'video'>('warning');
  const [roomCode, setRoomCode] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [displayCode, setDisplayCode] = useState<string>('');
  const [totalUsers, setTotalUsers] = useState(1);
  const [chatMode, setChatMode] = useState<'text' | 'video'>('text');
  const [isInitiator, setIsInitiator] = useState(false);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'ws://localhost:3001', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
    setSocket(newSocket);

    newSocket.on('connect', () => console.log('Connected to server'));
    newSocket.on('disconnect', () => console.log('Disconnected from server'));

    return () => {
      newSocket.close();
    };
  }, []);

  const generateCode = (mode: 'text' | 'video' = 'text') => {
    console.log('Emitting createRoom event with mode:', mode);
    const event = mode === 'text' ? 'createRoom' : 'createVideoRoom';
    socket?.emit(event, (response: { code?: string; error?: string }) => {
      console.log('Received createRoom response:', response);
      if (response.error) {
        alert(response.error);
        return;
      }
      if (response.code) {
        setRoomCode(response.code);
        setDisplayCode(response.code);
        setChatMode(mode);
        setTotalUsers(1);
        setIsInitiator(true);
        setScreen('home');
      }
    });
  };

  const joinCode = (code: string, mode: 'text' | 'video' = 'text') => {
    const event = mode === 'text' ? 'joinRoom' : 'joinVideoRoom';
    socket?.emit(event, { code }, (response: any) => {
      if (response.success) {
        setRoomCode(code);
        setChatMode(mode);
        setTotalUsers(response.totalUsers || 1);
        setIsInitiator(false);
        console.log('Joined room, totalUsers:', response.totalUsers, 'mode:', mode);
        setMessages(response.messages?.map((msg: any, index: number) => ({
          id: index.toString(),
          text: msg.text,
          sender: msg.sender === socket?.id ? 'me' : 'other',
          timestamp: new Date(msg.timestamp)
        })) || []);
        if (response.totalUsers === 2) {
          setScreen(mode === 'video' ? 'video' : 'chat');
        } else {
          setScreen('home');
        }
      } else {
        alert(response.error || 'Failed to join room');
      }
    });
  };

  const sendMessage = (message: string, file?: { name: string; data: string; type: string; size: number }) => {
    if (file) {
      socket?.emit('sendFile', { code: roomCode, file }, (response: { success: boolean; error?: string }) => {
        if (response.success) {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: message,
            sender: 'me',
            timestamp: new Date(),
            file
          }]);
        } else if (response.error) {
          alert(response.error);
        }
      });
    } else {
      socket?.emit('sendMessage', { code: roomCode, text: message }, (response: { success: boolean; error?: string }) => {
        if (response.success) {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: message,
            sender: 'me',
            timestamp: new Date()
          }]);
        } else if (response.error) {
          alert(response.error);
        }
      });
    }
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

    const handleReceiveFile = (data: { sender: string; file: { name: string; data: string; type: string; size: number }; timestamp: number }) => {
      if (data.sender !== socket.id) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: '',
          sender: 'other',
          timestamp: new Date(data.timestamp),
          file: data.file
        }]);
      }
    };

    const handleUserJoined = (data: { userId: string; totalUsers: number }) => {
      console.log('User joined event - userId:', data.userId, 'totalUsers:', data.totalUsers, 'chatMode:', chatMode);
      setTotalUsers(data.totalUsers);
      if (roomCode && data.totalUsers === 2) {
        console.log('Redirecting to', chatMode === 'video' ? 'video' : 'chat');
        setScreen(chatMode === 'video' ? 'video' : 'chat');
      }
    };

    const handleUserLeft = (data: { userId: string; totalUsers: number }) => {
      console.log('User left:', data.userId);
      setTotalUsers(data.totalUsers);
    };

    const handleUserDisconnected = () => {
      alert('Room closed. Returning to home.');
      setScreen('home');
      setRoomCode('');
      setMessages([]);
      setTotalUsers(1);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('receiveFile', handleReceiveFile);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('userDisconnected', handleUserDisconnected);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('receiveFile', handleReceiveFile);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('userDisconnected', handleUserDisconnected);
    };
  }, [socket, roomCode, chatMode]);

  const acceptWarning = () => {
    setScreen('home');
  };

  const leaveChat = () => {
    socket?.emit('leaveRoom', { code: roomCode });
    setScreen('home');
    setRoomCode('');
    setMessages([]);
    setTotalUsers(1);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Header />
      
      <Activity mode={screen === 'warning' ? 'visible' : 'hidden'}>
        <SafetyWarning onAccept={acceptWarning} />
      </Activity>

      <Activity mode={screen === 'home' ? 'visible' : 'hidden'}>
        <HomeScreen onGenerateCode={(mode) => generateCode(mode)} onJoinCode={joinCode} generatedCode={displayCode} />
      </Activity>

      <Activity mode={screen === 'chat' ? 'visible' : 'hidden'}>
        <ChatScreen
          roomCode={roomCode}
          messages={messages}
          onSendMessage={sendMessage}
          onLeaveChat={leaveChat}
          totalUsers={totalUsers}
          onStartVideo={() => setScreen('video')}
        />
      </Activity>

      <Activity mode={screen === 'video' ? 'visible' : 'hidden'}>
        <VideoCall
          roomCode={roomCode}
          socket={socket}
          onEndCall={() => {
            setScreen('home');
            setRoomCode('');
            setTotalUsers(1);
          }}
          totalUsers={totalUsers}
          isInitiator={isInitiator}
        />
      </Activity>

      <Activity mode={screen !== 'video' ? 'visible' : 'hidden'}>
        <Footer />
      </Activity>
    </div>
  );
}
