import React from 'react';
import styles from './VideoBalanceBar.module.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface VideoBalanceBarProps {
  translations: any;
}

export default function VideoBalanceBar({ translations }: VideoBalanceBarProps) {
  const balance = useSelector((state: RootState) => state.balance.value);
  return (
    <div className={styles.videoBalanceBar}>
      <span>{translations.currency}{balance}</span>
    </div>
  );
} 