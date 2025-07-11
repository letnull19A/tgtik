import React from 'react';
import styles from './ActionButtons.module.css';

interface ActionButtonsProps {
  showRegistration: boolean;
  onNext: () => void;
  onCreateAccount: () => void;
  isAgeValid: boolean;
}

function ActionButtons({ showRegistration, onNext, onCreateAccount, isAgeValid }: ActionButtonsProps) {
  return (
    <>
      {showRegistration ? (
        <button
          className={`${styles.nextBtn} ${styles.registrationAccountBtn}`}
          onClick={onCreateAccount}
          disabled={!isAgeValid}
        >
          CREATE AN ACCOUNT
        </button>
      ) : (
        <button className={styles.nextBtn} onClick={onNext}>
          Next
        </button>
      )}
      <div className={styles.subscribeLink}>subscribe to communities</div>
    </>
  );
}

export default ActionButtons; 