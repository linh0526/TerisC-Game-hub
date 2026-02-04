import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh',
      padding: '40px',
      textAlign: 'center'
    }}>
      <Result
        status="404"
        title={<Title level={1} style={{fontSize: '5rem', margin: 0}}>404</Title>}
        subTitle={
          <div style={{marginBottom: '24px'}}>
            <Title level={3} style={{color: 'var(--text-main)'}}>Ối! Trang này không tồn tại</Title>
            <Text style={{color: 'var(--text-muted)', fontSize: '1.1rem'}}>
              Có vẻ như đường dẫn bạn nhập không chính xác hoặc phòng đã bị đóng. Vui lòng tặng tôi ly coffee.
              
            </Text>
          </div>
        }
        extra={
          <Button 
            type="primary" 
            size="large" 
            icon={<HomeOutlined />} 
            onClick={() => navigate('/')}
            style={{ 
              borderRadius: '12px', 
              height: '52px', 
              paddingInline: '32px',
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            Quay lại Trang chủ
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
