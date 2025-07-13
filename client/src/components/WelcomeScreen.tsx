import React from 'react';
import styles from './WelcomeScreen.module.css';

interface WelcomeScreenProps {
  activeDot: number;
  dotsCount: number;
  translations: any;
}

function WelcomeScreen({ activeDot, dotsCount, translations }: WelcomeScreenProps) {
  return (
    <div className={styles.dots}>
      {[...Array(dotsCount)].map((_, idx) => (
        <span key={idx} className={`${styles.dot}${activeDot === idx ? ` ${styles.active}` : ''}`} />
      ))}
    </div>
  );
}

export default WelcomeScreen; 