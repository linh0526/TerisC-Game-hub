import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Progress, Typography, Space } from 'antd';
import { TrophyFilled, CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons';

const { Title, Text } = Typography;
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TicTacToe = ({ roomId, id }) => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [socket, setSocket] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  
  // Trạng thái chơi lại
  const [showResult, setShowResult] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [rematchStatus, setRematchStatus] = useState('idle'); // 'idle', 'requested', 'waiting'

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);
  const isGameOver = !!winner || isDraw;

  useEffect(() => {
    if (isGameOver) {
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
  }, [isGameOver]);

  useEffect(() => {
    if (roomId) {
      const newSocket = io(SOCKET_URL, {
        transports: ["websocket"],
        withCredentials: true
      });
      setSocket(newSocket);

      newSocket.emit('join_room', { roomId, gameId: 'tictactoe' });

      newSocket.on('player_assignment', (symbol) => {
        setPlayerSymbol(symbol);
      });

      newSocket.on('receive_move', (data) => {
        setBoard(data.board);
        setXIsNext(data.xIsNext);
      });

      newSocket.on('start_rematch', () => {
        resetBoard();
      });

      newSocket.on('rematch_requested', () => {
        setRematchStatus('waiting_for_you');
      });

      return () => newSocket.close();
    }
  }, [roomId]);

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  const handleClick = (i) => {
    if (isGameOver || board[i]) return;
    const isMyTurn = (xIsNext && playerSymbol === 'X') || (!xIsNext && playerSymbol === 'O');
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
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setShowResult(false);
    setRematchStatus('idle');
    setCountdown(10);
  };

  const isMyTurn = (xIsNext && playerSymbol === 'X') || (!xIsNext && playerSymbol === 'O');
  const userWon = winner === playerSymbol;

  return (
    <div className="tictactoe-game">
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div className="status-label" style={{ 
          background: playerSymbol === 'X' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
          color: playerSymbol === 'X' ? '#ef4444' : '#3b82f6',
          border: `1px solid ${playerSymbol === 'X' ? '#ef4444' : '#3b82f6'}`
        }}>
          Bạn là: <strong>{playerSymbol}</strong>
        </div>
        
        <div className="status-label">
          {winner ? `Thắng: ${winner}` : isDraw ? 'Hòa!' : isMyTurn ? 'Lượt của BẠN' : `Lượt của đối thủ`}
        </div>
      </div>

      <div className="board">
        {board.map((square, i) => (
          <button key={i} className={`square ${square}`} onClick={() => handleClick(i)}>
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
            {winner ? (
              userWon ? (
                <div className="result-animation">
                  <TrophyFilled style={{ fontSize: '5rem', color: '#ffcc00', marginBottom: '20px' }} />
                  <Title level={1} style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800 }}>CHIẾN THẮNG!</Title>
                </div>
              ) : (
                <div className="result-animation">
                  <CloseCircleFilled style={{ fontSize: '5rem', color: '#ef4444', marginBottom: '20px' }} />
                  <Title level={2} style={{ margin: 0, fontSize: '2rem' }}>BẠN ĐÃ THUA</Title>
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
              trailColor="var(--border-glass)"
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
              onClick={() => navigate(`/${id}`)}
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
