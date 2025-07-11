import React from 'react';
import styles from './WelcomeScreen.module.css';

interface WelcomeScreenProps {
  activeDot: number;
  dotsCount: number;
}

function WelcomeScreen({ activeDot, dotsCount }: WelcomeScreenProps) {
  return (
    <>
      <div className={styles.textCard}>
        <h1 className={styles.titleTextCard}>Rate videos and earn real money</h1>
        <p className={styles.contentTextCard}>
          Companies pay for each video you watch and rate to help determine the most popular content.
        </p>
      </div>
      <div className={styles.dots}>
        {[...Array(dotsCount)].map((_, idx) => (
          <span key={idx} className={`${styles.dot}${activeDot === idx ? ` ${styles.active}` : ''}`} />
        ))}
      </div>
    </>
  );
}

export default WelcomeScreen; 