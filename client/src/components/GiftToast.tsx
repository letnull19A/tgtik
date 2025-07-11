import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ReactComponent as WarningToast } from '../assets/WarningToast.svg';
import { ReactComponent as CloseToastIcon } from '../assets/CloseToastIcon.svg';
import styles from './GiftToast.module.css';

interface GiftToastProps {
  onClose: () => void;
}

function GiftToast({ onClose }: GiftToastProps) {
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    // Запускаем анимацию появления после первого рендера
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(onClose, 300); // время для анимации
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div className={`${styles.giftToast}${visible ? ` ${styles.giftToastVisible}` : ` ${styles.giftToastHidden}`}`}>
      <WarningToast className={styles.giftToastWarning} />
      <div className={styles.giftToastContent}>
        <div className={styles.giftToastTitle}>You dont have a sponsor subscription</div>
        <div className={styles.giftToastDesc}>Subscribe and try again</div>
      </div>
      <button className={styles.giftToastClose} onClick={() => setVisible(false)}>
        <CloseToastIcon />
      </button>
    </div>
  );
}

export default GiftToast; 