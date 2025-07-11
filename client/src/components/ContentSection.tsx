import React, { useState } from 'react';
import RegistrationBlock, { Sex } from './RegistrationBlock';
import Loader from './Loader';
import BottomNavBar from './BottomNavBar';
import WelcomeScreen from './WelcomeScreen';
import ActionButtons from './ActionButtons';
import styles from './ContentSection.module.css';

import PreviewSlide1 from '../assets/PreviewSlide1.png';
import PreviewSlide2 from '../assets/PreviewSlide2.png';
import PreviewSlide3 from '../assets/PreviewSlide3.png';

interface ContentSectionProps {
  showRegistration: boolean;
  isLoading: boolean;
  activeDot: number;
  dotsCount: number;
  onNext: () => void;
  onCreateAccount: (age: number, sex: Sex) => void;
  translations: any;
}

function ContentSection({ 
  showRegistration, 
  isLoading, 
  activeDot, 
  dotsCount, 
  onNext, 
  onCreateAccount, 
  translations
}: ContentSectionProps) {
  const [age, setAge] = useState<number | null>(null)
  const [sex, setSex] = useState<Sex>('female')

  const slideImages = [PreviewSlide1, PreviewSlide2, PreviewSlide3];

  return (
    <>
      <div className={styles.upContainer}>
        <div className={styles.logos}>
          {/* Logos are handled by BackgroundSection */}
        </div>
        {showRegistration ? (
          <RegistrationBlock onChangeAge={v => setAge(v ? Number(v) : null)} onChangeGender={v => setSex(v)} translations={translations}/>
        ) : (
          <div className={styles.phoneCard}>
            <img
              src={slideImages[activeDot]}
              alt="slide preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 34,
                boxShadow: (activeDot === 0 || activeDot === 2) ? '0px -4px 46.5px 2px rgba(255, 43, 84, 0.50)' : undefined
              }}
            />
          </div>
        )}
      </div>
      <div className={styles.downTextContainer}>
        {isLoading ? (
          <>
            <Loader />
            {showRegistration && <BottomNavBar translations={translations} />}
          </>
        ) : (
          <>
            {!showRegistration && (
              <WelcomeScreen activeDot={activeDot} dotsCount={dotsCount} translations={translations} />
            )}
            <ActionButtons 
              showRegistration={showRegistration}
              onNext={onNext}
              onCreateAccount={() => { if (age !== null) onCreateAccount(age, sex) }}
              isAgeValid={
                typeof age === 'number' &&
                /^([1-9][6-9]|[2-9][0-9]|100)$/.test(String(age))
              }
              translations={translations}
            />
          </>
        )}
      </div>
    </>
  );
}

export default ContentSection; 