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
  
  console.log('DEBUG: ActionButtons render - channelUrl:', channelUrl);
  console.log('DEBUG: ActionButtons render - channelLoading:', channelLoading);

  const handleSubscribeClick = () => {
    console.log('DEBUG: handleSubscribeClick called');
    console.log('DEBUG: channelUrl from Redux:', channelUrl);
    console.log('DEBUG: channelLoading from Redux:', channelLoading);
    
    if (!channelUrl) {
      console.log('Channel URL not available');
      return;
    }
    
    console.log('DEBUG: Opening channel URL:', channelUrl);
    
    if (window.Telegram?.WebApp && typeof window.Telegram.WebApp.openTelegramLink === 'function') {
      console.log('DEBUG: Using Telegram WebApp API');
      window.Telegram.WebApp.openTelegramLink(channelUrl);
    } else {
      console.log('DEBUG: Using window.open');
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