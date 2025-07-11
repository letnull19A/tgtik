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
}

export default function VideoPlayer({ setProgress, videos, currentIndex, setCurrentIndex, fade, setIsVideoLoading, playing, setPlaying }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Video play error:', err);
        }
      });
    }
    setIsVideoLoading(true);
  }, [currentIndex, setIsVideoLoading]);

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
          muted={true}
          onTimeUpdate={() => {
            if (videoRef.current) {
              setProgress(videoRef.current.currentTime / videoRef.current.duration);
            }
          }}
          autoPlay={playing}
          onClick={() => {
            if (videoRef.current) {
              if (playing) {
                videoRef.current.pause();
                setPlaying(false);
              } else {
                videoRef.current.play().catch((err) => {
                  if (err.name !== 'AbortError') {
                    console.error('Video play error:', err);
                  }
                });
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
          onCanPlay={() => setIsVideoLoading(false)}
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