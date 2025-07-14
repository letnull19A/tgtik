import React, { useRef, useEffect } from 'react';
import { Video as VideoType } from '../api/types';
import Loader from './Loader';

interface VideoPlayerProps {
  setProgress: (v: number) => void;
  videos: VideoType[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  fade: boolean;
  setIsVideoLoading: (loading: boolean) => void;
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  muted?: boolean;
  onVideoReady?: () => void;
  initialTime?: number; // новый проп
}

export default function VideoPlayer({ setProgress, videos, currentIndex, setCurrentIndex, fade, setIsVideoLoading, playing, setPlaying, muted = false, onVideoReady, initialTime = 0 }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const initialTimeRef = useRef<number>(initialTime);

  useEffect(() => {
    initialTimeRef.current = initialTime;
  }, [initialTime]);

  useEffect(() => {
    setIsVideoLoading(true);
  }, [currentIndex, setIsVideoLoading]);

  useEffect(() => {
    // Удаляем автоматический вызов play/pause по playing,
    // чтобы не конфликтовать с действиями пользователя и onCanPlay
  }, [playing]);

  // Устанавливаем прогресс только после onCanPlay
  const handleCanPlay = () => {
    setIsVideoLoading(false);
    const video = videoRef.current;
    if (video) {
      let safeTime = Number(initialTimeRef.current);
      if (isNaN(safeTime) || safeTime < 0 || safeTime >= video.duration) safeTime = 0;
      video.currentTime = safeTime;
      if (playing) {
        console.log('[VideoPlayer] play() called by onCanPlay');
        video.play();
      }
    }
    if (onVideoReady) onVideoReady();
  };

  return (
    <div style={{
      transition: 'opacity 0.3s',
      opacity: fade ? 0 : 1,
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: '#000'
    }}>
      {videos[currentIndex]?.url ? (
        <video
          ref={videoRef}
          src={videos[currentIndex].url}
          width="100%"
          height="100%"
          controls={false}
          muted={muted}
          onTimeUpdate={() => {
            if (videoRef.current) {
              setProgress(videoRef.current.currentTime / videoRef.current.duration);
            }
          }}
          autoPlay={playing}
          onClick={() => {
            if (videoRef.current) {
              if (playing) {
                console.log('[VideoPlayer] pause() called by click');
                videoRef.current.pause();
                setPlaying(false);
              } else {
                console.log('[VideoPlayer] play() called by click');
                videoRef.current.play();
                setPlaying(true);
              }
            }
          }}
          onEnded={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play().catch((err) => {
                if (err.name !== 'AbortError') {
                  console.error('Video play error:', err);
                }
              });
            }
          }}
          onLoadStart={() => setIsVideoLoading(true)}
          onWaiting={() => setIsVideoLoading(true)}
          onCanPlay={handleCanPlay}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            background: '#000',
            cursor: 'pointer',
          }}
        />
      ) : null}
      {/* Loader is now handled by parent via isVideoLoading state */}
    </div>
  );
}