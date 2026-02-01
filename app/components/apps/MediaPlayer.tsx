"use client";

import { useState, useRef, useEffect } from "react";

type MediaPlayerProps = {
  id: string;
};

export function MediaPlayer({ id }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Auto-play on mount with sound
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt to play with sound
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log("Autoplay with sound blocked, trying muted...", err);
        
        // Fallback: Play muted, then unmute
        video.muted = true;
        video.play().then(() => {
          // Unmute after playback starts
          setTimeout(() => {
            video.muted = false;
            setIsMuted(false);
          }, 100);
        }).catch((err2) => {
          console.log("Autoplay completely blocked:", err2);
          setIsPlaying(false);
        });
      });
    }
  }, []);

  // Sync volume with video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Sync muted state with video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#c0c0c0]">
      {/* Menu Bar */}
      <div className="win98-raised flex gap-1 px-1 py-0.5 text-xs border-b border-white">
        <button className="px-2 hover:bg-[#000080] hover:text-white">File</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">View</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Play</button>
        <button className="px-2 hover:bg-[#000080] hover:text-white">Help</button>
      </div>

      {/* Video Display Area */}
      <div className="flex-1 win98-sunken m-2 bg-black flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className="max-w-full max-h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          autoPlay
        >
          <source src="/video/rick_roll.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Control Bar */}
      <div className="win98-raised p-2 space-y-2 border-t border-white">
        {/* Transport Controls */}
        <div className="flex gap-1 justify-center">
          <button
            className="win98-button px-3 py-1 text-xs"
            onClick={handlePlayPause}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            className="win98-button px-3 py-1 text-xs"
            onClick={handleStop}
          >
            ⏹ Stop
          </button>
          <button
            className="win98-button px-3 py-1 text-xs"
            onClick={handleFullscreen}
          >
            ⛶ Fullscreen
          </button>
        </div>

        {/* Seek Bar */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 win98-slider"
          />
          <span className="font-mono w-10">{formatTime(duration)}</span>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={toggleMute}
            className="text-sm w-6"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
          <span className="w-14">Volume:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 win98-slider"
          />
          <span className="font-mono w-8 text-right">{isMuted ? 0 : volume}%</span>
        </div>
      </div>
    </div>
  );
}
