import React from 'react';
import { Modal, Typography, Button } from 'antd';
import { 
  UserOutlined, 
  CopyOutlined, 
  ShareAltOutlined, 
  CheckCircleFilled,
  SettingFilled
} from '@ant-design/icons';

const { Title, Text } = Typography;

const WaitingModal = ({ 
  open, 
  roomId, 
  players, 
  onToggleReady, 
  isAllReady, 
  currentSocketId,
  gameTitle,
  onOpenSettings,
  countdown
}) => {
  
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    window.alert('Đã copy ID phòng: ' + roomId);
  };

  const shareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    window.alert('Đã copy liên kết mời: ' + url);
  };

  const currentPlayer = players.find(p => p.id === currentSocketId || p.id === 'me');
  const isMyReady = currentPlayer?.ready;

  return (
    <Modal
      title={null}
      open={open}
      footer={null}
      closable={false}
      centered
      width={500}
      className="waiting-modal"
      styles={{ content: { padding: 0, borderRadius: '28px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}}
    >
      <div className="modal-custom-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
        <Title level={3} style={{ margin: 0, color: 'var(--text-main)' }}>{gameTitle || 'Phòng chờ'}</Title>
        <Button icon={<SettingFilled />} onClick={onOpenSettings} type="text" style={{ color: 'var(--text-main)' }} />
      </div>
      <div className="modal-custom-body" style={{ textAlign: 'center' }}>
        <div className="waiting-spinner">
          <div className="pulse-circle"></div>
          <UserOutlined className="waiting-icon" />
        </div>
        
        <div className="room-id-box glass" onClick={copyRoomId}>
          <span className="label">ID Phòng:</span>
          <span className="value">#{roomId}</span>
          <CopyOutlined className="copy-icon" />
        </div>

        <div className="share-actions">
          <button className="share-btn" onClick={shareLink}><ShareAltOutlined /> Chia sẻ phòng</button>
        </div>

        <div className="ready-system">
          {players.map((p, idx) => (
            <div key={p.id + idx} className="player-ready-item">
              <span className="name">{p.name}</span>
              <button 
                className={`ready-btn ${p.ready ? 'ready' : ''}`}
                disabled={true} // Chỉ hiển thị
              >
                {p.ready ? <> Sẵn sàng</> : 'Đang chờ...'}
              </button>
            </div>
          ))}
        </div>

        <button 
          className={`start-game-btn ${isMyReady ? 'cancel-mode' : ''}`}
          onClick={onToggleReady}
          style={isMyReady ? { background: '#ff4d4f', borderColor: '#ff4d4f' } : {}}
          disabled={countdown !== null}
        >
          {isMyReady ? 'Hủy sẵn sàng' : 'Sẵn sàng'}
        </button>

        {countdown !== null && (
          <div className="countdown-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '28px',
            color: '#fff'
          }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', marginBottom: '10px' }}>Trận đấu bắt đầu sau</Text>
            <div style={{ 
              fontSize: '8rem', 
              fontWeight: 900, 
              color: 'var(--primary)',
              textShadow: '0 0 40px rgba(0, 242, 254, 0.5)',
              transform: 'scale(1)',
              animation: 'pulseScale 1s infinite'
            }}>
              {countdown}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default WaitingModal;
