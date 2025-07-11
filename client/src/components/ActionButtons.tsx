import React from 'react';
import styles from './ActionButtons.module.css';

interface ActionButtonsProps {
  showRegistration: boolean;
  onNext: () => void;
  onCreateAccount: () => void;
  isAgeValid: boolean;
  translations: any;
}

function ActionButtons({ showRegistration, onNext, onCreateAccount, isAgeValid, translations }: ActionButtonsProps) {
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
      <div className={styles.subscribeLink}>{translations.subscribeToCommunities}</div>
    </>
  );
}

export default ActionButtons; 