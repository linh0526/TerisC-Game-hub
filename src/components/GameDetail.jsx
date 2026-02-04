import { useParams, useNavigate } from 'react-router-dom';
import { Typography, ConfigProvider, theme } from 'antd';
import { 
  GlobalOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import { useGames } from '../GameContext';
import { useTheme } from '../ThemeContext';
import { getGameThumbnail } from '../utils/gameUtils';
import NotFound from './NotFound';

const { Title } = Typography;

const SINGLE_PLAYER_GAMES = ['minesweeper', 'snake'];

const GameDetail = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { games, loading } = useGames();
  const gameId = id || slug;
  const game = games.find(g => g.id === gameId);

  if (loading) return <div className="loading" style={{ padding: '100px', textAlign: 'center' }}>Đang tải thông tin trò chơi...</div>;

  if (!game) {
    return <NotFound />;
  }

  const handleCreateRoom = () => {
    const roomId = Math.floor(1000 + Math.random() * 9000);
    navigate(`/${roomId}`, { state: { game } });
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
      <div className="game-detail-container">
        <div className="game-detail-layout">
          <div className="game-detail-left">
            <div className="game-preview-card">
              <img src={getGameThumbnail(game)} alt={game.title} />
            </div>
          </div>

          <div className="game-detail-right">
            <div className="game-info-header">
              <h1 className="game-title">{game.title}</h1>
              <p className="game-description">{game.description || 'Trải nghiệm đỉnh cao cùng GameHub.'}</p>
            </div>

            <div className="play-options-list">
              {SINGLE_PLAYER_GAMES.includes(game.id) ? (
                <div className="play-option-item solo-special-btn" onClick={handleCreateRoom}>
                  <div className="option-main">
                    <UserOutlined className="option-icon" />
                    <div className="online-text-group">
                      <span className="option-label-bold">Chơi đơn</span>
                      <span className="option-sublabel">Trải nghiệm ngoại tuyến</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="play-option-item online-special-btn" onClick={handleCreateRoom}>
                  <div className="option-main">
                    <GlobalOutlined className="option-icon" />
                    <div className="online-text-group">
                      <span className="option-label-bold">Chơi trực tuyến</span>
                      <span className="option-sublabel">với một người chơi ngẫu nhiên</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Game Guide Section */}
        {game.guide && game.guide.length > 0 && (
          <div className="game-guide-section" style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid var(--border-glass)' }}>
            <Title level={2} style={{ color: 'var(--text-main)', marginBottom: '40px', fontSize: '2rem', fontWeight: 700 }}>Hướng dẫn & Chiến thuật</Title>
            <div className="guide-content" style={{ display: 'grid', gap: '40px' }}>
              {game.guide.map((item, index) => (
                <div key={index} className="guide-item">
                  <Title level={3} style={{ color: 'var(--text-main)', marginBottom: '16px', fontSize: '1.4rem' }}>{item.title}</Title>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '20px' }}>{item.content}</p>
                  
                  {item.subsections && (
                    <div className="subsections" style={{ display: 'grid', gap: '24px', marginLeft: '20px', paddingLeft: '20px', borderLeft: '2px solid var(--border-glass)' }}>
                      {item.subsections.map((sub, sIndex) => (
                        <div key={sIndex} className="sub-item">
                          <Title level={4} style={{ color: 'var(--text-main)', marginBottom: '8px', fontSize: '1.1rem' }}>{sub.title}</Title>
                          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7' }}>{sub.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default GameDetail;