/* eslint-disable no-unused-vars */
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCw, RotateCcw, Minimize2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../hooks/redux';
import { useNavigate } from 'react-router-dom';
import { MdOutlineForward10, MdOutlineReplay10  } from "react-icons/md";
import useAuth from '../hooks/useAuth';
import Modal from './Modal';



const BottomPlayer = () => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const navigate = useNavigate();
  const [localLoading, setLocalLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const { isAuthenticated } = useAuth()


  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    updateCurrentTime,
    isMuted,
    setDuration,
    isLoading,
    playPause,
    skipNext,
    skipPrevious,
    updateVolume,
    toggleMuteVolume,
    audioRef,
  } = usePlayer();

  useEffect(() => {
    if (!audioRef?.current) return;
    const audio = audioRef.current;

    const handleMetadataLoaded = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      updateCurrentTime(audio.currentTime);
    };

    audio.addEventListener('loadedmetadata', handleMetadataLoaded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleMetadataLoaded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentTrack, audioRef, setDuration, updateCurrentTime]);

  const handlePlayPause = () => {
    setLocalLoading(true);
    playPause();
    setTimeout(() => setLocalLoading(false), 400);
  };

  if (!currentTrack || !currentTrack.id) return null;

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    if (!audioRef?.current) return;
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    updateCurrentTime(newTime);
  };

const handleSeekForward = () => {
  if (!audioRef?.current || !duration) return;
  
  const currentTime = audioRef.current.currentTime;
  const newTime = Math.min(currentTime + 10, duration);
  
  // Update the audio element's current time
  audioRef.current.currentTime = newTime;
  
  // Update the Redux state
  updateCurrentTime(newTime);
};

const handleSeekBackward = () => {
  if (!audioRef?.current) return;
  
  const currentTime = audioRef.current.currentTime;
  const newTime = Math.max(currentTime - 10, 0);
  
  // Update the audio element's current time
  audioRef.current.currentTime = newTime;
  
  // Update the Redux state
  updateCurrentTime(newTime);
};

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    updateVolume(newVolume);
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
    {!isMinimized ? (
          <div className="fixed bottom-11 sm:bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] px-4 py-3 flex flex-row md:items-center justify-between z-50">
      <div className="flex md:items-center space-x-3 w-full sm:w-1/3 min-w-0">
        <div className="md:w-14 w-10 md:h-14 h-10 rounded overflow-hidden flex-shrink-0">
          <img src={currentTrack.coverImage} alt={currentTrack.title} className="md:w-full md:h-full w-10 h-10 object-cover" />
        </div>
        <div className="min-w-0">
          <div className="text-white font-medium truncate text-sm">{currentTrack.title}</div>
          <div className="text-gray-400 text-xs truncate">
            {currentTrack.artist?.map((a) => a.name).join(', ')}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:items-center items-end w-full md:w-1/3 max-w-2xl min-w-0">
        <div className="flex items-center space-x-4 mb-2">
          <button onClick={skipPrevious} className="text-gray-400 hover:text-white hidden sm:block transition-colors" disabled={localLoading}>
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={handleSeekBackward}
            className="text-gray-400 hover:text-white transition-colors"
            title="Back 10s"
          >
            <MdOutlineReplay10   className="w-5 h-5" />
          </button>

          <button
            onClick={handlePlayPause}
            className="bg-white hover:bg-gray-200 rounded-full flex items-center justify-center w-8 h-8 transition-all"
            disabled={localLoading}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {localLoading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause className="w-4 h-4 text-black fill-black" />
            ) : (
              <Play className="w-4 h-4 text-black fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={handleSeekForward}
            className="text-gray-400 hover:text-white transition-colors"
            title="Forward 10s"
          >
            <MdOutlineForward10 className="w-5 h-5" />
          </button>

          <button onClick={skipNext} className="text-gray-400 hidden sm:block hover:text-white transition-colors" disabled={localLoading}>
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className=" hidden sm:flex sm:items-center space-x-3 w-full min-w-0">
          <span className="text-xs text-gray-400 w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #fff 0%, #fff ${progressPercentage}%, #4a4a4a ${progressPercentage}%, #4a4a4a 100%)`,
              }}
              aria-label="Seek"
            />
          </div>
          <span className="text-xs text-gray-400 w-10 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 justify-end space-x-3 min-w-0">
        <div className="flex items-center space-x-2 relative">
          <button
            onClick={toggleMuteVolume}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume * 100}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ffffff 0%, #fff ${isMuted ? 0 : volume * 100}%, #696969 ${
                isMuted ? 0 : volume * 100
              }%, #696969 100%)`,
            }}
            aria-label="Volume"
          />
        </div>

        <button
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Minimize2"
          aria-label="Minimize player"
          onClick={() => setIsMinimized(true)}
        >
          <Minimize2 size={20} />
        </button>
      </div>


    </div>
    ) : (
      <DraggableCircle onClick={() => setIsMinimized(false)} />
    )}
    { isAuthenticated && <Modal /> }
    </>
  );
};

export default BottomPlayer;



const DraggableCircle = ({ onClick }) => {
  const circleRef = useRef(null);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 100 });
  const [dragging, setDragging] = useState(false);

  const startPos = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });

  const handleStart = (x, y) => {
    startPos.current = { x, y };
    offset.current = {
      x: x - position.x,
      y: y - position.y,
    };
    setDragging(true);
  };

  const handleMove = (x, y) => {
    if (!dragging) return;
    const newX = x - offset.current.x;
    const newY = y - offset.current.y;

    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 60, newX)),
      y: Math.max(0, Math.min(window.innerHeight - 60, newY)),
    });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const endDrag = () => {
    setDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', endDrag);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', endDrag);
    };
  }, [dragging]);

  return (
    <div
      ref={circleRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDoubleClick={onClick}
      className="fixed z-50 bg-[#1db954] flex items-center justify-center text-white cursor-pointer transition-transform"
      style={{
        left: position.x,
        top: position.y,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        transition: dragging ? 'none' : 'transform 0.2s ease, left 0.2s ease, top 0.2s ease',
      }}
      title="Expand Player"
    >
      <Play size={20} />
    </div>
  );
};