import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Typography, Empty } from 'antd';

const SOCKET_URL = 'http://localhost:3000';
const { Title } = Typography;

const Snake = ({ roomId }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (roomId) {
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);
      newSocket.emit('join_room', { roomId, gameId: 'snake' });
      return () => newSocket.close();
    }
  }, [roomId]);

  return (
    <div className="game-placeholder" style={{ textAlign: 'center', padding: '40px' }}>
      <Title level={3}>🎮 Rắn săn mồi</Title>
      <p style={{ color: 'var(--text-muted)' }}>Phòng: #{roomId}</p>
      <div style={{ marginTop: '40px' }}>
        <Empty description="Trò chơi Snake đang được phát triển tích hợp logic Socket..." />
      </div>
    </div>
  );
};

export default Snake;
