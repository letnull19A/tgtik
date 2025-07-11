import React, { useEffect, useState } from 'react';
import { ReactComponent as WarningToast } from '../assets/WarningToast.svg';
import { ReactComponent as CloseToastIcon } from '../assets/CloseToastIcon.svg';
import styles from './GiftToast.module.css';

interface GiftToastProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const GiftToast: React.FC<GiftToastProps> = ({ open, onClose, title, description }) => {
  const [visible, setVisible] = useState(open);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let autoCloseTimeout: NodeJS.Timeout | null = null;
    if (open) {
      setVisible(true);
      setAnimate(false);
      const raf = requestAnimationFrame(() => setAnimate(true));
      // Автоматическое закрытие через 2 секунды
      autoCloseTimeout = setTimeout(() => {
        handleRequestClose();
      }, 2000);
      return () => {
        cancelAnimationFrame(raf);
        if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
      };
    } else {
      setAnimate(false);
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  const handleRequestClose = () => {
    setAnimate(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      className={styles.giftToast + (animate && open ? ' ' + styles.open : '')}
      onClick={handleRequestClose}
    >
      <WarningToast className={styles.giftToastWarning} />
      <div className={styles.giftToastContent}>
        <div className={styles.giftToastTitle}>{title}</div>
        <div className={styles.giftToastDesc}>{description}</div>
      </div>
      <button className={styles.giftToastCloseBtn} onClick={e => { e.stopPropagation(); handleRequestClose(); }}>
        <CloseToastIcon />
      </button>
    </div>
  );
};

export default GiftToast; 