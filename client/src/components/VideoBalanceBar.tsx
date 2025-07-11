import React from 'react';
import styles from './VideoBalanceBar.module.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export default function VideoBalanceBar() {
  const balance = useSelector((state: RootState) => state.balance.value);
  return (
    <div className={styles.videoBalanceBar}>
      <span>${balance}</span>
    </div>
  );
} 