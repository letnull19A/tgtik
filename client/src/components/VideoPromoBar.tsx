import React from 'react';
import { ReactComponent as TelegramIcon } from '../assets/TelegramIcon.svg';
import { ReactComponent as NextStepIcon } from '../assets/NextStepIcon.svg';
import styles from './VideoPromoBar.module.css';

function VideoPromoBar() {
  return (
    <div className={styles.videoPromoBar}>
      <div className={styles.promoMain}>
        <TelegramIcon className={styles.promoTelegramIcon} />
        <span className={styles.promoText}>How to earn more? • all this in the channel 🔥‍🔥‍🔥</span>
      </div>
      <NextStepIcon className={styles.promoNextstepIcon} />
    </div>
  );
}

export default VideoPromoBar; 