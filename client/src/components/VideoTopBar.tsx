import React from 'react';
import { ReactComponent as GiftIcon } from '../assets/GiftIcon.svg';
import { ReactComponent as InfoIcon } from '../assets/InfoIcon.svg';
import styles from './VideoTopBar.module.css';

interface VideoTopBarProps {
  onGiftClick?: () => void;
  maxVideos: number
  rate: number
  onProfileClick?: () => void;
  translations: any;
}

function VideoTopBar({ onGiftClick, rate, maxVideos, onProfileClick, translations }: VideoTopBarProps) {
  return (
    <div className={styles.videoTopBar}>
      <GiftIcon className={styles.topbarGiftIcon} onClick={onGiftClick} style={{cursor: 'pointer'}} />
      <div className={styles.topbarCenter}>
        <span className={styles.topbarProgress}>{rate} / {maxVideos}</span>
        <span className={styles.topbarDivider} />
        <span className={styles.topbarTitle}>{translations.rateVideo}</span>
      </div>
      <InfoIcon className={styles.topbarInfoIcon} onClick={onProfileClick} style={{cursor: 'pointer'}} />
    </div>
  );
}

export default VideoTopBar; 