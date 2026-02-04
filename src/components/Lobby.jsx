import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Typography, Empty, Button, Tag, Space } from 'antd';
import { GlobalOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useGames } from '../GameContext';
import { getGameThumbnail } from '../utils/gameUtils';

const { Title, Text } = Typography;
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Lobby = () => {
  const [rooms, setRooms] = useState([]);
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();
  const { games, loading } = useGames();

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('[Lobby] Kết nối thành công tới socket server:', socket.id);
      setConnected(true);
    });

    socket.on('update_rooms', (updatedRooms) => {
      console.log('[Lobby] Nhận danh sách phòng mới:', updatedRooms);
      setRooms(updatedRooms);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    return () => socket.close();
  }, []);

  const getGameTitle = (gameId) => {
    const game = games.find(g => g.id === gameId);
    return game ? game.title : gameId;
  };

  const getGameThumb = (gameId) => {
    const game = games.find(g => g.id === gameId);
    return getGameThumbnail(game);
  };

  return (
    <div className="lobby-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Title level={1} style={{ margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Phòng chờ</Title>
        </div>
        <Tag color={connected ? 'success' : 'error'} style={{ borderRadius: '10px', padding: '4px 12px' }}>
          {connected ? '● Trực tuyến' : '● Ngoại tuyến'}
        </Tag>
      </div>

      {rooms.length === 0 ? (
        <div className="glass" style={{ padding: '80px', borderRadius: '32px', textAlign: 'center' }}>
          <Empty 
            description={
              <Text style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                Hiện chưa có phòng nào đang hoạt động. Hãy tạo phòng mới để bắt đầu ngay!
              </Text>
            } 
          />
          <Button 
            type="primary" 
            size="large" 
            onClick={() => navigate('/')}
            style={{ marginTop: '30px', borderRadius: '12px', height: '48px', padding: '0 32px' }}
          >
            Quay lại trang chủ
          </Button>
        </div>
      ) : (
        <div className="room-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {rooms.map((room) => (
            <div key={room.id} className="room-card glass" style={{
              padding: '24px',
              borderRadius: '24px',
              transition: 'var(--transition)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {getGameThumb(room.gameId) && (
                  <img 
                    src={getGameThumb(room.gameId)} 
                    alt="game" 
                    style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <Title level={4} style={{ margin: 0, color: 'var(--text-main)' }}>{getGameTitle(room.gameId)}</Title>
                  <Space size="small" style={{ marginTop: '4px' }}>
                    <Tag color="cyan">#{room.id}</Tag>
                    {room.isPlaying ? <Tag color="orange">Đang chơi</Tag> : <Tag color="green">Đang chờ</Tag>}
                  </Space>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '14px' }}>
                <Space>
                  <UserOutlined style={{ color: 'var(--text-muted)' }} />
                  <Text style={{ color: 'var(--text-main)', fontWeight: 600 }}>{room.playerCount} người chơi</Text>
                </Space>
                <Button 
                  type="primary" 
                  shape="round" 
                  icon={<ArrowRightOutlined />}
                  onClick={() => {
                    const game = games.find(g => g.id === room.gameId);
                    navigate(`/${room.id}`, { state: { game } });
                  }}
                  disabled={room.isPlaying && room.playerCount >= 2} // Disable if full AND playing
                >
                  {room.isPlaying ? 'Đang chơi' : 'Tham gia'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lobby;
