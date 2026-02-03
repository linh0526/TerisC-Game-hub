import { useGames } from '../GameContext';
import { useNavigate } from "react-router-dom";

const GameDashboard = () => {
  const navigate = useNavigate();
  const { games, loading } = useGames();

  if (loading) return <div className="loading" style={{ padding: '40px', textAlign: 'center' }}>Đang tải danh sách trò chơi...</div>;

  return (
    <div className="dashboard">
      <div className="game-grid">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="game-card" 
            onClick={() => navigate(`${game.id}`)}
          >
            <div className="card-image">
              <img src={game.thumbnail} alt={game.title} loading="lazy" />
            </div>
            <div className="card-content">
              <h3>{game.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameDashboard;
