import { useEffect, useRef } from 'react';
import { usePlayer } from '../hooks/redux';
import api from '../utils/axios';

const GlobalAudioManager = () => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const {
    currentTrack,
    currentTrackId,
    isPlaying,
    volume,
    isMuted,
    skipNext,
    updateCurrentTime,
    updateDuration,
    setPlayerLoading,
    setPlayerError,
    registerAudioRef,
    // registerVideoRef,
  } = usePlayer();




useEffect(() => {
  registerAudioRef(audioRef.current);
}, []);

useEffect(() => {
  registerAudioRef(audioRef.current);
  // registerVideoRef(videoRef.current);
}, []);


const incrementPlaycount = async (songId) => {
  try {
    await api.post(`/songs/increment-play/${songId}`)
  } catch (err) {
    console.error("Error updating play count", err);
    
  }
}

useEffect(() => {
  if (currentTrackId && isPlaying) {
    incrementPlaycount(currentTrackId)
  }
}, [currentTrackId])

  useEffect(() => {
    if (!currentTrack) {
      // console.log('No current track to load');
      return;
    }

    // console.log('Loading new track:', currentTrack);
    
    if (setPlayerLoading) {
      setPlayerLoading(true);
    }

    const audio = audioRef.current;
    const video = videoRef.current;

    if (audio) {
      const audioUrl = currentTrack.audioUrl || 
                      currentTrack.url || 
                      currentTrack.src || 
                      currentTrack.audio ||
                      currentTrack.file;
      
      if (!audioUrl) {
        console.error('No audio URL found for track:', currentTrack);
        // console.log('Available properties:', Object.keys(currentTrack));
        if (setPlayerError) {
          setPlayerError('No audio URL available for this track');
        }
        if (setPlayerLoading) {
          setPlayerLoading(false);
        }
        return;
      }

      // console.log('Setting audio source to:', audioUrl);

      if (audio.src !== audioUrl) {
        audio.src = audioUrl;
        
        const handleLoadError = () => {
          console.error('Failed to load audio source:', audioUrl);
          if (setPlayerError) {
            setPlayerError('Failed to load audio file');
          }
          if (setPlayerLoading) {
            setPlayerLoading(false);
          }
        };

        audio.addEventListener('error', handleLoadError, { once: true });
        audio.load();
      }

      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // console.log('Audio playback started successfully');
              if (setPlayerLoading) setPlayerLoading(false);
              if (setPlayerError) setPlayerError(null);
            })
            .catch((err) => {
              console.error('Audio playback error:', err);
              if (setPlayerError) setPlayerError(err.message);
              if (setPlayerLoading) setPlayerLoading(false);
            });
        }
      } else {
        if (setPlayerLoading) setPlayerLoading(false);
      }
    }

    if (video && (currentTrack.video || currentTrack.videoUrl)) {
      const videoUrl = currentTrack.video || currentTrack.videoUrl;
      
      if (videoUrl && video.src !== videoUrl) {
        // console.log('Setting video source to:', videoUrl);
        video.src = videoUrl;
        video.load();
        
        if (isPlaying) {
          video.play().catch((err) => {
            console.error('Video playback error:', err);
          });
        }
      }
    } else if (video && video.src) {
      video.src = '';
      video.load();
    }
  }, [currentTrack, isPlaying, setPlayerLoading, setPlayerError]);

  useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;

    // console.log('Play/pause state changed:', isPlaying);

    if (audio && currentTrack) {
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.error('Audio resume error:', err);
            if (setPlayerError) setPlayerError(err.message);
          });
        }
      } else {
        audio.pause();
      }
    }

    if (video && (currentTrack?.video || currentTrack?.videoUrl)) {
      if (isPlaying) {
        video.play().catch((err) => {
          console.error('Video resume error:', err);
        });
      } else {
        video.pause();
      }
    }
  }, [isPlaying, currentTrack, setPlayerError]);

  useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;

    const effectiveVolume = isMuted ? 0 : volume ?? 1;


    if (audio) {
      audio.volume = effectiveVolume;
    }
    if (video) {
      video.volume = effectiveVolume;
    }
  }, [volume, isMuted]);


  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play();
      else audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (updateCurrentTime) {
        updateCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (updateDuration) {
        updateDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (skipNext) {
        skipNext();
      }
    };

    const handleError = (e) => {
      console.error('Audio error:', e, audio.error);
      let errorMessage = 'Failed to load audio';
      
      if (audio.error) {
        switch (audio.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'Audio loading was aborted';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error while loading audio';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'Audio decoding error';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Audio format not supported or file not found';
            break;
          default:
            errorMessage = audio.error.message || 'Unknown audio error';
        }
      }
      
      if (setPlayerError) {
        setPlayerError(errorMessage);
      }
      if (setPlayerLoading) {
        setPlayerLoading(false);
      }
    };

    const handleCanPlay = () => {
      // console.log('Audio can play');
      if (setPlayerLoading) {
        setPlayerLoading(false);
      }
    };

    const handleWaiting = () => {
      // console.log('Audio waiting for data');
      if (setPlayerLoading) {
        setPlayerLoading(true);
      }
    };

    const handleCanPlayThrough = () => {
      // console.log('Audio can play through');
      if (setPlayerLoading) {
        setPlayerLoading(false);
      }
    };

    const handleLoadStart = () => {
      // console.log('Audio load started');
      if (setPlayerLoading) {
        setPlayerLoading(true);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [skipNext, updateCurrentTime, updateDuration, setPlayerError, setPlayerLoading]);

  return (
    <>
      <audio
        ref={audioRef}
        preload="auto"
        style={{ display: 'none' }}
        crossOrigin="anonymous"
      />
      <video
        ref={videoRef}
        preload="metadata"
        style={{ display: 'none' }}
        muted={isMuted}
        crossOrigin="anonymous"
      />
    </>
  );
};

export default GlobalAudioManager;