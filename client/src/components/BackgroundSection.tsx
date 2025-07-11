import React from 'react';
import HomeBackground from '../assets/HomeBackground.png';
import HomeIcons from '../assets/HomeIcons.png';
import styles from './BackgroundSection.module.css';

function BackgroundSection() {
  return (
    <>
      <div className={styles.backgroundUpContainer}>
        <img className={styles.backgroundUp} src={HomeBackground} alt="Bckg"/>
      </div>
      <div className={styles.upContainer}>
        <div className={styles.logos}>
          <img className={styles.homeIcons} src={HomeIcons} alt="Home Icons"/>
        </div>
      </div>
    </>
  );
}

export default BackgroundSection; 