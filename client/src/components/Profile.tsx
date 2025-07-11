import React from 'react';
import styles from './Profile.module.css';

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
}

const Profile: React.FC<ProfileProps> = ({
  username = '@hunkyfoxx',
  avatarUrl = 'https://placehold.co/82x82',
  registrationDate = '30.06.2025',
  friendsInvited = 0,
  likes = 1,
  dislikes = 0,
  earnings = '$120',
  isVerified = false,
  onPassVerification,
  onClose
}) => {
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <h2 className={styles.profileTitle}>Your profile</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <div className={styles.profileIcon}>
              <div className={styles.profileIconInner}></div>
            </div>
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