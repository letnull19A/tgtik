import React from 'react';
import styles from './VideoBalanceBar.module.css';

interface VideoBalanceBarProps {
  balance?: number;
}

function VideoBalanceBar({ balance = 0 }: VideoBalanceBarProps) {
  return (
    <div className={styles.videoBalanceBar}>${balance}</div>
  );
}

export default VideoBalanceBar; 