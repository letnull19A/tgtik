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
import { BOT_ID, getProfile, getVideos, USER_ID, getRateWithBalance, doAction, addSignupBonus } from '../api/api';
import { GetProfileResponse, Video as VideoType } from '../api/types';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setBalance } from '../store';
import type { RootState, AppDispatch } from '../store';

function HomePage({ onSelect, activeTab, setMoney, showToast }: { onSelect?: (tab: 'home' | 'bonus' | 'money') => void, activeTab?: 'home' | 'bonus' | 'money' , setMoney: (v: number) => void, showToast: (title: string, description: string) => void }) {
  const [showGiftToast, setShowGiftToast] = useState(false);
  const [showGiftWindow, setShowGiftWindow] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [progress, setProgress] = useState(0);
  const [profile, setProfile] = useState<GetProfileResponse | null>(null)
  const [videos, setVideos] = useState<VideoType[]>([]);
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

  const fetchProfile = async () => {
    try {
      const response = await getProfile(BOT_ID, USER_ID)
      const data = response.data
      setProfile(data)
    } catch (error) {
      console.error('Ошибка при получении профиля:', error)
    }
  }

  const fetchRate = async () => {
    try {
      const response = await getRateWithBalance(BOT_ID, USER_ID);
      dispatch(setBalance(response.data.balance));
      setRate(response.data.rate)
      setMaxVideos(response.data.maxVideos)
    } catch (error) {
      console.error('Ошибка при получении видео:', error);
    }
  }

  const fetchVideos = async () => {
    try {
      const response = await getVideos(BOT_ID, USER_ID);
      if (response.data && response.data.length > 0) {
        setVideos(response.data);
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
      setFade(false);
    }, 300);
  };

  const handleLike = async () => {
    if (videos.length === 0) return;
    const video = videos[currentIndex];
    try {
      const response = await doAction({
        botId: BOT_ID,
        userId: USER_ID,
        videoId: video.id,
        action: 'like',
      });
      if (String(response.data?.status) === '403') {
        console.error('Достигнут лимит видео за день!');
        return;
      }
      handleNextVideo();
      setRate(v => v + 1)
      dispatch(setBalance(response.data.newBalance));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        console.error('Достигнут лимит видео за день!');
        return;
      }
      console.error('Ошибка при отправке лайка:', error);
    }
  };

  const handleDislike = async () => {
    if (videos.length === 0) return;
    const video = videos[currentIndex];
    try {
      const response = await doAction({
        botId: BOT_ID,
        userId: USER_ID,
        videoId: video.id,
        action: 'dislike',
      });
      if (String(response.data?.status) === '403') {
        console.error('Достигнут лимит видео за день!');
        return;
      }
      handleNextVideo();
      setRate(v => v + 1)
      dispatch(setBalance(response.data.newBalance));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        console.error('Достигнут лимит видео за день!');
        return;
      }
      console.error('Ошибка при отправке дизлайка:', error);
    }
  };

  const handleGiftClick = async () => {
    // try {
    //   const response = await addSignupBonus(BOT_ID, USER_ID);
    //   setBalance(v => v + response.data.bonus)
    //   setShowGiftWindow(true)
    // } catch (error) {
    //   showToast('You dont have a sponsor subscription', 'Subscribe and try again');
    // }

    setShowGiftWindow(true);
    setIsGiftOpen(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    setTimeout(() => setProfile(null), 300);
  };

  const handleCloseGiftToast = () => {
    setShowGiftToast(false);
  };

  return (
    <>
      {showGiftWindow && (
        <GiftWindow
          open={isGiftOpen}
          onClose={() => {
            setIsGiftOpen(false);
            setTimeout(() => setShowGiftWindow(false), 300);
          }}
          onClaimGift={() => showToast('Gift claimed!', 'You received + $100')}
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
          isVerified={false}
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
      <VideoPromoBar />
      <div className={styles.homePage}>
        <VideoSidebar
          key={currentIndex}
          onLike={handleLike}
          onDislike={handleDislike}
          likes={timerFinished ? (videos[currentIndex]?.likes_count || 0) : 373.8}
          dislikes={timerFinished ? (videos[currentIndex]?.dislikes_count || 0) : 11.79}
          rate={rate}
          isVideoReady={!isVideoLoading}
          currentIndex={currentIndex}
          activeTab={activeTab}
          playing={playing}
          isVideoLoading={isVideoLoading}
        />
        <VideoInfoBlock video={videos[currentIndex]} />
      </div>
      <BottomNavBar onSelect={onSelect} activeTab={activeTab} />
    </>
  );
}

export default HomePage; 