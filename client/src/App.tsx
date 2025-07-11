import React, { useEffect, useState } from "react";
import "./App.css";
import HomePage from './components/HomePage';
import BackgroundSection from './components/BackgroundSection';
import ContentSection from './components/ContentSection';
import { BOT_ID, getIsRegistered, register, USER_ID } from "./api/api";
import { Sex } from "./components/RegistrationBlock";

export default function App() {
  const [activeDot, setActiveDot] = useState(0);
  const [showRegistration, setShowRegistration] = useState(false);
  const [nextCount, setNextCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const dotsCount = 3;

  useEffect(() => {
    const checkRegistration = async () => {
      setIsLoading(true)
      try {
        const v = await getIsRegistered(BOT_ID, USER_ID)
        setIsRegistered(v.data.isRegistered);
      } catch (err) {
        // Можно добавить обработку ошибки, если нужно
      } finally {
        setIsLoading(false)
      }
    }
    checkRegistration();
  }, [])

  const handleNext = () => {
    if (nextCount === 2) {
      setShowRegistration(true);
      setNextCount(0);
      return;
    }
    setActiveDot((prev) => (prev + 1) % dotsCount);
    setNextCount((prev) => prev + 1);
  };

  const handleCreateAccount = async (age: number, sex: Sex) => {
    try {
      const response = await register({age, sex, botId: BOT_ID, userId: USER_ID})
      setIsRegistered(response.data.isRegistered)
      setTimeout(() => {
        setIsLoading(false);
        setIsRegistered(true);
      }, 1500);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
    }
    finally {
      setIsLoading(false)
    }
  };

  if (isRegistered) {
    return <HomePage />;
  }

  return (
    <div className="app">
      <div className="content">
        <BackgroundSection />
        <ContentSection 
          showRegistration={showRegistration}
          isLoading={isLoading}
          activeDot={activeDot}
          dotsCount={dotsCount}
          onNext={handleNext}
          onCreateAccount={handleCreateAccount}
        />
      </div>
    </div>
  );
}
