import React from 'react';
import styles from './BottomNavBar.module.css';
import { ReactComponent as HomeIcon } from '../assets/HomeIcon.svg';
import { ReactComponent as BonusIcon } from '../assets/BonusIcon.svg';
import { ReactComponent as MoneyIcon } from '../assets/MoneyIcon.svg';

interface BottomNavBarProps {
  onSelect?: (tab: 'home' | 'bonus' | 'money') => void;
  activeTab?: 'home' | 'bonus' | 'money';
  isModalOpen?: boolean;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onSelect, activeTab = 'home', isModalOpen = false }) => (
  <div className={styles.bottomNavBar}>
      <div className={styles.bottomNavBarContainer}>
          <div
              className={styles.navItem + ' ' + (activeTab === 'home' ? styles.navItemActive : '')}
              onClick={() => onSelect && onSelect('home')}
          >
              <div className={styles.navIcon}>
                  <HomeIcon fill={isModalOpen ? 'rgba(255,255,255,0.5)' : (activeTab === 'home' ? '#fff' : 'rgba(255,255,255,0.5)')} />
              </div>
              <div
                  className={styles.navLabel}
                  style={{ color: isModalOpen ? 'rgba(255,255,255,0.5)' : (activeTab === 'home' ? '#fff' : 'rgba(255,255,255,0.5)') }}
              >
                  Home
              </div>
          </div>
          <div
              className={styles.navItem + ' ' + (activeTab === 'bonus' ? styles.navItemActive : '')}
              onClick={() => onSelect && onSelect('bonus')}
          >
              <div className={styles.navIcon}>
                  <BonusIcon fill={isModalOpen ? 'rgba(255,255,255,0.5)' : (activeTab === 'bonus' ? '#fff' : 'rgba(255,255,255,0.5)')} />
              </div>
              <div
                  className={styles.navLabel}
                  style={{ color: isModalOpen ? 'rgba(255,255,255,0.5)' : (activeTab === 'bonus' ? '#fff' : 'rgba(255,255,255,0.5)') }}
              >
                  Bonus
              </div>
          </div>
          <div
              className={styles.navItem + ' ' + (activeTab === 'money' ? styles.navItemActive : '')}
              onClick={() => onSelect && onSelect('money')}
          >
              <div className={styles.navIcon}>
                  <MoneyIcon fill={isModalOpen ? '#fff' : (activeTab === 'money' ? '#fff' : 'rgba(255,255,255,0.5)')} />
              </div>
              <div
                  className={styles.navLabel}
                  style={{ color: isModalOpen ? '#fff' : (activeTab === 'money' ? '#fff' : 'rgba(255,255,255,0.5)') }}
              >
                  Money
              </div>
          </div>
      </div>
  </div>
);

export default BottomNavBar; 