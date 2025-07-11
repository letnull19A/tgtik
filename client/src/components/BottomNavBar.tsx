import React from 'react';
import styles from './BottomNavBar.module.css';
import { ReactComponent as HomeIcon } from '../assets/HomeIcon.svg';
import { ReactComponent as BonusIcon } from '../assets/BonusIcon.svg';
import { ReactComponent as MoneyIcon } from '../assets/MoneyIcon.svg';

const BottomNavBar = () => (
  <div className={styles.bottomNavBar}>
    <div className={`${styles.navItem} ${styles.navItemActive}`}>
      <div className={styles.navIcon}><HomeIcon /></div>
      <div className={styles.navLabel}>Home</div>
    </div>
    <div className={styles.navItem}>
      <div className={styles.navIcon}><BonusIcon /></div>
      <div className={`${styles.navLabel} ${styles.navLabelInactive}`}>Bonus</div>
    </div>
    <div className={styles.navItem}>
      <div className={styles.navIcon}><MoneyIcon /></div>
      <div className={`${styles.navLabel} ${styles.navLabelInactive}`}>Money</div>
    </div>
  </div>
);

export default BottomNavBar; 