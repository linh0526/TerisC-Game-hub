import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Progress, Typography, Space } from 'antd';
import { TrophyFilled, CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons';

const { Title, Text } = Typography;
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TicTacToe = ({ roomId, id, socket, settings }) => {
  const navigate = useNavigate();
  const boardSize = 3;
  const winLength = 3;

  const [board, setBoard] = useState(Array(boardSize * boardSize).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  
  // Settings
  const timePerTurn = settings?.timePerTurn || 30;
  
  // Trạng thái chơi lại
  const [showResult, setShowResult] = useState(false);
  const [countdown, setCountdown] = useState(10); // Countdown cho kết quả
  const [turnTimer, setTurnTimer] = useState(timePerTurn); // Countdown cho mỗi lượt
  const [rematchStatus, setRematchStatus] = useState('idle'); // 'idle', 'requested', 'waiting'
  const [timeoutWinner, setTimeoutWinner] = useState(null); // ID of the player who won by timeout

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);
  const isGameOver = !!winner || isDraw || !!timeoutWinner;

  const isMyTurn = (xIsNext && playerSymbol === 'X') || (!xIsNext && playerSymbol === 'O');
  const userWon = winner === playerSymbol;

  // Turn Timer Effect
  useEffect(() => {
    if (isGameOver || !playerSymbol) return;

    setTurnTimer(timePerTurn); // Reset timer khi đổi lượt

    const timer = setInterval(() => {
      setTurnTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Nếu hết thời gian mà là lượt của mình -> Xử thua
          if (isMyTurn && !isGameOver && socket) {
            console.log("[TicTacToe] Hết thời gian! Đang báo xử thua...");
            socket.emit('report_winner', { roomId, winnerId: 'opponent' }); 
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [xIsNext, isGameOver, playerSymbol, timePerTurn]);

  useEffect(() => {
    if (isGameOver) {
      if (userWon && socket) {
        socket.emit('report_winner', { roomId });
      }
      setShowResult(true);
      setCountdown(10);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isGameOver, userWon, socket, roomId]);

  useEffect(() => {
    if (socket && roomId) {
      // Socket đã được GameStage join room, TicTacToe chỉ cần lắng nghe sự kiện
      
      socket.on('player_assignment', (symbol) => {
        console.log('[TicTacToe] Nhận biểu tượng:', symbol);
        setPlayerSymbol(symbol);
      });

      socket.on('receive_move', (data) => {
        setBoard(data.board);
        setXIsNext(data.xIsNext);
      });

      socket.on('start_rematch', () => {
        resetBoard();
      });

      socket.on('rematch_requested', () => {
        setRematchStatus('waiting_for_you');
      });

      socket.on('game_over_timeout', ({ winnerId }) => {
        console.log('[TicTacToe] Game over by timeout. Winner:', winnerId);
        setTimeoutWinner(winnerId);
        setShowResult(true);
      });

      // Cleanup listeners khi component unmount
      return () => {
        socket.off('player_assignment');
        socket.off('receive_move');
        socket.off('start_rematch');
        socket.off('rematch_requested');
      };
    }
  }, [socket, roomId]);

  function calculateWinner(squares) {
    const size = boardSize;
    const win = winLength;

    // Helper to check a line
    const checkLine = (line) => {
      if (line.length < win) return null;
      for (let i = 0; i <= line.length - win; i++) {
        const slice = line.slice(i, i + win);
        if (slice[0] && slice.every(v => v === slice[0])) return slice[0];
      }
      return null;
    };

    // Rows
    for (let r = 0; r < size; r++) {
      const row = squares.slice(r * size, (r + 1) * size);
      const res = checkLine(row);
      if (res) return res;
    }

    // Cols
    for (let c = 0; c < size; c++) {
      const col = [];
      for (let r = 0; r < size; r++) col.push(squares[r * size + c]);
      const res = checkLine(col);
      if (res) return res;
    }

    // Diagonals (top-left to bottom-right)
    for (let r = 0; r <= size - win; r++) {
      for (let c = 0; c <= size - win; c++) {
        const diag = [];
        for (let i = 0; i < win; i++) diag.push(squares[(r + i) * size + (c + i)]);
        const res = checkLine(diag);
        if (res) return res;
      }
    }

    // Diagonals (top-right to bottom-left)
    for (let r = 0; r <= size - win; r++) {
      for (let c = win - 1; c < size; c++) {
        const diag = [];
        for (let i = 0; i < win; i++) diag.push(squares[(r + i) * size + (c - i)]);
        const res = checkLine(diag);
        if (res) return res;
      }
    }

    return null;
  }

  const handleClick = (i) => {
    if (isGameOver || board[i]) return;
    
    if (!isMyTurn) return;
    
    const newBoard = board.slice();
    newBoard[i] = playerSymbol;
    setBoard(newBoard);
    const nextTurn = !xIsNext;
    setXIsNext(nextTurn);

    if (socket) {
      socket.emit('send_move', {
        roomId,
        board: newBoard,
        xIsNext: nextTurn
      });
    }
  };

  const handleRematchRequest = () => {
    if (socket) {
      socket.emit('request_rematch', roomId);
      setRematchStatus('requested');
    }
  };

  const resetBoard = () => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setXIsNext(true);
    setShowResult(false);
    setRematchStatus('idle');
    setCountdown(10);
    setTurnTimer(timePerTurn);
    setTimeoutWinner(null);
  };

  // Sync board size if settings change while in game (rematch or wait modal)
  useEffect(() => {
    resetBoard();
  }, [boardSize]);



  return (
    <div className="tictactoe-game">
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', justifyContent: 'center' }}>
        <div className="status-label" style={{ 
          background: playerSymbol === 'X' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
          color: playerSymbol === 'X' ? '#ef4444' : '#3b82f6',
          border: `1px solid ${playerSymbol === 'X' ? '#ef4444' : '#3b82f6'}`,
          minWidth: '100px'
        }}>
          Bạn: <strong>{playerSymbol}</strong>
        </div>
        
        <div className="status-label" style={{ minWidth: '180px', position: 'relative', overflow: 'hidden' }}>
          {winner ? (
            <span>Kết thúc!</span>
          ) : isDraw ? (
            <span>Hòa!</span>
          ) : (
            <>
              {isMyTurn ? <span style={{color: '#10b981'}}>Lượt của BẠN</span> : <span style={{opacity: 0.7}}>Lượt đối thủ</span>}
              <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                height: '3px', 
                background: isMyTurn ? '#10b981' : '#ccc',
                width: `${(turnTimer / timePerTurn) * 100}%`,
                transition: 'width 1s linear'
              }} />
              <span style={{ marginLeft: '10px', fontSize: '0.9em', fontWeight: 'bold' }}>({turnTimer}s)</span>
            </>
          )}
        </div>
      </div>

      <div className="board" style={{ 
        gridTemplateColumns: `repeat(${boardSize}, ${boardSize === 3 ? '100px' : '65px'})`,
        gridTemplateRows: `repeat(${boardSize}, ${boardSize === 3 ? '100px' : '65px'})`,
        gap: boardSize === 3 ? '12px' : '8px'
      }}>
        {board.map((square, i) => (
          <button 
            key={i} 
            className={`square ${square}`} 
            onClick={() => handleClick(i)}
            style={{
              width: boardSize === 3 ? '100px' : '65px',
              height: boardSize === 3 ? '100px' : '65px',
              fontSize: boardSize === 3 ? '2.5rem' : '1.8rem'
            }}
          >
            {square}
          </button>
        ))}
      </div>

      {/* Modal báo kết quả và chơi lại */}
      <Modal
        title={null}
        open={showResult}
        footer={null}
        closable={false}
        centered
        width={400}
        className="result-modal"
        styles={{
          content: {
            borderRadius: '32px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            padding: '40px 32px',
            boxShadow: 'var(--shadow)',
          },
          body: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }
        }}
      >
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ marginBottom: '24px' }}>
            {winner || timeoutWinner ? (
              (userWon || timeoutWinner === socket?.id) ? (
                <div className="result-animation">
                  <TrophyFilled style={{ fontSize: '5rem', color: '#ffcc00', marginBottom: '20px' }} />
                  <Title level={1} style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800 }}>CHIẾN THẮNG!</Title>
                  {timeoutWinner && <Text type="success">Đối thủ hết thời gian ⏱️</Text>}
                </div>
              ) : (
                <div className="result-animation">
                  <CloseCircleFilled style={{ fontSize: '5rem', color: '#ef4444', marginBottom: '20px' }} />
                  <Title level={2} style={{ margin: 0, fontSize: '2rem' }}>BẠN ĐÃ THUA</Title>
                  {timeoutWinner && <Text type="danger">Bạn đã hết thời gian ⏱️</Text>}
                </div>
              )
            ) : (
              <div className="result-animation">
                <InfoCircleFilled style={{ fontSize: '5rem', color: '#94a3b8', marginBottom: '20px' }} />
                <Title level={2} style={{ margin: 0, fontSize: '2rem' }}>HÒA NHAU!</Title>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <Text type="secondary" style={{ fontSize: '1.1rem' }}>
              {rematchStatus === 'requested' 
                ? 'Đang chờ đối thủ đồng ý...' 
                : rematchStatus === 'waiting_for_you' 
                ? '🎁 Đối thủ thách đấu lại bạn!' 
                : 'Bạn có muốn phục thù ván mới?'}
            </Text>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <Progress 
              type="circle" 
              percent={(countdown / 10) * 100} 
              size={100} 
              format={() => (
                <div style={{ color: 'var(--text-main)', fontWeight: 800 }}>
                  <div style={{ fontSize: '1.5rem' }}>{countdown}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>GIÂY</div>
                </div>
              )}
              strokeColor={{
                '0%': '#10b981',
                '100%': '#059669',
              }}
              railColor="var(--border-glass)"
              strokeWidth={8}
            />
          </div>

          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button 
              type="primary" 
              size="large" 
              block 
              disabled={rematchStatus === 'requested' || countdown === 0}
              onClick={handleRematchRequest}
              className="rematch-btn"
              style={{ 
                height: '56px', 
                borderRadius: '16px', 
                fontWeight: 800, 
                fontSize: '1.1rem',
                boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
              }}
            >
              {rematchStatus === 'waiting_for_you' ? 'CHẤP NHẬN CHƠI LẠI' : 'YÊU CẦU CHƠI LẠI'}
            </Button>
            <Button 
              type="text" 
              block 
              style={{ color: 'var(--text-muted)', fontSize: '1rem' }}
              onClick={() => navigate(`/`)}
            >
              Rời khỏi phòng
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default TicTacToe;
