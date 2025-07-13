import React from "react";
import HomeBackground from '../assets/HomeBackground.png';
import styles from './BackgroundSection.module.css';

interface BackgroundSectionProps {
  translations?: any;
}

const BackgroundSection: React.FC<BackgroundSectionProps> = ({ translations }) => (
  <div className={styles.backgroundUpContainer}>
    <img className={styles.backgroundUp} src={HomeBackground} alt="Bckg" />
    {translations && (
      <div className={styles.overlayText}>
        <h1 className={styles.overlayTitle}>{translations.rateVideosTitle}</h1>
        <p className={styles.overlayDescription}>{translations.rateVideosDesc}</p>
      </div>
    )}
  </div>
);

export default BackgroundSection; 