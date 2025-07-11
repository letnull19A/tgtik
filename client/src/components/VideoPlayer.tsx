import React, { useRef, useState, useEffect } from 'react';
import { Video as VideoType } from '../api/types';
import {} from 'react-player'

interface VideoPlayerProps {
  setProgress: (v: number) => void;
  videos: VideoType[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  fade: boolean;
}

export default function VideoPlayer({ setProgress, videos, currentIndex, setCurrentIndex, fade }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);


  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [currentIndex]);

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
      <video
        ref={videoRef}
        src={videos[currentIndex]?.url || ''}
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
              videoRef.current.play();
              setPlaying(true);
            }
          }
        }}
        onEnded={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
          }
        }}
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          display: 'block',
          background: '#000',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}