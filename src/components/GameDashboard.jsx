import { useGames } from '../GameContext';
import { useNavigate } from "react-router-dom";
import { getGameThumbnail } from '../utils/gameUtils';

const GameDashboard = () => {
  const navigate = useNavigate();
  const { games, loading } = useGames();

  if (loading && (!games || games.length === 0)) {
    // Fallback to static data while loading if no games are present
  }

  const STATIC_GAMES = [
    {
      id: 'tictactoe',
      title: 'Tic Tac Toe',
      thumbnail: 'https://papergames.io/vi/assets/games/gomoku/thumbnail.png'
    },
    {
      id: 'memory',
      title: 'Trò chơi trí nhớ',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80'
    },
    {
      id: 'minesweeper',
      title: 'Trò chơi dò mìn',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80'
    }
  ];

  const displayGames = (games && games.length > 0) ? games : STATIC_GAMES;

  return (
    <div className="dashboard">
      <div className="game-grid">
        {displayGames.map((game) => (
          <div 
            key={game.id} 
            className="game-card" 
            onClick={() => navigate(`${game.id}`)}
          >
            <div className="card-image">
              <img src={getGameThumbnail(game)} alt={game.title} loading="lazy" />
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
