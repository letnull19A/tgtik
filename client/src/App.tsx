import React, { useEffect, useState } from "react";
import "./App.css";
import HomePage from './components/HomePage';
import BackgroundSection from './components/BackgroundSection';
import ContentSection from './components/ContentSection';
import BonusPage from './components/BonusPage';
import BottomNavBar from './components/BottomNavBar';
import SubscriptionBlock from './components/SubscriptionBlock';
import { WithdrawalForm } from './components/SubscriptionBlock';
import { BOT_ID, getIsRegistered, register, USER_ID, getRateWithBalance, getCanWithdraw, withdraw } from "./api/api";
import { Sex } from "./components/RegistrationBlock";
import HelloLoader from './components/HelloLoader';
import GiftToast from './components/GiftToast';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { setLoading, setRegistered, setBalance } from './store';
import { AxiosError } from "axios";

function BackgroundModal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      setAnimate(false);
      const raf = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setAnimate(false);
    }
  }, [open]);

  return (
    <div
      className={`money-modal-backdrop${open && animate ? ' open' : ''}`}
      style={{ pointerEvents: open ? 'auto' : 'none' }}
      onClick={onClose}
    >
      <div
        className={`money-modal-content${open && animate ? ' open' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [activeDot, setActiveDot] = useState(0);
  const [showRegistration, setShowRegistration] = useState(false);
  const [nextCount, setNextCount] = useState(0);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [localIsRegistered, setLocalIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'bonus' | 'money'>('home');
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [canWithdraw, setCanWithdraw] = useState(false)
  const [money, setMoney] = useState(0);
  const dotsCount = 3;
  const [minWithdraw, setMinWithdraw] = useState<number>(0)
  const [isOpenBackgroundModal, setIsOpenBackgroundModal] = useState(false);
  const [pendingTab, setPendingTab] = useState<null | 'home' | 'bonus' | 'money'>(null);
  const [toasts, setToasts] = useState<{ id: number, title: string, description: string }[]>([]);
  const showToast = (title: string, description: string) => {
    setToasts(prev => [...prev, { id: Date.now() + Math.random(), title, description }]);
  };
  const handleCloseToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };


  const isLoading = useSelector((state: RootState) => state.app.isLoading);
  const isRegistered = useSelector((state: RootState) => state.app.isRegistered);
  const dispatch = useDispatch<AppDispatch>();
  const balance = useSelector((state: RootState) => state.balance.value);

  useEffect(() => {
    const checkRegistration = async () => {
      setLocalIsLoading(true)
      try {
        const v = await getIsRegistered(BOT_ID, USER_ID)
        setLocalIsRegistered(v.data.isRegistered);
        dispatch(setRegistered(v.data.isRegistered));
      } catch (err) {
        // Можно добавить обработку ошибки, если нужно
      } finally {
        setLocalIsLoading(false)
      }
    }
    checkRegistration();
  }, [])

  const fetchCanWithdraw = async () => {
    try {
      const response = await getCanWithdraw(BOT_ID, USER_ID)
      console.log(response.data)
      setCanWithdraw(response.data.canWithdraw)
      setMinWithdraw(response.data.withdrawalLimit)
    } catch (err) {
      setCanWithdraw(false)
    }
  }

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
      console.log(response.data)
      setLocalIsRegistered(response.data.isRegistered)
      dispatch(setRegistered(response.data.isRegistered));
      setTimeout(() => {
        setLocalIsLoading(false);
        setLocalIsRegistered(true);
        dispatch(setRegistered(true));
      }, 1500);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      setLocalIsRegistered(true);
      dispatch(setRegistered(true));
    }
    finally {
      setLocalIsLoading(false)
    }
  };

  const onWithdraw = async (data: { cardData: string; amount: string }) => {
    try {
      const amount = Number(data.amount)
      const response = await withdraw(BOT_ID, USER_ID, amount, data.cardData)
      showToast('Operation in progress', response.data.message)
      setIsOpenBackgroundModal(false)
      dispatch(setBalance(balance - amount))
    }catch(err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data.error)
        showToast('Withdraw failed', err.response?.data.error)
      }
    }
  }

  const handleTabSelect = async (tab: 'home' | 'bonus' | 'money') => {
    if (tab === 'money') {
      await fetchCanWithdraw()
      if (isOpenBackgroundModal) {
        setIsOpenBackgroundModal(false);
        return;
      }
      try {
        const response = await getRateWithBalance(BOT_ID, USER_ID);
        dispatch(setBalance(response.data.balance));
      } catch (e) {}
      setIsOpenBackgroundModal(true);
      return;
    }
    setIsOpenBackgroundModal(false);
    setActiveTab(tab);
    setShowWithdrawal(false);
  };

  useEffect(() => {
    if (!isOpenBackgroundModal && pendingTab) {
      const timeout = setTimeout(() => {
        if (pendingTab === 'money') {
          setIsOpenBackgroundModal(true);
        } else {
          setActiveTab(pendingTab);
          setShowWithdrawal(false);
        }
        setPendingTab(null);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpenBackgroundModal, pendingTab]);

  if (isLoading) {
    return <HelloLoader />;
  }

  if (isRegistered) {
      return <>
      <div style={{
        position: 'fixed',
        top: 16,
        left: 10,
        right: 10,
        zIndex: 20000,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        {toasts.map(toast => (
          <GiftToast
            key={toast.id}
            open={true}
            onClose={() => handleCloseToast(toast.id)}
            title={toast.title}
            description={toast.description}
          />
        ))}
      </div>
      <BackgroundModal open={isOpenBackgroundModal} onClose={() => setIsOpenBackgroundModal(false)}>
        <div style={{
          position: 'absolute',
          top: 16,
          left: 10,
          right: 10,
          zIndex: 20000,
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
          {toasts.map(toast => (
            <GiftToast
              key={toast.id + '-modal'}
              open={true}
              onClose={() => handleCloseToast(toast.id)}
              title={toast.title}
              description={toast.description}
            />
          ))}
        </div>
        {canWithdraw
              ? <WithdrawalForm onWithdraw={onWithdraw} onClose={() => setIsOpenBackgroundModal(false)} minWithdraw={minWithdraw}/>
              : <SubscriptionBlock money={money} onContinue={() => setIsOpenBackgroundModal(false)} minWithdraw={minWithdraw}/> }
            
      </BackgroundModal>
      {activeTab === 'bonus' && <BonusPage showToast={showToast} />}
      {activeTab !== 'bonus' && <HomePage setMoney={setMoney} onSelect={handleTabSelect} activeTab={activeTab} showToast={showToast} setIsOpenBackgroundModal={setIsOpenBackgroundModal} />}
      <BottomNavBar onSelect={handleTabSelect} activeTab={activeTab} isModalOpen={isOpenBackgroundModal} />
    </>;
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
