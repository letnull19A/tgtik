import { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import VideoProgressBar from './VideoProgressBar';
import VideoTopBar from './VideoTopBar';
import VideoBalanceBar from './VideoBalanceBar';
import VideoPromoBar from './VideoPromoBar';
import VideoSidebar from './VideoSidebar';
import VideoInfoBlock from './VideoInfoBlock';
import BottomNavBar from './BottomNavBar';
import GiftToast from './GiftToast';
import GiftWindow from './GiftWindow';
import Profile from './Profile';
import styles from './HomePage.module.css';
import { getProfileCurrent, getVideosCurrent, getRateWithBalanceCurrent, doActionCurrent, addSignupBonusCurrent, getIsSubscribedCurrent } from '../api/api';
import { GetProfileResponse, Video as VideoType } from '../api/types';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setBalance } from '../store';
import type { RootState, AppDispatch } from '../store';
import { getUserId, getBotId, isTelegramWebApp } from '../utils/telegram';

function HomePage({ onSelect, activeTab, setMoney, showToast, showErrorModal, setIsOpenBackgroundModal }: { onSelect?: (tab: 'home' | 'bonus' | 'money') => void, activeTab?: 'home' | 'bonus' | 'money' , setMoney: (v: number) => void, showToast: (title: string, description: string) => void, showErrorModal?: (msg: string) => void, setIsOpenBackgroundModal: (value: boolean) => void}) {
  const [showGiftToast, setShowGiftToast] = useState(false);
  const [showGiftWindow, setShowGiftWindow] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [progress, setProgress] = useState(0);
  const [profile, setProfile] = useState<GetProfileResponse | null>(null)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [reward, setReward] = useState<{dislikeReward: number, likeReward: number}>({ dislikeReward: 0, likeReward: 0})
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [rate, setRate] = useState(0);
  const [maxVideos, setMaxVideos] = useState(0)
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [timerFinished, setTimerFinished] = useState(false);
  const [playing, setPlaying] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const balance = useSelector((state: RootState) => state.balance.value);

  useEffect(() => {
    setMoney(balance);
  }, [balance, setMoney]);

  useEffect(() => {
    if (!isVideoLoading) {
      setTimerFinished(false);
    }
  }, [isVideoLoading]);

  // Пример: если лимит достигнут, открываем VideoLimitModal
  useEffect(() => {
    if (activeTab === 'home' && videos.length > 0 && currentIndex >= videos.length - 1) {
      setIsOpenBackgroundModal(true);
    }
  }, [activeTab, videos.length, currentIndex, setIsOpenBackgroundModal]);

  const fetchProfile = async () => {
    try {
      const response = await getProfileCurrent()
      const data = response.data
      setProfile(data)
      // Получаем статус подписки
      const subRes = await getIsSubscribedCurrent();
      setIsSubscribed(!!subRes.data.isSubscribed);
    } catch (error) {
      console.error('Ошибка при получении профиля:', error)
    }
  }

  const fetchRate = async () => {
    try {
      const response = await getRateWithBalanceCurrent();
      dispatch(setBalance(response.data.balance));
      setRate(response.data.rate)
      setMaxVideos(response.data.maxVideos)
    } catch (error) {
      console.error('Ошибка при получении видео:', error);
    }
  }

  

  const fetchVideos = async () => {
    try {
      const response = await getVideosCurrent();
      console.log(response.data)
      if (response.data && response.data.length > 0) {
        const firstVideo = response.data[0]
        setVideos(response.data);
        setReward({ likeReward: firstVideo.likeReward, dislikeReward: firstVideo.dislikeReward})
      }
    } catch (error) {
      console.error('Ошибка при получении видео:', error);
    }
  };

  useEffect(() => {
    fetchRate()
    fetchVideos();
  }, []) 

  const handleOpenProfile = async () => {
    await fetchProfile();
    setShowProfile(true);
  }

  const handlePassVerification = () => {
    // Handle verification logic here
    console.log('Pass verification clicked');
  };

  const handleNextVideo = () => {
    if (videos.length === 0) return;
    if (currentIndex >= videos.length - 1) return;
    setProgress(0);
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      const nextVideo = videos[currentIndex + 1]
      setReward({ likeReward: nextVideo.likeReward, dislikeReward: nextVideo.dislikeReward})
      setFade(false);
    }, 300);
  };

  const handleLike = async () => {
    if (videos.length === 0) return;
    const video = videos[currentIndex];
    try {
      const response = await doActionCurrent({
        videoId: video.id,
        action: 'like',
      });
      handleNextVideo();
      setRate(v => v + 1)
      dispatch(setBalance(response.data.newBalance));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setIsOpenBackgroundModal(true)
        return;
      }
      console.error('Ошибка при отправке лайка:', error);
    }
  };

  const handleDislike = async () => {
    if (videos.length === 0) return;
    const video = videos[currentIndex];
    try {
      const response = await doActionCurrent({
        videoId: video.id,
        action: 'dislike',
      });
      handleNextVideo();
      setRate(v => v + 1)
      dispatch(setBalance(response.data.newBalance));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setIsOpenBackgroundModal(true)
        return;
      }
      console.error('Ошибка при отправке дизлайка:', error);
    }
  };

  const handleGiftClick = async () => {
    try {
        const response = await getIsSubscribedCurrent()
        const {isSubscribed, hasBonus} = response.data
        if(!isSubscribed) {
          showToast('You dont have a sponsor subscription', 'Subscribe and try again');
          return
        }
        if (hasBonus) {
          showToast('You already get bonus', 'Thanks');
          return
        }
        setShowGiftWindow(true);
        setIsGiftOpen(true)
    } catch (error) {
       showToast('You dont have a sponsor subscription', 'Subscribe and try again');
     } 
  };

  const onClaimGift = async () => {
    try {
      const response = await addSignupBonusCurrent()
      dispatch(setBalance(balance + response.data.bonus))
      showToast('Gift claimed!', `You received + ${response.data.bonus}$`)
    }catch(err) {
      showToast('Server error', 'Boun not recieved')
    }
  }

  const handleCloseProfile = () => {
    setShowProfile(false);
    setTimeout(() => setProfile(null), 300);
  };

  const handleCloseGiftToast = () => {
    setShowGiftToast(false);
  };

  const openTelegramChannel = () => {
    const channelUrl = 'https://t.me/test_tik_tok1_bot_channel';
    if (window.Telegram?.WebApp && typeof window.Telegram.WebApp.openTelegramLink === 'function') {
      window.Telegram.WebApp.openTelegramLink(channelUrl);
    } else {
      window.open(channelUrl, '_blank');
    }
  };

  return (
    <>
      {/* ВРЕМЕННЫЙ ОТЛАДОЧНЫЙ ВЫВОД ДЛЯ ТЕЛЕГРАМ WEBAPP */}
      {isTelegramWebApp() && (
        <div style={{ position: 'fixed', top: 0, left: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', zIndex: 99999, padding: 8, fontSize: 12 }}>
          <div>userId: {getUserId() || 'нет данных'}</div>
          <div>botId: {getBotId() || 'нет данных'}</div>
        </div>
      )}
      {showGiftWindow && (
        <GiftWindow
          open={isGiftOpen}
          onClose={() => {
            setIsGiftOpen(false);
            setTimeout(() => setShowGiftWindow(false), 300);
          }}
          onClaimGift={onClaimGift}
        />
      )}
      {profile && (
        <Profile 
          username={profile.username}
          registrationDate={profile.registrationDate ? new Date(profile.registrationDate).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
          friendsInvited={profile.invitedFriends}
          likes={profile.likes}
          dislikes={profile.dislikes}
          earnings={profile.earnings?.toString()}
          isVerified={isSubscribed}
          onPassVerification={handlePassVerification}
          onClose={handleCloseProfile}
          open={showProfile}
        />
      )}
      <VideoPlayer setProgress={setProgress} videos={videos} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} fade={fade} 
        setIsVideoLoading={setIsVideoLoading}
        playing={playing}
        setPlaying={setPlaying}
      />
      <VideoProgressBar progress={progress} />
      <VideoTopBar onGiftClick={handleGiftClick} rate={rate} maxVideos={maxVideos} onProfileClick={handleOpenProfile}/>
      <VideoBalanceBar />
      <VideoPromoBar onOpenTelegramChannel={openTelegramChannel} />
      <div className={styles.homePage}>
        <VideoSidebar
          key={currentIndex}
          onLike={handleLike}
          onDislike={handleDislike}
          likes={videos[currentIndex]?.likes}
          dislikes={videos[currentIndex]?.dislikes}
          rate={rate}
          likeReward={reward.likeReward}
          dislikeReward={reward?.dislikeReward}
          isVideoReady={!isVideoLoading}
          currentIndex={currentIndex}
          activeTab={activeTab}
          playing={playing}
          isVideoLoading={isVideoLoading}
          redirectChannelUrl={videos[currentIndex]?.redirectChannelUrl}
        />
        <VideoInfoBlock video={videos[currentIndex]} />
      </div>
      <BottomNavBar onSelect={onSelect} activeTab={activeTab} />
    </>
  );
}

export default HomePage; 