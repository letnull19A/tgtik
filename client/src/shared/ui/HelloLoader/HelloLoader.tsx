import React, { useEffect, useState } from "react";
import styles from "./HelloLoader.module.css";
import HelloLoaderBackgroundImage from "../assets/HelloLoaderBackgroundImage.png";
import { ReactComponent as HomeIcons } from '../assets/HomeIconsBig.svg';

const PROGRESS_DURATION = 1000; // 1 секунда

const HelloLoader: React.FC<{onFinish?: () => void}> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = Date.now();
    let frame: number;
    const animate = () => {
      const elapsed = Date.now() - start;
      const percent = Math.min(elapsed / PROGRESS_DURATION, 1);
      setProgress(percent);
      if (percent < 1) {
        frame = requestAnimationFrame(animate);
      } else if (onFinish) {
        onFinish();
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [onFinish]);

  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.leftGradient} />
      <div className={styles.rightGradient} />
      <img
        src={HelloLoaderBackgroundImage}
        alt="background"
        className={styles.backgroundImage}
      />
      <div className={styles.iconsContainer}>
          <HomeIcons className={styles.homeIcons} />
      </div>
      <div className={styles.progressBarBg}>
        <div
          className={styles.progressBarFg}
          style={{ width: `${209 * progress}px` }}
        />
      </div>
    </div>
  );
};

export default HelloLoader; 