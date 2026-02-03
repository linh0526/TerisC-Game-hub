import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { Popover } from 'antd';
import { useTheme } from '../ThemeContext';
import { 
  HomeFilled, 
  BookFilled, 
  TrophyFilled,
  BulbFilled,
  BulbOutlined,
  MessageFilled,
  RobotFilled,
  HeatMapOutlined,
  GithubFilled,
  SettingFilled
} from '@ant-design/icons';

const CustomSidebar = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const settingsContent = (
    <div 
      onClick={() => {
        toggleTheme();
      }}
      style={{ 
        cursor: 'pointer', 
        padding: '4px 8px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        color: 'var(--text-main)',
        minWidth: '160px'
      }}
    >
      {isDarkMode ? <BulbFilled style={{ color: '#ffcc00', fontSize: '1.2rem' }} /> : <BulbOutlined style={{ fontSize: '1.2rem' }} />}
      <span style={{ fontWeight: 500 }}>Giao diện: {isDarkMode ? 'Tối' : 'Sáng'}</span>
    </div>
  );

  return (
    <div className="sidebar-wrapper" style={{ display: 'flex', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 1000 }}>
      <Sidebar 
        backgroundColor="var(--bg-glass)"
        rootStyles={{
          borderRight: '1px solid var(--border-glass)',
          backdropFilter: 'blur(20px)',
          width: 'var(--sidebar-width)',
          minWidth: 'var(--sidebar-width)',
        }}
      >
        {/* User Profile Section (Top) */}
        <div style={{ padding: '40px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '52px', height: '52px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', color: '#fff',
            boxShadow: 'var(--shadow)'
          }}>
            LN
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>Linh Nguyen</h3>
            <span style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span>
              Online
            </span>
          </div>
        </div>
        
        {/* Menu Section */}
        <div style={{ flex: 1 }}>
          <Menu
            menuItemStyles={{
              button: ({ active }) => ({
                backgroundColor: active ? 'var(--border-glass)' : 'transparent',
                color: active ? 'var(--text-main)' : 'var(--text-muted)',
                '&:hover': {
                  backgroundColor: 'var(--border-glass)',
                  color: 'var(--text-main)',
                },
                transition: 'all 0.3s ease',
                borderRadius: '12px',
                margin: '4px 12px',
              }),
              icon: {
                fontSize: '1.2rem',
              },
              label: {
                marginLeft: '10px',
                fontWeight: 500
              }
            }}
          > 
            <MenuItem
              active={location.pathname === '/'}
              component={<Link to="/" />}
              icon={<HomeFilled />}
            > 
              Trang chủ 
            </MenuItem>
            <MenuItem
              active={location.pathname === '/lobby'}
              component={<Link to="/lobby" />}
              icon={<HeatMapOutlined/>}
            > 
              Phòng chờ
            </MenuItem>
            <MenuItem
              component={<Link to="/#" />}
              icon={<TrophyFilled />}
            > 
              Xếp hạng 
            </MenuItem>
            <MenuItem
              component={<Link to="/#" />}
              icon={<MessageFilled />}
            >
              Nhắn tin
            </MenuItem>
            <MenuItem
              component={<Link to="/#" />}
              icon={<RobotFilled />}
            >
              Bạn bè
            </MenuItem>
            <MenuItem
              component={<Link to="/#" />}
              icon={<BookFilled />}
            > 
              Hướng dẫn 
            </MenuItem>
          </Menu>
        </div>

        {/* Footer Section */}
        <div style={{ 
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: '24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: '1px solid var(--border-glass)',
          background: 'var(--bg-glass)', // Đảm bảo nền kính mờ để đẹp hơn
          zIndex: 10
        }}>
          {/* Github Link (Left) */}
          <a 
            href="https://github.com/linh0526" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
            style={{ 
              color: 'var(--text-muted)', 
              fontSize: '1.6rem',
              transition: 'var(--transition)',
              opacity: 0.8,
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'var(--border-glass)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <GithubFilled />
          </a>

          {/* Settings Popover (Right) */}
          <Popover 
            content={settingsContent} 
            trigger="click" 
            placement="topRight"
            overlayInnerStyle={{ 
              backgroundColor: 'var(--bg-card)', 
              borderRadius: '16px',
              border: '1px solid var(--border-glass)',
              boxShadow: 'var(--shadow)'
            }}
          >
            <div 
              style={{ 
                color: 'var(--text-muted)', 
                fontSize: '1.6rem',
                cursor: 'pointer',
                transition: 'var(--transition)',
                opacity: 0.8,
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'var(--border-glass)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <SettingFilled />
            </div>
          </Popover>
        </div>
      </Sidebar>
    </div>
  );
};

export default CustomSidebar;
