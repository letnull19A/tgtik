import React, {ReactElement, ReactHTMLElement, useEffect, useRef, useState} from 'react';
import Profile1Image from '../assets/Profile1Image.jpg';
import { ReactComponent as PlusVideoImage } from '../assets/PlusVideoImage.svg';
import { ReactComponent as LikeIcon } from '../assets/LikeIcon.svg';
import { ReactComponent as DislikeIcon } from '../assets/DislikeIcon.svg';
import { ReactComponent as ShareIcon } from '../assets/ShareIcon.svg';
import styles from './VideoSidebar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { startTimer, pauseTimer, resumeTimer, resetTimer, finishTimer, TimerStatus } from '../store';
import { getReferralUrl, BOT_ID, USER_ID } from '../api/api';

interface VideoSidebarProps {
  onProfileClick?: () => void;
  onLike: () => void;
  onDislike: () => void;
  likes: number;
  dislikes: number;
  rate: number;
  isVideoReady: boolean;
  currentIndex: number;
  activeTab?: 'home' | 'bonus' | 'money';
  playing: boolean;
  isVideoLoading: boolean;
  likeReward: number
  dislikeReward: number
  redirectChannelUrl: string
}

function VideoSidebar({ onProfileClick, onLike, onDislike, likes, dislikes, currentIndex, isVideoReady, activeTab, playing, isVideoLoading, likeReward, dislikeReward, redirectChannelUrl }: VideoSidebarProps) {
    const timerFillLike = useRef<HTMLDivElement>(null);
    const timerFillDislike = useRef<HTMLDivElement>(null);
    const [timeStart, setTimeStart] = useState(0);
    const [showRewardLike, setShowRewardLike] = useState(false);
    const [showRewardDislike, setShowRewardDislike] = useState(false);
    const [rewardLikeFlyOut, setRewardLikeFlyOut] = useState(false);
    const [rewardDislikeFlyOut, setRewardDislikeFlyOut] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [progress, setProgress] = useState(0);
    const dispatch = useDispatch<AppDispatch>();
    const timerStatus = useSelector((state: RootState) => state.timer.status);
    const timerState = useSelector((state: RootState) => state.timer);
    const [isTelegram, setIsTelegram] = useState(false);
    const [shareMessage, setShareMessage] = useState('');

    const totalDuration = 3;

    // Сбросить все reward-состояния и таймер при смене видео
    useEffect(() => {
        setShowRewardLike(false);
        setShowRewardDislike(false);
        setRewardLikeFlyOut(false);
        setRewardDislikeFlyOut(false);
        setTimeStart(0);
        dispatch(resetTimer());
    }, [currentIndex, dispatch]);

    // Останавливать таймер при размонтировании (например, при смене страницы)
    useEffect(() => {
        return () => {
            dispatch(resetTimer());
        };
    }, [dispatch]);

    // Управление статусом таймера по бизнес-логике
    useEffect(() => {
        if (timerStatus === 'finished') return;
        if (activeTab !== 'home' || !playing || isVideoLoading || !isVideoReady || isBlocked) {
            if (timerStatus === 'running') dispatch(pauseTimer());
        } else {
            if (timerStatus === 'not_started' || timerStatus === 'paused') dispatch(startTimer());
        }
    }, [activeTab, playing, isVideoLoading, timerStatus, isVideoReady, isBlocked, dispatch]);

    // Глобальный таймер: завершение через 3 секунды после старта
    useEffect(() => {
        if (timerState.status !== 'running' || !timerState.startedAt) return;
        const elapsed = timerState.elapsedBeforePause + (Date.now() - timerState.startedAt);
        const remaining = Math.max(3000 - elapsed, 0);
        if (remaining === 0) {
            dispatch(finishTimer());
            return;
        }
        const timeout = setTimeout(() => {
            dispatch(finishTimer());
        }, remaining);
        return () => clearTimeout(timeout);
    }, [timerState.status, timerState.startedAt, timerState.elapsedBeforePause, dispatch]);

    // Визуальный прогресс таймера
    useEffect(() => {
        let raf: number | undefined;
        if (timerState.status === 'running' && timerState.startedAt) {
            const update = () => {
                const elapsed = timerState.elapsedBeforePause + (Date.now() - timerState.startedAt!);
                const prog = Math.min(elapsed / 3000, 1);
                setProgress(prog);
                if (prog < 1 && timerState.status === 'running') {
                    raf = requestAnimationFrame(update);
                }
            };
            update();
        } else if (timerState.status === 'finished') {
            setProgress(1);
        } else {
            setProgress(timerState.elapsedBeforePause / 3000);
        }
        return () => { if (raf !== undefined) cancelAnimationFrame(raf); };
    }, [timerState.status, timerState.startedAt, timerState.elapsedBeforePause]);

    useEffect(() => {
      if (window.Telegram?.WebApp) {
        setIsTelegram(true);
      }
    }, []);

    const handleShare = async () => {
      try {
        const res = await getReferralUrl(BOT_ID, USER_ID);
        const shareUrl = res.data?.referralLink || window.location.href;
        const shareText = 'Посмотрите это крутое приложение!';
        if (isTelegram && window.Telegram?.WebApp && typeof window.Telegram.WebApp.openTelegramLink === 'function') {
          const tgLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
          window.Telegram.WebApp.openTelegramLink(tgLink);
          setShareMessage('Меню шаринга открыто!');
        } else {
          await navigator.clipboard.writeText(shareUrl);
          setShareMessage('Ссылка скопирована в буфер обмена!');
        }
        setTimeout(() => setShareMessage(''), 2000);
      } catch (error) {
        setShareMessage('Ошибка при копировании или отправке ссылки.');
        setTimeout(() => setShareMessage(''), 2000);
      }
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
    <div className={styles.videoSidebar}>
      <div className={styles.sidebarProfileWrapper}>
        <img 
          src={Profile1Image} 
          alt="profile" 
          className={styles.sidebarProfileImg} 
          onClick={openTelegramChannel}
          style={{ cursor: 'pointer' }}
        />
        <div className={styles.sidebarPlusVideo}>
          <div className={styles.sidebarPlusVideoDot}>
            <PlusVideoImage className={styles.sidebarPlusIcon} />
          </div>
        </div>
      </div>
      <div
        className={styles.sidebarIconBlock}
        onClick={timerStatus === 'finished' && !isBlocked ? () => {
          setIsBlocked(true);
          setRewardLikeFlyOut(true);
          setTimeout(() => {
            setShowRewardLike(false);
            setRewardLikeFlyOut(false);
            onLike();
            setShowRewardLike(false);
            setShowRewardDislike(false);
            setRewardLikeFlyOut(false);
            setRewardDislikeFlyOut(false);
            dispatch(resetTimer());
          }, 500);
        } : undefined}
        style={{ cursor: timerStatus === 'finished' && !isBlocked ? 'pointer' : 'not-allowed', position: 'relative' }}
      >
        {timerStatus === 'running' || timerStatus === 'paused' ? (
          <div ref={timerFillLike} className={styles.sidebarIconBlockFill} style={{ background: `conic-gradient(from 90deg, rgba(255,255,255,0.37) ${360 * (1 - progress)}deg, transparent ${360 * (1 - progress)}deg)` }}></div>
        ) : null}
        <LikeIcon className={styles.sidebarIcon + (timerStatus === 'finished' ? ' ' + styles.sidebarIconGlow : '')} />
        {(timerStatus === 'finished' && !isBlocked) ? (
          <div className={styles.sidebarIconLabelHolder}>
            <div className={styles.animatedDollar}>{likeReward}$</div>
          </div>
        ) : (
          <div className={styles.sidebarIconLabelHolder}>
            <div className={styles.sidebarIconLabel}>{typeof likes === 'number' ? likes + 'k' : '--'}</div>
          </div>
        )}
      </div>
      <div
        className={styles.sidebarIconBlock}
        onClick={timerStatus === 'finished' && !isBlocked ? () => {
          setIsBlocked(true);
          setRewardDislikeFlyOut(true);
          setTimeout(() => {
            setShowRewardDislike(false);
            setRewardDislikeFlyOut(false);
            onDislike();
            setShowRewardLike(false);
            setShowRewardDislike(false);
            setRewardLikeFlyOut(false);
            setRewardDislikeFlyOut(false);
            dispatch(resetTimer());
          }, 500);
        } : undefined}
        style={{ cursor: timerStatus === 'finished' && !isBlocked ? 'pointer' : 'not-allowed', position: 'relative' }}
      >
        {timerStatus === 'running' || timerStatus === 'paused' ? (
          <div ref={timerFillDislike} className={styles.sidebarIconBlockFill} style={{ background: `conic-gradient(from 90deg, rgba(255,255,255,0.37) ${360 * (1 - progress)}deg, transparent ${360 * (1 - progress)}deg)` }}></div>
        ) : null}
        <DislikeIcon className={styles.sidebarIcon + (timerStatus === 'finished' ? ' ' + styles.sidebarIconGlow : '')} />
        {timerStatus === 'finished' && !isBlocked ? (
          <div className={styles.sidebarIconLabelHolder}>
            <div className={styles.animatedDollar}>{dislikeReward}$</div>
          </div>
        ) : (
          <div className={styles.sidebarIconLabelHolder}>
            <div className={styles.sidebarIconLabel}>{typeof dislikes === 'number' ? dislikes + 'k' : '--'}</div>
          </div>
        )}
      </div>
      <div className={styles.sidebarShareBlock} onClick={handleShare} style={{ cursor: 'pointer' }}>
        <ShareIcon className={styles.sidebarShareIcon} />
        <div className={styles.sidebarIconLabel}>Share</div>
      </div>
    </div>
  );
}

export default VideoSidebar; 