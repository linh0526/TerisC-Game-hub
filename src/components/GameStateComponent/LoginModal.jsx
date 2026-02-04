import React from 'react';
import { Modal, Typography } from 'antd';
import { UserOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const LoginModal = ({ open, tempName, setTempName, onSubmit }) => {
  const funnyNames = [
    "Mèo Đi Hia", "Gấu Trúc Kungfu", "Sóc Siêu Quậy", "Thỏ Bảy Màu", "Cáo 9 Đuôi",
    "Gà Mờ", "Vịt Bầu", "Sư Tử Hà Đông", "Cá Sấu Lên Bờ", "Đại Bàng",
    "Phượng Hoàng Lửa", "Dũng Sĩ Diệt Mồi", "Thánh Ăn Vạ", "Thần Bài", "Chúa Tể Bóng Đêm",
    "Siêu Nhân Gao", "Doremon", "Nobita", "Chaien", "Xuka"
  ];

  const handleRandomName = () => {
    const randomName = funnyNames[Math.floor(Math.random() * funnyNames.length)];
    setTempName(randomName);
  };

  return (
    <Modal
      title={null}
      open={open}
      footer={null}
      closable={false}
      centered
      width={450}
      className="login-box-modal"
      styles={{ content: { padding: 0, borderRadius: '32px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-glass)', overflow: 'hidden' }}}
    >

      <div style={{ padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <Title level={3} style={{ margin: 0, color: 'var(--text-main)' }}>Chào bạn!</Title>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="login-input-wrapper">
            <Text style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>BIỆT DANH / TÊN HIỂN THỊ</Text>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Nhập tên để bắt đầu..." 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  borderRadius: '16px',
                  border: '1px solid var(--border-glass)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-main)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'var(--transition)'
                }}
                autoFocus
              />
              <button
                onClick={handleRandomName}
                style={{
                  width: '56px',
                  borderRadius: '16px',
                  border: '1px solid var(--border-glass)',
                  background: 'rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: '0.2s'
                }}
                title="Tên ngẫu nhiên"
                className="dice-btn"
              >
                🎲
              </button>
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <button 
              className="start-game-btn" 
              onClick={onSubmit}
              disabled={!tempName.trim()}
              style={{ 
                height: '60px', 
                fontSize: '1.1rem', 
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}
            >
              OK!
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
