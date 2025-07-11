import React, { useState } from 'react';
import RegistrationBlock, { Sex } from './RegistrationBlock';
import Loader from './Loader';
import BottomNavBar from './BottomNavBar';
import WelcomeScreen from './WelcomeScreen';
import ActionButtons from './ActionButtons';
import styles from './ContentSection.module.css';

interface ContentSectionProps {
  showRegistration: boolean;
  isLoading: boolean;
  activeDot: number;
  dotsCount: number;
  onNext: () => void;
  onCreateAccount: (age: number, sex: Sex) => void;
}

function ContentSection({ 
  showRegistration, 
  isLoading, 
  activeDot, 
  dotsCount, 
  onNext, 
  onCreateAccount 
}: ContentSectionProps) {
  const [age, setAge] = useState<number | null>(null)
  const [sex, setSex] = useState<Sex>('female')
  return (
    <>
      <div className={styles.upContainer}>
        <div className={styles.logos}>
          {/* Logos are handled by BackgroundSection */}
        </div>
        {showRegistration ? <RegistrationBlock onChangeAge={v => setAge(v ? Number(v) : null)} onChangeGender={v => setSex(v)}/> : <div className={styles.phoneCard}></div>}
      </div>
      <div className={styles.downTextContainer}>
        {isLoading ? (
          <>
            <Loader />
            {showRegistration && <BottomNavBar />}
          </>
        ) : (
          <>
            {!showRegistration && (
              <WelcomeScreen activeDot={activeDot} dotsCount={dotsCount} />
            )}
            <ActionButtons 
              showRegistration={showRegistration}
              onNext={onNext}
              onCreateAccount={() => { if (age !== null) onCreateAccount(age, sex) }}
            />
          </>
        )}
      </div>
    </>
  );
}

export default ContentSection; 