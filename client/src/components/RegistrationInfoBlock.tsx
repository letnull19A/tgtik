import React from 'react';
import styles from './RegistrationInfoBlock.module.css';

const RegistrationInfoBlock: React.FC = () => (
  <ul className={styles.registrationInfoList}>
    <li className={styles.registrationInfoItem}>Please specify your age (from 16 to 100)</li>
    <li className={styles.registrationInfoItem}>Please also specify your gender.</li>
  </ul>
);

export default RegistrationInfoBlock; 