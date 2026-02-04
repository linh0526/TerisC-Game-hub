import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Typography, Space, Card, Badge } from 'antd';
import { 
  TrophyFilled, 
  CloseCircleFilled, 
  BugFilled, 
  FlagFilled, 
  ReloadOutlined,
  ClockCircleOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ExpandOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
import mineIcon from '../assets/icon/mine_icon.png';

const Minesweeper = ({ settings }) => {
  const navigate = useNavigate();
  
  // Lấy cấu hình từ settings hoặc mặc định
  const width = settings?.width || 9;
  const height = settings?.height || 9;
  const mines = settings?.mines || 10;

  const [board, setBoard] = useState([]); // Array of { isMine, revealed, neighbors, flagged }
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flagsCount, setFlagsCount] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [zoom, setZoom] = useState(1);
  const timerRef = useRef(null);

  // Khởi tạo bảng
  const initBoard = useCallback(() => {
    const totalCells = width * height;
    const newBoard = Array(totalCells).fill(null).map(() => ({
      isMine: false,
      revealed: false,
      neighbors: 0,
      flagged: false
    }));

    // Đặt mìn
    let plantedMines = 0;
    const actualMines = Math.min(mines, totalCells - 1); // Đảm bảo không quá nhiều mìn
    while (plantedMines < actualMines) {
      const idx = Math.floor(Math.random() * totalCells);
      if (!newBoard[idx].isMine) {
        newBoard[idx].isMine = true;
        plantedMines++;
      }
    }

    // Tính hàng xóm
    for (let i = 0; i < totalCells; i++) {
      if (!newBoard[i].isMine) {
        let count = 0;
        const r = Math.floor(i / width);
        const c = i % width;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < height && nc >= 0 && nc < width) {
              if (newBoard[nr * width + nc].isMine) count++;
            }
          }
        }
        newBoard[i].neighbors = count;
      }
    }
    setBoard(newBoard);
    setGameOver(false);
    setWin(false);
    setFlagsCount(0);
    setTime(0);
    setGameStarted(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [width, height, mines]);

  // Reset khi settings thay đổi
  useEffect(() => {
    initBoard();
  }, [initBoard]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Bắt đầu timer khi click lần đầu
  const startTimer = () => {
    if (!gameStarted) {
      setGameStarted(true);
      timerRef.current = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
  };

  const handleReveal = (idx) => {
    if (gameOver || win || board[idx].flagged || board[idx].revealed) return;
    
    startTimer();
    const newBoard = [...board];
    
    if (newBoard[idx].isMine) {
      handleGameOver(newBoard);
      return;
    }

    revealCell(newBoard, idx);
    setBoard(newBoard);
    checkWin(newBoard);
  };

  const revealCell = (b, idx) => {
    if (b[idx].revealed || b[idx].flagged) return;
    b[idx].revealed = true;
    if (b[idx].neighbors === 0 && !b[idx].isMine) {
      const r = Math.floor(idx / width);
      const c = idx % width;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < height && nc >= 0 && nc < width) {
            revealCell(b, nr * width + nc);
          }
        }
      }
    }
  };

  const handleFlag = (e, idx) => {
    e.preventDefault();
    if (gameOver || win || board[idx].revealed) return;
    
    startTimer();
    const newBoard = [...board];
    newBoard[idx].flagged = !newBoard[idx].flagged;
    setBoard(newBoard);
    setFlagsCount(newBoard.filter(c => c.flagged).length);
  };

  const handleGameOver = (b) => {
    b.forEach(c => { if (c.isMine) c.revealed = true; });
    setBoard(b);
    setGameOver(true);
    clearInterval(timerRef.current);
  };

  const checkWin = (b) => {
    const revealedCount = b.filter(c => c.revealed).length;
    if (revealedCount === (width * height) - mines) {
      setWin(true);
      clearInterval(timerRef.current);
    }
  };

  // Tính toán kích thước ô cờ để vừa màn hình
  const baseCellSize = width > 20 ? 25 : width > 12 ? 30 : 40;

  return (
    <div className="minesweeper-offline">
      <Card className="glass" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <Space size="large">
            <Badge count={mines - flagsCount} showZero color="#ef4444">
              <div className="stat-box glass">
                <img src={mineIcon} alt="mine" style={{ width: '20px', height: '20px', marginRight: '8px', objectFit: 'contain' }} />
                Mìn
              </div>
            </Badge>
            <div className="stat-box glass" style={{ minWidth: '80px' }}>
              <ClockCircleOutlined style={{ marginRight: '8px', color: '#10b981' }} />
              {time}s
            </div>
          </Space>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Space.Compact>
              <Button icon={<ZoomOutOutlined />} onClick={() => setZoom(prev => Math.max(0.3, prev - 0.1))} />
              <Button icon={<ExpandOutlined />} onClick={() => setZoom(1)}>Reset</Button>
              <Button icon={<ZoomInOutlined />} onClick={() => setZoom(prev => Math.min(2, prev + 0.1))} />
            </Space.Compact>
            <Button 
              type="primary" 
              danger 
              icon={<ReloadOutlined />} 
              onClick={initBoard}
              size="middle"
              style={{ borderRadius: '12px' }}
            >
              Chơi lại
            </Button>
          </div>
        </div>
      </Card>

      <div className="minesweeper-scroll-container" style={{ 
        maxWidth: '100%', 
        maxHeight: '70vh',
        overflow: 'auto', 
        padding: '20px', 
        background: 'rgba(0,0,0,0.2)', 
        borderRadius: '20px',
        border: '1px solid var(--border-glass)',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div className="minesweeper-zoom-wrapper" style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease',
          paddingBottom: zoom > 1 ? `${(zoom - 1) * 100}%` : '0',
          paddingRight: zoom > 1 ? `${(zoom - 1) * 50}%` : '0',
          width: 'fit-content',
          display: 'inline-block'
        }}>
          <div className="minesweeper-board" style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${width}, ${baseCellSize}px)`,
            gridTemplateRows: `repeat(${height}, ${baseCellSize}px)`,
            gap: '2px',
            width: 'fit-content'
          }}>
          {board.map((cell, i) => (
            <div 
              key={i}
              className={`mine-cell ${cell.revealed ? 'revealed' : ''} ${cell.isMine && cell.revealed ? 'mine' : ''} ${cell.flagged ? 'flagged' : ''}`}
              onClick={() => handleReveal(i)}
              onContextMenu={(e) => handleFlag(e, i)}
              style={{
                width: `${baseCellSize}px`,
                height: `${baseCellSize}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: cell.revealed ? (cell.isMine ? '#ef4444' : 'rgba(255,255,255,0.08)') : 'var(--bg-card)',
                border: '1px solid var(--border-glass)',
                borderRadius: '4px',
                cursor: (cell.revealed || gameOver || win) ? 'default' : 'pointer',
                fontWeight: 800,
                fontSize: width > 20 ? '0.8rem' : '1rem',
                color: cell.revealed && !cell.isMine ? getNumberColor(cell.neighbors) : (cell.flagged ? '#ef4444' : '#fff'),
                transition: 'all 0.1s ease'
              }}
            >
              {cell.revealed ? (
              cell.isMine ? <img src={mineIcon} alt="mine" style={{ width: '80%', height: '80%', objectFit: 'contain' }} /> : (cell.neighbors > 0 ? cell.neighbors : '')
            ) : (
              cell.flagged ? <FlagFilled /> : ''
            )}
            </div>
          ))}
        </div>
      </div>
    </div>

      <Modal
        title={null}
        open={gameOver || win}
        footer={null}
        closable={false}
        centered
        className="result-modal"
        styles={{ content: { padding: '40px', borderRadius: '32px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}}
      >
        <div style={{ textAlign: 'center' }}>
          {win ? (
            <>
              <TrophyFilled style={{ fontSize: '5rem', color: '#ffcc00', marginBottom: '20px' }} />
              <Title level={1}>XUẤT SẮC!</Title>
              <Text style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Bạn đã tìm thấy {mines} quả mìn trong {time} giây.</Text>
            </>
          ) : (
            <>
              <CloseCircleFilled style={{ fontSize: '5rem', color: '#ef4444', marginBottom: '20px' }} />
              <Title level={2}>BÙM! GAME OVER</Title>
              <Text type="danger" style={{ fontSize: '1.1rem' }}>Bạn đã dẫm phải mìn rồi 💣</Text>
            </>
          )}
          
          <div style={{ marginTop: '30px' }}>
            <Button type="primary" size="large" onClick={initBoard} style={{ borderRadius: '12px', height: '50px', padding: '0 40px' }}>
              Thử lại
            </Button>
          </div>
          <div style={{ marginTop: '20px' }}>
            <Button type="link" onClick={() => navigate('/')}>Quay lại trang chủ</Button>
          </div>
        </div>
      </Modal>

      <style>{`
        .stat-box {
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          font-size: 1rem;
        }
        .stat-box.glass {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-glass);
          color: var(--text-main);
        }
        .minesweeper-board::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .minesweeper-board::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .minesweeper-board::-webkit-scrollbar-thumb {
          background: var(--border-glass);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

const getNumberColor = (num) => {
  const colors = [
    'transparent',
    '#3b82f6', // 1: Blue
    '#10b981', // 2: Green
    '#ef4444', // 3: Red
    '#8b5cf6', // 4: Purple
    '#f59e0b', // 5: Orange
    '#06b6d4', // 6: Cyan
    '#ec4899', // 7: Pink
    '#ef4444', // 8: Hot Red
  ];
  return colors[num] || '#fff';
};

export default Minesweeper;
