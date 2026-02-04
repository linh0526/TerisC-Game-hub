import React from 'react';
import { Modal, Typography, Select, InputNumber } from 'antd';
import { getGameThumbnail } from '../../utils/gameUtils';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SettingsModal = ({ open, onClose, game, onLogout, settings, onSettingsChange, isOwner }) => {
  const handleChange = (key, value) => {
    if (isOwner && onSettingsChange) {
      onSettingsChange({ ...settings, [key]: value });
    }
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      closeIcon={<CloseOutlined style={{ color: 'var(--text-main)', fontSize: '18px' }} />}
      width={480}
      centered
      className="custom-game-modal"
      styles={{ content: { padding: 0, backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-glass)', overflow: 'hidden' }}}
    >
      <div className="modal-custom-header">
        <Title level={4} style={{ margin: 0, color: 'var(--text-main)' }}>Cài đặt</Title>
      </div>

      <div className="modal-custom-body">
        {!isOwner && (
          <div style={{ padding: '8px 16px', background: 'rgba(255, 190, 0, 0.1)', borderRadius: '10px', marginBottom: '16px', border: '1px solid rgba(255, 190, 0, 0.2)' }}>
            <Text style={{ fontSize: '0.85rem', color: '#b28900' }}>⚠️ Chỉ chủ phòng mới có quyền thay đổi cài đặt.</Text>
          </div>
        )}
        <div className="settings-group">
          <div className="game-selector-box" style={{ padding: '12px' }}>
            {game && <img src={getGameThumbnail(game)} alt="thumb" className="mini-thumb" />}
            <div className="selector-info">
              <span className="selector-name">{game?.title}</span>
            </div>
          </div>
        </div>

        <div className="params-box">
          {settings?.gameId === 'minesweeper' ? (
            <>
              <div className="param-row">
                <span className="param-label">Độ khó:</span>
                <Select 
                  value={settings?.difficulty || 'easy'}
                  onChange={v => {
                    let difficultySettings = { difficulty: v };
                    if (v === 'easy') difficultySettings = { ...difficultySettings, width: 9, height: 9, mines: 10 };
                    else if (v === 'medium') difficultySettings = { ...difficultySettings, width: 16, height: 16, mines: 40 };
                    else if (v === 'hard') difficultySettings = { ...difficultySettings, width: 30, height: 16, mines: 99 };
                    
                    onSettingsChange({ ...settings, ...difficultySettings });
                  }}
                  style={{ width: 150 }}
                  options={[
                    { value: 'easy', label: 'Cơ bản (9x9)' },
                    { value: 'medium', label: 'Trung cấp (16x16)' },
                    { value: 'hard', label: 'Chuyên gia (30x16)' },
                    { value: 'custom', label: 'Tùy chỉnh' },
                  ]}
                />
              </div>
              
              {settings?.difficulty === 'custom' && (
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginTop: '8px' }}>
                  <div className="param-row" style={{ marginBottom: '10px' }}>
                    <span className="param-label">Chiều rộng:</span>
                    <InputNumber min={5} max={50} value={settings?.width || 10} onChange={v => handleChange('width', v)} />
                  </div>
                  <div className="param-row" style={{ marginBottom: '10px' }}>
                    <span className="param-label">Chiều cao:</span>
                    <InputNumber min={5} max={50} value={settings?.height || 10} onChange={v => handleChange('height', v)} />
                  </div>
                  <div className="param-row">
                    <span className="param-label">Số lượng mìn:</span>
                    <InputNumber min={1} max={Math.floor((settings?.width * settings?.height || 100) * 0.8)} value={settings?.mines || 15} onChange={v => handleChange('mines', v)} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="param-row">
                <span className="param-label">Thời gian mỗi lượt (giây):</span>
                <InputNumber 
                  min={10} 
                  max={120} 
                  value={settings?.timePerTurn || 30} 
                  onChange={v => handleChange('timePerTurn', v)} 
                  className="custom-input-number" 
                  disabled={!isOwner}
                />
              </div>
              <div className="param-row">
                <span className="param-label">Ai chơi trước?</span>
                <Select 
                  value={settings?.firstPlayer || 'random'}
                  onChange={v => handleChange('firstPlayer', v)}
                  style={{ width: 120 }}
                  disabled={!isOwner}
                  options={[
                    { value: 'random', label: 'Ngẫu nhiên' },
                    { value: 'me', label: 'Tôi' },
                    { value: 'opponent', label: 'Đối thủ' },
                  ]}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="modal-custom-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          className="text-action-btn" 
          onClick={onLogout}
          style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8, fontSize: '0.95rem' }}
        >
          <EditOutlined /> Đổi tên
        </button>
        <button className="confirm-settings-btn" onClick={onClose}> Xong </button>
      </div>
    </Modal>
  );
};

export default SettingsModal;
