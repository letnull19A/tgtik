import React, { useState } from 'react';
import styles from './RegistrationBlock.module.css';
import RegistrationInfoBlock from './RegistrationInfoBlock';

export type Sex = 'male' | 'female' | 'other'

type RegistrationBlockProps = {
  onChangeAge: (value: string) => void
  onChangeGender: (value: Sex) => void
}

const RegistrationBlock: React.FC<RegistrationBlockProps> = ({ onChangeAge, onChangeGender }) => {
  const [sex, setSex] = useState<Sex>('female');
  const [age, setAge] = useState('');
  const [ageError, setAgeError] = useState('');

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Только числа, не более 3 символов
    if (!/^\d{0,3}$/.test(value)) return;
    setAge(value);
    onChangeAge(value);
    if (value === '') {
      setAgeError('');
      return;
    }
    const num = Number(value);
    if (num < 16 || num > 100) {
      setAgeError('Age must be from 16 to 100');
    } else {
      setAgeError('');
    }
  };

  const handleGenderChange = (value: Sex) => {
    setSex(value);
    onChangeGender(value);
  };

  return (
    <>
      <div className={styles.registrationPopup}>
        <div className={styles.registrationTitle}>
          Registration is required to <br />continue so we can better <br />collect data on ratings
        </div>
        <div className={styles.registrationLabel}>Please indicate your gender</div>
        <div className={styles.registrationGenderBlock}>
          <div className={styles.registrationGenderRow} onClick={() => handleGenderChange('male')} style={{cursor: 'pointer'}}>
            <div className={styles.registrationGenderText}>Male</div>
            <div className={styles.registrationGenderRadio + (sex === 'male' ? ' ' + styles.selected : '')}>
              {sex === 'male' && <div className={styles.registrationGenderRadioDot} />}
            </div>
          </div>
          <div className={styles.registrationGenderRow} onClick={() => handleGenderChange('female')} style={{cursor: 'pointer'}}>
            <div className={styles.registrationGenderText}>Female</div>
            <div className={styles.registrationGenderRadio + (sex === 'female' ? ' ' + styles.selected : '')}>
              {sex === 'female' && <div className={styles.registrationGenderRadioDot} />}
            </div>
          </div>
          <div className={styles.registrationGenderRow} onClick={() => handleGenderChange('other')} style={{cursor: 'pointer'}}>
            <div className={styles.registrationGenderText}>Other</div>
            <div className={styles.registrationGenderRadio + (sex === 'other' ? ' ' + styles.selected : '')}>
              {sex === 'other' && <div className={styles.registrationGenderRadioDot} />}
            </div>
          </div>
        </div>
        <div className={styles.registrationLabel}>Please indicate your age</div>
        <div className={ageError ? styles.registrationAgeBlockError : styles.registrationAgeBlock}>
          <div className={styles.registrationAgeRow}>
            <div
              className={styles.registrationAgeInput}>Age</div>
            <div className={styles.registrationAgeDivider} />
            <input
                type="number"
                className={styles.registrationAgeDesc}
                placeholder="from 16 to 100 years"
                value={age}
                onChange={handleAgeChange}
                min={16}
                max={100}
                maxLength={3}
            />
          </div>
        </div>
      </div>
      <RegistrationInfoBlock />
    </>
  );
};

export default RegistrationBlock; 