import React from "react";
import HomeBackground from '../assets/HomeBackground.png';
import styles from './BackgroundSection.module.css';

const BackgroundSection: React.FC = () => (
  <div className={styles.backgroundUpContainer}>
    <img className={styles.backgroundUp} src={HomeBackground} alt="Bckg" />
  </div>
);

export default BackgroundSection; 