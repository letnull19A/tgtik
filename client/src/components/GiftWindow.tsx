import React, { useState, useLayoutEffect, useEffect } from 'react';
import GiftWindowImage from '../assets/GiftWindow.png';
import { ReactComponent as CloseGiftWindowIcon } from '../assets/CloseGiftWindowIcon.svg';
import { ReactComponent as GiftIconWindowGift } from '../assets/GiftIconWindowGift.svg';
import styles from './GiftWindow.module.css';

interface GiftWindowProps {
  onClose: () => void;
  open: boolean;
  onClaimGift: () => void;
  translations: any;
}

function GiftWindow({ onClose, open, onClaimGift, translations }: GiftWindowProps) {
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
      className={styles.giftWindow + (animate && open ? ' ' + styles.open : '')}
      onClick={onClose}
    >
      <div className={styles.giftContentWindow}>
        <div
          className={
            styles.giftContentWindowContainer +
            (animate && open ? ' ' + styles.open : '')
          }
          onClick={e => e.stopPropagation()}
        >
          <img className={styles.giftContentWindowImage} src={GiftWindowImage} alt="GiftWindowImage"/>
          <button className={styles.closeGiftWindowIconBtn} onClick={onClose}>
            <CloseGiftWindowIcon className={styles.closeGiftWindowIcon} />
          </button>
          <div className={styles.innerContentGiftWindow}>
            <div className={styles.innerContentGiftWindowTitle}>{translations.bonusGift}</div>
            <div className={styles.innerContentGiftWindowInfoContainer}>
              <div className={styles.innerContentGiftWindowInfoIconContainer}>
                <GiftIconWindowGift className={styles.innerContentGiftWindowInfoIcon} />
              </div>
              <div className={styles.innerContentGiftWindowBalanceText}>{translations.toBalance}</div>
              <div className={styles.innerContentGiftWindowBalanceValue}>{translations.bonusValue}</div>
            </div>
            <div
              className={styles.innerContentGiftWindowClaim}
              onClick={() => {
                if (onClaimGift) onClaimGift();
                onClose();
              }}
              style={{ cursor: 'pointer' }}
            >
              {translations.claimGift}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiftWindow; 