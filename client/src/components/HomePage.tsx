import { useEffect, useState, useRef } from 'react';
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
import { getProfileCurrent, getVideosCurrent, getRateWithBalanceCurrent, doActionCurrent, addSignupBonusCurrent, getIsSubscribedCurrent, getChannelInviteLink } from '../api/api';
import { GetProfileResponse, Video as VideoType } from '../api/types';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setBalance } from '../store';
import type { RootState, AppDispatch } from '../store';
import { getUserId, getBotId, isTelegramWebApp } from '../utils/telegram';

function HomePage({ onSelect, activeTab, setMoney, showToast, showErrorModal, setIsOpenBackgroundModal, translations, timerDelay, onVideoLimitReached }: { onSelect?: (tab: 'home' | 'bonus' | 'money') => void, activeTab?: 'home' | 'bonus' | 'money' , setMoney: (v: number) => void, showToast: (title: string, description: string) => void, showErrorModal?: (msg: string) => void, setIsOpenBackgroundModal: (value: boolean) => void, translations: any, timerDelay?: number, onVideoLimitReached?: (rate: number, maxVideos: number) => void }) {
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
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [playing, setPlaying] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const balance = useSelector((state: RootState) => state.balance.value);
  const channelUrl = useSelector((state: RootState) => state.channel.inviteLink);
  const botLink = useSelector((state: RootState) => state.channel.botLink);
  const botId = getBotId();
  const [hasBonus, setHasBonus] = useState<boolean>(false);
  const [videoTimes, setVideoTimes] = useState<{ [index: number]: number }>({});
  const lastTab = useRef<'home' | 'bonus' | 'money' | undefined>(activeTab);

  useEffect(() => {
    if (lastTab.current === 'home' && activeTab !== 'home') {
      setVideoTimes((prev) => ({ ...prev, [currentIndex]: progress }));
    }
    lastTab.current = activeTab;
    // eslint-disable-next-line
  }, [activeTab]);

  useEffect(() => {
    if (videoTimes[currentIndex] === undefined) {
      setProgress(0);
    }
    // eslint-disable-next-line
  }, [currentIndex]);

  useEffect(() => {
    setMoney(balance);
  }, [balance, setMoney]);

  useEffect(() => {
    if (!isVideoLoading) {
      setTimerFinished(false);
    }
  }, [isVideoLoading]);

  useEffect(() => {
    const fetchHasBonus = async () => {
      try {
        const res = await getIsSubscribedCurrent();
        setHasBonus(!!res.data.hasBonus);
      } catch (e) {
        setHasBonus(false);
      }
    };
    fetchHasBonus();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfileCurrent()
      const data = response.data
      setProfile(data)
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
    console.log('Pass verification clicked');
  };

  const handleNextVideo = () => {
    if (videos.length === 0) return;
    setProgress(0);
    setFade(true);
    setIsVideoReady(false);
    setPlaying(true);
    setTimeout(() => {
      const nextIndex = currentIndex >= videos.length - 1 ? 0 : currentIndex + 1;

      setCurrentIndex(nextIndex);
      const nextVideo = videos[nextIndex];
      setReward({ likeReward: nextVideo.likeReward, dislikeReward: nextVideo.dislikeReward})
      setFade(false);
    }, 300);
  };

  // Функция для обновления списка видео при зацикливании
  const refreshVideosForLoop = async () => {
    try {
      const response = await getVideosCurrent();
      if (response.data && response.data.length > 0) {
        setVideos([]);
        setTimeout(() => {
          setVideos(response.data);
          setCurrentIndex(0);
          const firstVideo = response.data[0];
          setReward({ likeReward: firstVideo.likeReward, dislikeReward: firstVideo.dislikeReward });
          setProgress(0);
        }, 0);
      } else {
        if (videos.length > 0) {
          setCurrentIndex(0);
          const firstVideo = videos[0];
          setReward({ likeReward: firstVideo.likeReward, dislikeReward: firstVideo.dislikeReward });
          setProgress(0);
        }
      }
    } catch (error) {
      if (videos.length > 0) {
        setCurrentIndex(0);
        const firstVideo = videos[0];
        setReward({ likeReward: firstVideo.likeReward, dislikeReward: firstVideo.dislikeReward });
        setProgress(0);
      }
    }
  };

  const handleLike = async () => {
    if (videos.length === 0) return;
    const video = videos[currentIndex];

    try {
      const response = await doActionCurrent({
        videoId: video.id,
        action: 'like',
      });
      
      if (currentIndex >= videos.length - 1) {
        await refreshVideosForLoop();
        handleNextVideo();
      } else {
        handleNextVideo();
      }
      
      setRate(v => v + 1)
      dispatch(setBalance(response.data.newBalance));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        onVideoLimitReached?.(rate + 1, maxVideos);
        return;
      }
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        if (currentIndex >= videos.length - 1) {
          await refreshVideosForLoop();
        }
        handleNextVideo();
        return;
      }
      if (currentIndex >= videos.length - 1) {
        await refreshVideosForLoop();
      }
      handleNextVideo();
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
      
      if (currentIndex >= videos.length - 1) {
        await refreshVideosForLoop();
        handleNextVideo();
      } else {
        handleNextVideo();
      }
      
      setRate(v => v + 1)
      dispatch(setBalance(response.data.newBalance));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        onVideoLimitReached?.(rate + 1, maxVideos);
        return;
      }
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        if (currentIndex >= videos.length - 1) {
          await refreshVideosForLoop();
        }
        handleNextVideo();
        return;
      }
      if (currentIndex >= videos.length - 1) {
        await refreshVideosForLoop();
      }
      handleNextVideo();
    }
  };

  const handleGiftClick = async () => {
    try {
        const response = await getIsSubscribedCurrent()
        const {isSubscribed, hasBonus} = response.data
        if(!isSubscribed) {
          showToast(translations.giftToast.noSubscriptionTitle, translations.giftToast.noSubscriptionDescription);
          return
        }
        if (hasBonus) {
          showToast(translations.giftToast.alreadyBonusTitle, translations.giftToast.alreadyBonusDescription);
          return
        }
        setShowGiftWindow(true);
        setIsGiftOpen(true)
    } catch (error) {
       showToast(translations.giftToast.noSubscriptionTitle, translations.giftToast.noSubscriptionDescription);
     }
  };

  const onClaimGift = async () => {
    try {
      const response = await addSignupBonusCurrent()
      dispatch(setBalance(balance + response.data.bonus))
      setHasBonus(true);
      showToast(translations.giftToast.giftClaimedTitle, translations.giftToast.giftClaimedDescription.replace('{amount}', response.data.bonus.toString()).replace('{currency}', translations.currency));
    }catch(err) {
      showToast(translations.giftToast.serverErrorTitle, translations.giftToast.serverErrorDescription);
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
    if (!channelUrl) {
      return;
    }
    
    let formattedUrl = channelUrl;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    if (window.Telegram?.WebApp && typeof window.Telegram.WebApp.openTelegramLink === 'function') {
      window.Telegram.WebApp.openTelegramLink(formattedUrl);
    } else {
      window.open(formattedUrl, '_blank');
    }
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
          onClaimGift={onClaimGift}
          translations={translations}
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
          translations={translations}
        />
      )}
      <VideoPlayer 
        setProgress={(v) => {
          setProgress(v);
          setVideoTimes((prev) => ({ ...prev, [currentIndex]: v }));
        }}
        videos={videos} 
        currentIndex={currentIndex} 
        setCurrentIndex={setCurrentIndex} 
        fade={fade} 
        setIsVideoLoading={setIsVideoLoading}
        playing={playing}
        setPlaying={setPlaying}
        muted={rate >= maxVideos}
        onVideoReady={() => {
          setIsVideoReady(true);
          if (!playing) setPlaying(true);
        }}
        initialTime={videoTimes[currentIndex] || 0}
      />
      <VideoProgressBar progress={progress} />
      <VideoTopBar onGiftClick={handleGiftClick} rate={rate} maxVideos={maxVideos} onProfileClick={handleOpenProfile} translations={translations} hideGiftIcon={hasBonus}/>
      <VideoBalanceBar translations={translations} />
      <VideoPromoBar onOpenTelegramChannel={openTelegramChannel} translations={translations} />
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
          isVideoReady={isVideoReady}
          currentIndex={currentIndex}
          activeTab={activeTab}
          playing={playing}
          isVideoLoading={isVideoLoading}
          redirectChannelUrl={videos[currentIndex]?.redirectChannelUrl}
          translations={translations}
          timerDelay={timerDelay || 3000}
          logPrefix={'[VideoSidebar]'}
        />
        <VideoInfoBlock video={videos[currentIndex]} />
      </div>
      <BottomNavBar onSelect={onSelect} activeTab={activeTab} translations={translations} />
    </>
  );
}

export default HomePage; 