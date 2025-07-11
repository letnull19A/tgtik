import React from 'react';
import { ReactComponent as GiftIcon } from '../assets/GiftIcon.svg';
import { ReactComponent as InfoIcon } from '../assets/InfoIcon.svg';
import styles from './VideoTopBar.module.css';

interface VideoTopBarProps {
  onGiftClick?: () => void;
  maxVideos: number
  rate: number
}

function VideoTopBar({ onGiftClick, rate, maxVideos }: VideoTopBarProps) {
  return (
    <div className={styles.videoTopBar}>
      <GiftIcon className={styles.topbarGiftIcon} onClick={onGiftClick} style={{cursor: 'pointer'}} />
      <div className={styles.topbarCenter}>
        <span className={styles.topbarProgress}>{rate} / {maxVideos}</span>
        <span className={styles.topbarDivider} />
        <span className={styles.topbarTitle}>Rate video</span>
      </div>
      <InfoIcon className={styles.topbarInfoIcon} />
    </div>
  );
}

export default VideoTopBar; 