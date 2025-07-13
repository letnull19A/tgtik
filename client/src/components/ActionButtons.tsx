import React from 'react';
import styles from './ActionButtons.module.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface ActionButtonsProps {
  showRegistration: boolean;
  onNext: () => void;
  onCreateAccount: () => void;
  isAgeValid: boolean;
  translations: any;
}

function ActionButtons({ showRegistration, onNext, onCreateAccount, isAgeValid, translations }: ActionButtonsProps) {
  const channelUrl = useSelector((state: RootState) => state.channel.inviteLink);
  const channelLoading = useSelector((state: RootState) => state.channel.isLoading);

  const handleSubscribeClick = () => {
    if (!channelUrl) {
      console.log('Channel URL not available');
      return;
    }
    
    if (window.Telegram?.WebApp && typeof window.Telegram.WebApp.openTelegramLink === 'function') {
      window.Telegram.WebApp.openTelegramLink(channelUrl);
    } else {
      window.open(channelUrl, '_blank');
    }
  };

  return (
    <>
      {showRegistration ? (
        <button
          className={`${styles.nextBtn} ${styles.registrationAccountBtn}`}
          onClick={onCreateAccount}
          disabled={!isAgeValid}
        >
          {translations.createAccount}
        </button>
      ) : (
        <button className={styles.nextBtn} onClick={onNext}>
          {translations.next}
        </button>
      )}
      <div 
        className={styles.subscribeLink} 
        onClick={handleSubscribeClick}
        style={{ 
          opacity: channelLoading ? 0.6 : 1,
          cursor: channelUrl ? 'pointer' : 'default'
        }}
      >
        {translations.subscribeToCommunities}
      </div>
    </>
  );
}

export default ActionButtons; 