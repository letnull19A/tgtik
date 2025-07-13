import React from 'react';

interface VideoLimitModalProps {
  current: number;
  max: number;
  onContinue: () => void;
  translations: any;
}

const circleStyle: React.CSSProperties = {
  width: 100,
  height: 100,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 32px auto',
  fontSize: 32,
  fontWeight: 700,
  color: '#fff',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  fontWeight: 700,
  fontSize: 18,
  color: '#fff',
  marginBottom: 8,
};

const descStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#bdbdbd',
  fontSize: 15,
  marginBottom: 24,
  lineHeight: 1.4,
};

const blueText: React.CSSProperties = {
  color: '#6EC1FF',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  background: '#FF2B54',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  fontSize: 20,
  fontWeight: 600,
  padding: '14px 0',
  marginTop: 16,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
};

const wrapperStyle: React.CSSProperties = {
  maxWidth: 320,
  margin: '0 auto',
  padding: '40px 16px 24px 16px',
  background: 'rgba(0,0,0,0.0)',
  borderRadius: 18,
  textAlign: 'center',
};

const VideoLimitModal: React.FC<VideoLimitModalProps> = ({ current, max, onContinue, translations }) => {
  return (
    <div style={wrapperStyle}>
      <div style={circleStyle}>{current - 1}/{max}</div>
      <div style={titleStyle}>
        {translations.videoLimitTitle || `You have rated ${max} videos.`}
      </div>
      <div style={descStyle}>
        {translations.videoLimitDesc || 
          `This is the maximum daily limit.
          Come back tomorrow to continue earning
          (videos are refreshed `}
        <span>
          {translations.videoLimitRefresh || 'every 24 hours'}
        </span>
        {translations.videoLimitDescEnd || ').'}
      </div>
      <button style={buttonStyle} onClick={onContinue}>
        {translations.continue || 'Continue'}
      </button>
    </div>
  );
};

export default VideoLimitModal;

