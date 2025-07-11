import React from 'react';
import Profile1Image from '../assets/Profile1Image.jpg';
import { ReactComponent as PlusVideoImage } from '../assets/PlusVideoImage.svg';
import { ReactComponent as LikeIcon } from '../assets/LikeIcon.svg';
import { ReactComponent as DislikeIcon } from '../assets/DislikeIcon.svg';
import { ReactComponent as ShareIcon } from '../assets/ShareIcon.svg';
import styles from './VideoSidebar.module.css';

interface VideoSidebarProps {
  onProfileClick: () => void;
  onLike: () => void;
  onDislike: () => void;
  likes: number;
  dislikes: number;
  rate: number;
}

function VideoSidebar({ onProfileClick, onLike, onDislike, likes, dislikes }: VideoSidebarProps) {
  return (
    <div className={styles.videoSidebar}>
      <div className={styles.sidebarProfileWrapper}>
        <img 
          src={Profile1Image} 
          alt="profile" 
          className={styles.sidebarProfileImg} 
          onClick={onProfileClick}
          style={{ cursor: 'pointer' }}
        />
        <div className={styles.sidebarPlusVideo}>
          <div className={styles.sidebarPlusVideoDot}>
            <PlusVideoImage className={styles.sidebarPlusIcon} />
          </div>
        </div>
      </div>
      <div className={styles.sidebarIconBlock} onClick={onLike} style={{ cursor: 'pointer' }}>
        <LikeIcon className={styles.sidebarIcon} />
        <div className={styles.sidebarIconLabel}>{likes}</div>
      </div>
      <div className={styles.sidebarIconBlock} onClick={onDislike} style={{ cursor: 'pointer' }}>
        <DislikeIcon className={styles.sidebarIcon} />
        <div className={styles.sidebarIconLabel}>{dislikes}</div>
      </div>
      <div className={styles.sidebarShareBlock}>
        <ShareIcon className={styles.sidebarShareIcon} />
        <div className={styles.sidebarIconLabel}>Share</div>
      </div>
    </div>
  );
}

export default VideoSidebar; 