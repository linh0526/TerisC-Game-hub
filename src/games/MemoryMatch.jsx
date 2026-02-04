import React, { useEffect } from 'react';
import { Typography, Empty } from 'antd';

const { Title } = Typography;

const MemoryMatch = ({ roomId, socket }) => {
  useEffect(() => {
    if (socket && roomId) {
      console.log('[MemoryMatch] Đã sẵn sàng với socket chung cho phòng:', roomId);
    }
  }, [socket, roomId]);

  return (
    <div className="game-placeholder" style={{ textAlign: 'center', padding: '40px' }}>
      <Title level={3}>Lật hình</Title>
      <p style={{ color: 'var(--text-muted)' }}>Phòng: #{roomId}</p>
      <div style={{ marginTop: '40px' }}>
        <Empty description="đang phát triển.............................." />
      </div>
    </div>
  );
};

export default MemoryMatch;
