import React, { Suspense, lazy, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Checkbox, Typography, ConfigProvider, theme } from 'antd';
import { 
  SettingFilled,
  CloseOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useGames } from '../GameContext';
import { useTheme } from '../ThemeContext';

const { Title, Text } = Typography;

// Lazy load game components
const TicTacToe = lazy(() => import('../games/TicTacToe'));
const Snake = lazy(() => import('../games/Snake'));
const MemoryMatch = lazy(() => import('../games/MemoryMatch'));

const gameComponents = {
  tictactoe: TicTacToe,
  snake: Snake,
  memory: MemoryMatch,
};

const GameStage = () => {
  const { id, roomId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { games, loading } = useGames();
  const game = games.find(g => g.id === id);
  const Component = gameComponents[id];

  if (loading) return <div className="loading" style={{ padding: '100px', textAlign: 'center' }}>Đang tải phòng chơi...</div>;

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!game) {
    return (
      <div className="error-stage glass" style={{ padding: '100px 40px', textAlign: 'center', color: 'var(--text-main)' }}>
        <h2>Không tìm thấy trò chơi!</h2>
        <button className="back-btn" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

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
        <header className="stage-header" style={{ marginBottom: '40px' }}>
          <button className="back-btn" onClick={() => navigate(`/${id}`)}>
            ← Thoát
          </button>
          
          <div className="stage-info" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{game.title}</h2>
            {roomId && (
              <div className="room-badge" style={{ 
                marginTop: '8px',
                padding: '6px 16px',
                background: 'var(--border-glass)',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'inline-block'
              }}>
                Phòng: <span style={{ color: 'var(--primary)' }}>#{roomId}</span>
              </div>
            )}
          </div>

          <div className="stage-actions" style={{ width: '100px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={showModal}
              style={{
                background: 'var(--border-glass)',
                border: 'none',
                color: 'var(--text-main)',
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
            >
              <SettingFilled />
            </button>
          </div>
        </header>
        
        <div className="game-container glass">
          <Suspense fallback={<div className="loading">Đang tải trò chơi...</div>}>
            {Component ? <Component roomId={roomId} id={id} /> : (
              <div className="error">Trò chơi này đang được cập nhật!</div>
            )}
          </Suspense>
        </div>

        {/* Integrated Settings Modal */}
        <Modal
          title={null}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          closeIcon={<CloseOutlined style={{ color: 'var(--text-main)', fontSize: '18px' }} />}
          width={480}
          centered
          className="custom-game-modal"
          styles={{
            content: {
              padding: 0,
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              border: '1px solid var(--border-glass)',
              overflow: 'hidden'
            }
          }}
        >
          <div className="modal-custom-header">
            <Title level={4} style={{ margin: 0, color: 'var(--text-main)' }}>Cài đặt phòng chơi</Title>
          </div>

          <div className="modal-custom-body">
            <div className="settings-group">
              <Text className="group-title">Trò chơi đang diễn ra</Text>
              <div className="game-selector-box">
                <div className="selector-left">
                  <img src={game.thumbnail} alt="thumb" className="mini-thumb" />
                  <div className="selector-info">
                    <span className="selector-name">{game.title}</span>
                    <span className="selector-rule">{game.rule}</span>
                  </div>
                </div>
                <DownOutlined className="selector-arrow" />
              </div>
            </div>

            <div className="params-box">
              <div className="param-row">
                <span className="param-label">Thời gian mỗi lượt:</span>
                <span className="param-value">Không giới hạn</span>
              </div>
              <div className="param-row">
                <span className="param-label">Số phút cho mỗi người chơi:</span>
                <span className="param-value">Không giới hạn</span>
              </div>
              <div className="param-row">
                <span className="param-label">Ai chơi trước?</span>
                <span className="param-value">Ngẫu nhiên</span>
              </div>
              <button className="text-action-btn">Tùy chọn tùy chỉnh</button>
            </div>

            <div className="ad-checkbox-row">
              <Checkbox className="custom-checkbox">
                <span className="checkbox-text">Loại bỏ quảng cáo (Chỉ phòng này)</span>
              </Checkbox>
              <span className="new-tag">new!</span>
            </div>
          </div>

          <div className="modal-custom-footer">
            <button className="confirm-settings-btn" onClick={handleCancel}>
              Đóng
            </button>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default GameStage;
