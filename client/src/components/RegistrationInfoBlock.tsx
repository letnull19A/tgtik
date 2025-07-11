import React from 'react';
import styles from './RegistrationInfoBlock.module.css';

const RegistrationInfoBlock: React.FC<{ translations: any }> = ({ translations }) => (
    <div className={styles.registrationInfoListContainer}>
        <ul className={styles.registrationInfoList}>
          <li className={styles.registrationInfoItem}>{translations.specifyAge}</li>
          <li className={styles.registrationInfoItem}>{translations.specifyGender}</li>
        </ul>
    </div>
);

export default RegistrationInfoBlock; 