import React, { useState, useLayoutEffect } from 'react';
import GiftWindowImage from '../assets/GiftWindow.png';
import { ReactComponent as CloseGiftWindowIcon } from '../assets/CloseGiftWindowIcon.svg';
import { ReactComponent as GiftIconWindowGift } from '../assets/GiftIconWindowGift.svg';
import styles from './GiftWindow.module.css';

interface GiftWindowProps {
  onClose: () => void;
}

function GiftWindow({ onClose }: GiftWindowProps) {
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className={`${styles.giftWindow}${visible ? ` ${styles.giftWindowVisible}` : ` ${styles.giftWindowHidden}`}`}>
      <div className={styles.giftContentWindow}>
        <div className={styles.giftContentWindowContainer}>
          <img className={styles.giftContentWindowImage} src={GiftWindowImage} alt="GiftWindowImage"/>
          <button className={styles.closeGiftWindowIconBtn} onClick={(e) => onClose()}>
            <CloseGiftWindowIcon className={styles.closeGiftWindowIcon} />
          </button>
          <div className={styles.innerContentGiftWindow}>
            <div className={styles.innerContentGiftWindowTitle}>Bonus Gift</div>
            <div className={styles.innerContentGiftWindowInfoContainer}>
              <div className={styles.innerContentGiftWindowInfoIconContainer}>
                <GiftIconWindowGift className={styles.innerContentGiftWindowInfoIcon} />
              </div>
              <div className={styles.innerContentGiftWindowBalanceText}>to balance</div>
              <div className={styles.innerContentGiftWindowBalanceValue}>+$100</div>
            </div>
            <div className={styles.innerContentGiftWindowClaim}>Claim gift</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiftWindow; 