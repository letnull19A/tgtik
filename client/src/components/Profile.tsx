import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import { ReactComponent as CloseGiftWindowIcon } from '../assets/CloseGiftWindowIcon.svg';
import Profile1Image from '../assets/Profile1Image.jpg';

interface ProfileProps {
  username?: string;
  avatarUrl?: string;
  registrationDate?: string;
  friendsInvited?: number;
  likes?: number;
  dislikes?: number;
  earnings?: string;
  isVerified?: boolean;
  onPassVerification?: () => void;
  onClose?: () => void;
  open?: boolean;
}

const Profile: React.FC<ProfileProps> = ({
  username = '@hunkyfoxx',
  avatarUrl = Profile1Image,
  registrationDate = '30.06.2025',
  friendsInvited = 0,
  likes = 1,
  dislikes = 0,
  earnings = '$120',
  isVerified = false,
  onPassVerification,
  onClose,
  open = true
}) => {
  const [visible, setVisible] = useState(open);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setAnimate(false);
      const raf = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setAnimate(false);
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div
      className={styles.profileModal + (animate && open ? ' ' + styles.open : '')}
      onClick={onClose}
    >
      <div
        className={styles.profileModalCard + (animate && open ? ' ' + styles.open : '')}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.profileHeader}>
          <h2 className={styles.profileTitle}>Your profile</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <CloseGiftWindowIcon style={{ width: 24, height: 24 }} />
          </button>
        </div>
        <div className={styles.profileContent}>
          <img 
            className={styles.profileAvatar} 
            src={avatarUrl} 
            alt="Profile avatar" 
          />
          <div className={styles.profileUsername}>{username}</div>
          <div className={styles.verificationStatus}>
            <span className={styles.verificationText}>
              {isVerified ? 'Account verified' : 'Account not verified'}
            </span>
          </div>
          <div className={styles.statsContainer}>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{registrationDate}</div>
                <div className={styles.statLabel}>Date of registration</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{friendsInvited}</div>
                <div className={styles.statLabel}>Friends invited</div>
              </div>
            </div>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{likes}</div>
                <div className={styles.statLabel}>Likes</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{dislikes}</div>
                <div className={styles.statLabel}>Dislikes</div>
              </div>
            </div>
          </div>
          <div className={styles.earningsContainer}>
            <div className={styles.statValue}>{earnings}</div>
            <div className={styles.statLabel}>Earnings</div>
          </div>
          <button 
            className={styles.verificationButton}
            onClick={onPassVerification}
          >
            Pass verification
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 