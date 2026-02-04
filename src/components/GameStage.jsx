import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Modal, Typography, ConfigProvider, theme } from 'antd';
import { 
  SettingFilled,
  SendOutlined,
  MessageFilled,
} from '@ant-design/icons';
import { useGames } from '../GameContext';
import { useTheme } from '../ThemeContext';

import WaitingModal from './GameStateComponent/WaitingModal';
import SettingsModal from './GameStateComponent/SettingsModal';
import LoginModal from './GameStateComponent/LoginModal';
import NotFound from './NotFound';

const { Title, Text } = Typography;

// Lazy load game components
const TicTacToe = lazy(() => import('../games/TicTacToe'));
const Minesweeper = lazy(() => import('../games/Minesweeper'));

const gameComponents = {
  tictactoe: TicTacToe,
  minesweeper: Minesweeper,
};

const GameStage = () => {
  const { id: paramId, roomId: paramRoomId, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { games, loading } = useGames();

  // Determine roomId and gameId from params/slug early
  let roomIdFromParams = paramRoomId;
  let gameIdFromParams = paramId;
  if (slug) {
    if (/^\d+$/.test(slug)) roomIdFromParams = slug;
    else gameIdFromParams = slug;
  }
  const stateGameFromLocation = location.state?.game;
  const initialGameId = gameIdFromParams || stateGameFromLocation?.id;
  const isCurrentlySinglePlayer = ['minesweeper', 'snake'].includes(initialGameId);

  // --- ALL HOOKS MUST BE AT THE TOP ---
  const [messages, setMessages] = useState([
    { id: 1, user: 'Hệ thống', text: 'Chào mừng bạn đến với phòng chơi!', isSystem: true },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isWaitingModalOpen, setIsWaitingModalOpen] = useState(!isCurrentlySinglePlayer);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const initialGuestName = localStorage.getItem('guestName') || '';
  const [players, setPlayers] = useState([
    { id: 'me', name: initialGuestName || 'Đang xác định...', avatar: initialGuestName ? initialGuestName.charAt(0).toUpperCase() : '👤', ready: false, score: 0 },
    { id: 'waiting', name: 'Đang chờ người chơi...', avatar: '?', ready: false, score: 0 }
  ]);
  const [roomGameId, setRoomGameId] = useState(null);
  const [roomLoading, setRoomLoading] = useState(false);
  const [roomError, setRoomError] = useState(null);
  const [roomCountdown, setRoomCountdown] = useState(null);
  const [isPlaying, setIsPlaying] = useState(isCurrentlySinglePlayer);
  
  // Guest system states
  const [guestName, setGuestName] = useState(localStorage.getItem('guestName') || '');
  const [showNameInput, setShowNameInput] = useState(!localStorage.getItem('guestName'));
  const [tempName, setTempName] = useState('');
  const [gameSettings, setGameSettings] = useState({
    timePerTurn: 30, // seconds
    timePerPerson: Infinity, // seconds
    firstPlayer: 'random', // 'me', 'opponent', 'random'
    boardSize: 3, // 3x3
    difficulty: 'easy',
    width: 9,
    height: 9,
    mines: 10
  });
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Determine roomId and gameId from params
  const roomId = roomIdFromParams;
  const gameId = gameIdFromParams;
  const stateGame = stateGameFromLocation;

  // Handle Guest Name Submission
  const handleNameSubmit = () => {
    if (tempName.trim()) {
      localStorage.setItem('guestName', tempName.trim());
      setGuestName(tempName.trim());
      setShowNameInput(false);
      // Update local players state immediately to avoid "loading" flash
      setPlayers([
        { id: 'me', name: tempName.trim(), avatar: tempName.trim().charAt(0).toUpperCase(), ready: false },
        { id: 'waiting', name: 'Đang chờ người chơi...', avatar: '?', ready: false }
      ]);
      // Notify sidebar to update
      window.dispatchEvent(new Event('guestNameChanged'));
    }
  };

  // Room sẽ được tạo tự động khi socket emit join_room
  // Không cần gọi API POST /api/rooms nữa

  // 2. Fetch room info if joining via direct link (Joiner)
  useEffect(() => {
    if (roomId && !gameId && !stateGame) {
      const fetchRoomInfo = async () => {
        setRoomLoading(true);
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const response = await fetch(`${apiUrl}/api/rooms/${roomId}`);
          if (response.ok) {
            const data = await response.json();
            setRoomGameId(data.gameId);
          } else {
            setRoomError('Không tìm thấy phòng này hoặc phòng đã đóng.');
          }
        } catch (err) {
          setRoomError('Không thể kết nối đến máy chủ.');
        } finally {
          setRoomLoading(false);
        }
      };
      fetchRoomInfo();
    }
  }, [roomId, gameId, stateGame]);

  const finalGameId = gameId || stateGame?.id || roomGameId;
  const isSinglePlayer = ['minesweeper', 'snake'].includes(finalGameId);
  const game = stateGame || games.find(g => g.id === finalGameId);
  const Component = gameComponents[finalGameId];
  
  // Ref to hold the latest guestName without triggering effect re-runs
  const guestNameRef = useRef(guestName);
  useEffect(() => {
    guestNameRef.current = guestName;
  }, [guestName]);

  // Handle single-player games (offline games)
  // This is now handled by initial state, but kept as a safety fallback
  useEffect(() => {
    if (isSinglePlayer) {
      setIsWaitingModalOpen(false);
      setIsPlaying(true);
    }
  }, [isSinglePlayer]);

  // REAL Socket Integration - STABLE connection, no disconnect on name change
  useEffect(() => {
    if (roomId && finalGameId) {
      const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const s = io(SOCKET_URL, {
        transports: ["websocket"],
        withCredentials: true
      });

      s.on('connect', () => {
        const nameToJoin = guestNameRef.current || 'Khách';
        console.log(`[Client] Socket Connected: ${s.id}`);
        console.log(`[Client] Emitting join_room: roomId=${roomId}, name=${nameToJoin}`);
        s.emit('join_room', { roomId, gameId: finalGameId, playerName: nameToJoin });
      });

      s.on('room_data_updated', (data) => {
        const fullPlayers = [...data.players];
        while (fullPlayers.length < 2) {
          fullPlayers.push({ id: 'waiting', name: 'Đang chờ...', avatar: '?', ready: false, score: 0 });
        }
        setPlayers(fullPlayers);
        if (data.settings) {
          setGameSettings(data.settings);
        }
        if (data.gameId) {
          setRoomGameId(data.gameId);
        }
      });

      s.on('settings_updated', (newSettings) => {
        console.log('[Socket] Nhận cập nhật settings:', newSettings);
        setGameSettings(newSettings);
      });

      s.on('receive_message', (msg) => {
        setMessages(prev => [...prev, msg]);
      });

      s.on('player_left', (data) => {
        console.log(`[Socket] Người chơi ${data.playerName} đã rời đi.`);
        // Sau 3 giây, quay lại màn hình chờ (WaitingModal)
        setTimeout(() => {
          setIsWaitingModalOpen(true);
          // Reset lại trạng thái sẵn sàng của bản thân khi đối thủ out
          setPlayers(prev => prev.map(p => 
            (p.id === s.id || p.id === 'me') ? { ...p, ready: false } : p
          ));
        }, 3000);
      });

      s.on('start_countdown', ({ seconds }) => {
        console.log(`[Socket] Đang đếm ngược: ${seconds}s`);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        
        setRoomCountdown(seconds);
        let current = seconds;
        countdownIntervalRef.current = setInterval(() => {
          current -= 1;
          if (current <= 0) {
            clearInterval(countdownIntervalRef.current);
            setRoomCountdown(null);
          } else {
            setRoomCountdown(current);
          }
        }, 1000);
      });

      s.on('game_started', () => {
        console.log('[Socket] Game started!');
        setIsPlaying(true);
        setIsWaitingModalOpen(false);
      });

      s.on('stop_countdown', () => {
        console.log('[Socket] Countdown stopped');
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        setRoomCountdown(null);
      });

      socketRef.current = s;
      setSocket(s);

      return () => {
        console.log('[Socket] Ngắt kết nối');
        s.disconnect();
        socketRef.current = null;
      };
    }
  }, [roomId, finalGameId]); // Removed game dependency to allow immediate room join

  // Update name on server when guestName changes (without recreating socket)
  useEffect(() => {
    const s = socketRef.current;
    if (s && s.connected && guestName && roomId) {
      s.emit('update_player_name', { roomId, playerName: guestName });
    }
  }, [guestName, roomId]);

  const toggleReady = () => {
    const s = socketRef.current || socket;
    if (s && roomId) {
      // Optimistic update for better UX
      setPlayers(prev => prev.map(p => 
        (p.id === s.id || p.id === 'me') ? { ...p, ready: !p.ready } : p
      ));
      s.emit('toggle_ready', { roomId });
    }
  };

  const isAllReady = players.length === 2 && players.every(p => p.ready && p.id !== 'waiting');
  
  // NOTE: Auto-start is now handled by server-side countdown trigger in toggle_ready
  // We just listen for start_countdown and game_started events.

  // --- EARLY RETURNS AND RENDERING ---
  if (loading || roomLoading) return <div className="loading" style={{ padding: '100px', textAlign: 'center' }}>Đang tải phòng chơi...</div>;
  if (roomError || !game) return <NotFound />;

  const handleSend = () => {
    if (newMessage.trim()) {
      // Optimistic update done via receive_message listener (or we can add it here if own message not echoed back, but typically server echoes)
      // Actually server index.js does `io.in(roomId).emit` which echoes to sender too.
      // So we just emit.
      if (socket) {
        socket.emit('send_message', { roomId, message: newMessage, user: guestName || 'Bạn' });
      }
      setNewMessage('');
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    window.alert('Đã copy ID phòng: ' + roomId);
  };

  const shareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    window.alert('Đã copy liên kết mời: ' + url);
  };

  const handleStartGame = () => {
    if (isAllReady) {
      setIsWaitingModalOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('guestName');
    setGuestName('');
    setShowNameInput(true);
    setIsSettingsOpen(false);
    // Notify sidebar to update
    window.dispatchEvent(new Event('guestNameChanged'));
  };

  const me = players.find(p => p.id === socket?.id);
  const isOwner = me?.isOwner || false;

  const handleSettingsChange = (newSettings) => {
    setGameSettings(newSettings);
    if (socket && isOwner) {
      socket.emit('update_room_settings', { roomId, settings: newSettings });
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#10b981',
          borderRadius: 16,
        },
      }}
    >
      <div className="game-stage">
        <header className="stage-header">
          <button className="back-btn" onClick={() => navigate(`/`)}>
            ← Thoát
          </button>
          
          <div className="stage-info">
            <h2>{game.title}</h2>
            {roomId && <div className="room-badge">Phòng: <span>#{roomId}</span></div>}
          </div>

          <div className="stage-actions">
            <button onClick={() => setIsSettingsOpen(true)} className="icon-btn">
              <SettingFilled />
            </button>
          </div>
        </header>
        
        <div className="stage-main-layout" style={isSinglePlayer ? { gridTemplateColumns: '1fr', maxWidth: finalGameId === 'minesweeper' ? '1200px' : '800px', margin: '0 auto' } : {}}>
          <div className="stage-left-content">
            <div className="game-container glass" style={isSinglePlayer ? { minHeight: '500px' } : {}}>
              <Suspense fallback={<div className="loading">Đang tải trò chơi...</div>}>
                {Component ? <Component roomId={roomId} id={gameId} socket={socket} settings={gameSettings} /> : (
                  <div className="error">Trò chơi này đang được cập nhật!</div>
                )}
              </Suspense>
            </div>

            {!isSinglePlayer && (
              <div className="room-footer-info glass">
                <div className="player-stat-card">
                  <div className="player-avatar">{players[0].avatar}</div>
                  <div className="player-meta">
                    <span className="player-name">{players[0].name}</span>
                    <span className="player-score">{players[0].score || 0} điểm</span>
                  </div>
                </div>

                <div className="vs-divider">VS</div>

                <div className="player-stat-card reversed">
                  <div className="player-meta">
                    <span className="player-name">{players[1].name}</span>
                    <span className="player-score">{players[1].score || 0} điểm</span>
                  </div>
                  <div className="player-avatar secondary">{players[1].avatar}</div>
                </div>
              </div>
            )}
          </div>

          {!isSinglePlayer && (
            <aside className="chat-sidebar glass">
              <div className="chat-header">
                <MessageFilled /> <span>Trò chuyện</span>
              </div>
              <div className="chat-messages">
                {messages.map(msg => (
                  <div key={msg.id} className={`message-item ${msg.isSystem ? 'system' : msg.senderId === socket?.id ? 'me' : ''}`}>
                    {!msg.isSystem && msg.senderId !== socket?.id && <span className="message-user">{msg.user}:</span>}
                    <span className="message-content">{msg.text}</span>
                  </div>
                ))}
              </div>
              <div className="chat-input-area">
                <input 
                  type="text" 
                  placeholder="Nhập tin nhắn..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="send-btn" onClick={handleSend}><SendOutlined /></button>
              </div>
            </aside>
          )}
        </div>

        <WaitingModal 
          open={isWaitingModalOpen}
          roomId={roomId}
          players={players}
          onToggleReady={toggleReady}
          isAllReady={isAllReady}
          onStart={handleStartGame}
          currentSocketId={socket?.id}
          gameTitle={game?.title}
          onOpenSettings={() => setIsSettingsOpen(true)}
          countdown={roomCountdown}
        />

        <SettingsModal
          open={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          game={game}
          onLogout={handleLogout}
          settings={{ ...gameSettings, gameId: finalGameId }}
          onSettingsChange={handleSettingsChange}
          isOwner={isOwner}
        />

        <LoginModal
          open={showNameInput}
          tempName={tempName}
          setTempName={setTempName}
          onSubmit={handleNameSubmit}
        />
      </div>
    </ConfigProvider>
  );
};

export default GameStage;
