import React from 'react';
import styles from './RegistrationInfoBlock.module.css';

const RegistrationInfoBlock: React.FC = () => (
    <div className={styles.registrationInfoListContainer}>
        <ul className={styles.registrationInfoList}>
          <li className={styles.registrationInfoItem}>Please specify your age (from 16 to 100)</li>
          <li className={styles.registrationInfoItem}>Please also specify your gender.</li>
        </ul>
    </div>
);

export default RegistrationInfoBlock; 