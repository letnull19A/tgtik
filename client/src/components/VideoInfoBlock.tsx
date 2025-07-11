import React from 'react';
import { ReactComponent as VerificationIcon } from '../assets/VerificationIcon.svg';
import styles from './VideoInfoBlock.module.css';
import { Video as VideoType } from '../api/types';

interface VideoInfoBlockProps {
  video?: VideoType;
}

function VideoInfoBlock({ video }: VideoInfoBlockProps) {
  if (!video) return null;
  return (
    <div className={styles.videoInfoBlock}>
      <div className={styles.videoInfoChannelRow}>
        <span className={styles.videoInfoChannel}>{video.profileId}</span>
        <VerificationIcon className={styles.videoInfoVerification} />
      </div>
      <div className={styles.videoInfoDesc}>{video.description}</div>
      <div className={styles.videoInfoTags}>{video.hashtags}</div>
    </div>
  );
}

export default VideoInfoBlock; 