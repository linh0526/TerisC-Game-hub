import { Routes, Route, useLocation, matchPath, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import GameDashboard from './components/GameDashboard';
import GameDetail from './components/GameDetail';
import GameStage from './components/GameStage';
import Lobby from './components/Lobby';
import NotFound from './components/NotFound';
import { useGames } from './GameContext';

const DynamicRouteHandler = () => {
  const params = useParams();
  const location = useLocation();
  const slug = params.slug;

  const isRoom = /^\d+$/.test(slug) || location.state?.game;

  if (isRoom) {
    return <GameStage />;
  }
  
  return <GameDetail />; 
}

const App = () => {
  const location = useLocation();
  const { games } = useGames();
  
  // Logic hiển thị Sidebar: Chỉ hiện ở Trang chủ, Lobby và chi tiết Game (nếu slug thuộc danh sách game)
  const slug = location.pathname.slice(1);
  const isHome = location.pathname === '/';
  const isLobby = location.pathname === '/lobby';
  const isGameDetail = games.some(g => g.id === slug);
  
  // hideSidebar = true nếu KHÔNG PHẢI (Home OR Lobby OR GameDetail hợp lệ)
  const hideSidebar = !isHome && !isLobby && !isGameDetail;

  return (
    <div className={`app-container ${hideSidebar ? 'is-room' : ''}`}>
      {!hideSidebar && <Sidebar />}
      <main style={hideSidebar ? { marginLeft: 0, padding: 0 } : {}}>
        <Routes>
          <Route path="/" element={<GameDashboard />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/:slug" element={<DynamicRouteHandler />} />
          <Route path="/play/:id" element={<GameStage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Bottom Navigation for Mobile */}
      {!hideSidebar && (
        <div className="bottom-nav">
          <a href="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <span className="label">Trang chủ</span>
          </a>
          <a href="/lobby" className={`nav-item ${location.pathname === '/lobby' ? 'active' : ''}`}>
            <span className="label">Phòng chờ</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
