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

  const handleSubscribeClick = () => {
    if (!channelUrl) {
      console.warn('Channel URL not available');
      return;
    }
    
    try {
      if (window.Telegram?.WebApp && typeof window.Telegram.WebApp.openTelegramLink === 'function') {
        window.Telegram.WebApp.openTelegramLink(channelUrl);
      } else {
        window.open(channelUrl, '_blank');
      }
    } catch (error) {
      console.error('Error opening channel link:', error);
      // Fallback: попробуем открыть в новой вкладке
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
      {channelUrl && (
        <div className={styles.subscribeLink} onClick={handleSubscribeClick} style={{ cursor: 'pointer' }}>
          {translations.subscribeToCommunities}
        </div>
      )}
    </>
  );
}

export default ActionButtons; 