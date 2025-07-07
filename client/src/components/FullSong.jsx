import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart, MoreHorizontal, Volume2, Repeat, Shuffle, Expand } from 'lucide-react';
import { usePlayer } from '../hooks/redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

const FullSong = () => {
    const audioRef = useRef(null);
    const navigate = useNavigate();
    const [currentSong, setCurrentSong] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const { 
        currentTrackId, 
        currentTrackIndex, 
        currentPlaylistId,
        isPlaying, 
        playPause, 
        skipNext, 
        skipPrevious, 
        updateCurrentTime, 
        updateDuration, 
        updateVolume, 
        currentTime: reduxCurrentTime, 
        duration: reduxDuration, 
        volume: reduxVolume 
    } = usePlayer();

    const currentTime = reduxCurrentTime;
    const duration = reduxDuration;
    const volume = reduxVolume;

    useEffect(() => {
        const fetchCurrentSong = async () => {
            if (!currentTrackId) {
                setCurrentSong(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const { data } = await api.get(`/song/${currentTrackId}`);
                setCurrentSong({
                    ...data,
                    id: data._id,
                    audioUrl: data.audioUrl || data.url,
                });
            } catch (error) {
                console.error('Error fetching song:', error);
                if (currentPlaylistId) {
                    try {
                        const { data: artistData } = await api.get(`/artist/${currentPlaylistId}`);
                        const song = artistData.songs.find(s => s._id === currentTrackId);
                        if (song) {
                            setCurrentSong({
                                ...song,
                                id: song._id,
                                audioUrl: song.audioUrl || song.url,
                            });
                        }
                    } catch (artistError) {
                        console.error('Error fetching from artist:', artistError);
                        setCurrentSong(null);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentSong();
    }, [currentTrackId, currentPlaylistId]);

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleSeek = (e) => {
        if (!audioRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = Math.min(Math.max(percent * duration, 0), duration);
        audioRef.current.currentTime = newTime;
        updateCurrentTime(newTime);
    };

    const handleVolume = (e) => {
        if (!audioRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newVolume = Math.min(Math.max(percent, 0), 1);
        audioRef.current.volume = newVolume;
        updateVolume(newVolume);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        const handleLoadedMetadata = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                updateDuration(audio.duration);
            }
        };

        const handleTimeUpdate = () => {
            updateCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            skipNext();
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        audio.volume = volume;

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentSong, skipNext, updateCurrentTime, updateDuration, volume]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.log('Audio play error:', error);
                });
            }
        } else {
            audio.pause();
        }
    }, [isPlaying, currentSong]);

    console.log('FullSong Debug:', {
        currentTrackId,
        currentTrackIndex,
        currentPlaylistId,
        currentSong: currentSong?.title,
        loading
    });

    if (loading) {
        return (
            <div className="w-full h-[1000px] bg-gray-900 flex items-center justify-center">
                <p className="text-white text-lg">Loading song...</p>
            </div>
        );
    }

    if (!currentSong) {
        return (
            <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white text-lg">No song is currently playing</p>
            </div>
        );
    }

    return (
        <div className="w-full  bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 relative overflow-hidden">
            <div 
                className="absolute inset-0 opacity-30 blur-3xl"
                style={{
                    backgroundImage: `url(${currentSong?.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div className="relative z-10 h-full flex flex-col">

                <div className="flex items-center justify-between p-6 text-white">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-lg font-semibold">Now Playing</h1>
                        <p className="text-sm opacity-80">"{currentSong?.title || 'Unknown Album'}"</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button onClick={handleGoBack} className="p-2 hover:bg-white/10 rounded-full">
                            <Expand className='w-6 h-6' />
                        </button>
                        {/* <button className="p-2 hover:bg-white/10 rounded-full">
                            <MoreHorizontal className="w-6 h-6" />
                        </button> */}
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-8">
                    <div className="relative">
                        <img 
                            src={currentSong?.coverImage} 
                            alt={currentSong?.title || 'Song cover'} 
                            className="w-80 h-80 md:w-96 md:h-96 rounded-2xl object-cover shadow-2xl"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop';
                            }}
                        />
                        <button
                            onClick={playPause}
                            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                        >
                            {isPlaying ? <Pause className="w-8 h-8 text-gray-800" /> : <Play className="w-8 h-8 text-gray-800 ml-1" />}
                        </button>
                    </div>
                </div>

                <div className="text-white text-center my-6">
                    <h2 className="text-3xl font-bold mb-2">{currentSong?.title || 'Unknown Title'}</h2>
                    <p className="text-xl opacity-80 mb-4">
                        {/* {currentSong?.artist?.map(a => a.name).join(', ') || 'Unknown Artist'} */}
                    </p>
                </div>

                <div className="px-8 text-white">
                    <div className="flex justify-between text-sm mb-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <div className="h-2 w-full bg-white/20 rounded-full cursor-pointer" onClick={handleSeek}>
                        <div
                            className="h-full bg-white rounded-full transition-all"
                            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                        />
                    </div>
                </div>

                <div className="flex justify-center space-x-8 my-6">
                    <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                        <Shuffle className="w-6 h-6" />
                    </button>
                    <button onClick={skipPrevious} className="p-3 text-white hover:bg-white/10 rounded-full transition-colors">
                        <SkipBack className="w-8 h-8" />
                    </button>
                    <button onClick={playPause} className="p-4 bg-white text-gray-800 rounded-full hover:scale-110 shadow-lg transition-transform">
                        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                    </button>
                    <button onClick={skipNext} className="p-3 text-white hover:bg-white/10 rounded-full transition-colors">
                        <SkipForward className="w-8 h-8" />
                    </button>
                    <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                        <Repeat className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex items-center justify-center space-x-4 mb-8">
                    <Volume2 className="text-white w-5 h-5" />
                    <div className="w-32 h-1 bg-white/20 rounded-full cursor-pointer" onClick={handleVolume}>
                        <div className="h-full bg-white rounded-full transition-all" style={{ width: `${volume * 100}%` }} />
                    </div>
                </div>
            </div>

            <audio 
                ref={audioRef} 
                src={currentSong?.audioUrl || currentSong?.url} 
                preload="metadata"
                crossOrigin="anonymous"
            />
        </div>
    );
};

export default FullSong;