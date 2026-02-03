import { Routes, Route, useLocation, matchPath } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import GameDashboard from './components/GameDashboard';
import GameDetail from './components/GameDetail';
import GameStage from './components/GameStage';
import Lobby from './components/Lobby';

function App() {
  const location = useLocation();
  
  // Kiểm tra xem có đang ở trang phòng chơi không
  const isRoomPage = matchPath('/:id/:roomId', location.pathname) || 
                     matchPath('/play/:id', location.pathname);

  return (
    <div className={`app-container ${isRoomPage ? 'is-room' : ''}`}>
      {!isRoomPage && <Sidebar />}
      <main style={isRoomPage ? { marginLeft: 0, padding: 0 } : {}}>
        <Routes>
          <Route path="/" element={<GameDashboard />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/:id" element={<GameDetail />} />
          <Route path="/:id/:roomId" element={<GameStage />} />
          <Route path="/play/:id" element={<GameStage />} />
        </Routes>
      </main>
      
      {/* Bottom Navigation for Mobile */}
      {!isRoomPage && (
        <div className="bottom-nav">
          <a href="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <span className="icon">🏠</span>
            <span className="label">Trang chủ</span>
          </a>
          <a href="/lobby" className={`nav-item ${location.pathname === '/lobby' ? 'active' : ''}`}>
            <span className="icon">🎮</span>
            <span className="label">Phòng chờ</span>
          </a>
          <a href="/#" className="nav-item">
            <span className="icon">🏆</span>
            <span className="label">Xếp hạng</span>
          </a>
          <a href="/#" className="nav-item">
            <span className="icon">👤</span>
            <span className="label">Cá nhân</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
