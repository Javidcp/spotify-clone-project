/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, Plus, Download, Menu, Heart, LayoutList, List, Clock, MoreHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setCurrentPlaylist,
    setSongsForPlaylist,
    playTrackFromPlaylist,
    togglePlay,
    setShowVideoComponent,
    selectCurrentTrackId,
    selectCurrentTrackIndex,
    selectCurrentTrack,
    selectIsPlaying,
    selectCurrentPlaylistId
} from '../redux/playerSlice';
import BottomPlayer from './Player';
import api from '../utils/axios';
import Dot from "./Dot";
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const LIKED_SONGS_PLAYLIST_ID = 'likedsong';

const SongRowList = React.memo(({ song, index, currentTrackId, isPlaying, onPlay, setDropdownOpen, dropdownOpen, isCurrentPlaylist }) => {
    const isCurrentSong = currentTrackId === song.id;
    
    const handlePlayClick = useCallback((e) => {
        e.stopPropagation();
        onPlay(song, index);
    }, [onPlay, song, index]);

    const handleDropdownClick = useCallback((e) => {
        e.stopPropagation();
        setDropdownOpen(dropdownOpen === song.id ? null : song.id);
    }, [setDropdownOpen, dropdownOpen, song.id]);

    const handleDropdownItemClick = useCallback((item) => {
        console.log('Clicked:', item.label);
        setDropdownOpen(null);
    }, [setDropdownOpen]);

    return (
        <div
            className={`grid grid-cols-12 gap-4 py-2  mb-10 sm:mb-0 px-2 rounded-md hover:bg-[#1d1d1d] transition-colors group cursor-pointer ${
                isCurrentSong ? 'bg-[#1d1d1d]' : ''
            }`}
            onClick={() => onPlay(song, index)}
        >
            <div className="col-span-1 flex items-center">
                {isCurrentSong && isPlaying && isCurrentPlaylist ? (
                    <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-green-400 animate-pulse"></div>
                        <div className="w-1 h-4 bg-green-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-4 bg-green-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                ) : (
                    <>
                        <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                        <Play className="w-4 h-4 text-white hidden group-hover:block cursor-pointer" onClick={handlePlayClick} />
                    </>
                )}
            </div>

            <div className="col-span-5 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                    <img 
                        src={song.coverImage || song.image} 
                        alt={song.title} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
                <div className="min-w-0">
                    <div className={`font-medium truncate ${isCurrentSong ? 'text-green-400' : 'text-white'}`}>
                        {song.title}
                    </div>
                    <div className="text-sm text-gray-400 truncate">
                        {song.artists || song.artist?.map(a => a.name).join(", ") || 'Unknown'}
                    </div>
                </div>
            </div>

            <div className="col-span-4 hidden sm:flex items-center">
                <span className="text-gray-400 text-sm truncate hover:underline cursor-pointer">
                    {song.genre?.name || "Unknown"}
                </span>
            </div>

            <div className="col-span-1 md:flex items-center hidden">
                <span className="text-gray-400 text-sm">{song.createdAt?.slice(0, 10) || 'N/A'}</span>
            </div>

            <div className="col-span-1 flex items-center gap-2 justify-end">
                <span className="text-gray-400 text-sm">{song.duration || '0:00'}</span>
                <button 
                    onClick={handleDropdownClick}
                    className="w-6 h-6 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <MoreHorizontal className="w-full h-full" />
                </button>
                {dropdownOpen === song.id && (
                    <div className="relative z-50">
                        <Dot
                            isOpen={true}
                            setIsOpen={() => setDropdownOpen(null)}
                            position="right"
                            onItemClick={handleDropdownItemClick}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

const SongRowCompact = React.memo(({ song, index, currentTrackId, isPlaying, onPlay, isCurrentPlaylist, setDropdownOpen, dropdownOpen }) => {
    const isCurrentSong = currentTrackId === song.id;
    
    const handlePlayClick = useCallback((e) => {
        e.stopPropagation();
        onPlay(song, index);
    }, [onPlay, song, index]);

    const handleDropdownClick = useCallback((e) => {
        e.stopPropagation();
        setDropdownOpen(dropdownOpen === song.id ? null : song.id);
    }, [setDropdownOpen, dropdownOpen, song.id]);

    const handleDropdownItemClick = useCallback((item) => {
        setDropdownOpen(null);
    }, [setDropdownOpen]);

    return (
        <div
            className={`grid grid-cols-12 gap-4 py-2  mb-10 sm:mb-0 rounded-md hover:bg-[#1d1d1d] transition-colors group cursor-pointer ${
                isCurrentSong ? 'bg-[#1d1d1d]' : ''
            }`}
            onClick={() => onPlay(song, index)}
        >
            <div className="col-span-1 flex items-center px-8">
                {isCurrentSong && isPlaying && isCurrentPlaylist ? (
                    <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-green-400 animate-pulse"></div>
                        <div className="w-1 h-4 bg-green-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-4 bg-green-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                ) : (
                    <>
                        <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                        <Play className="w-4 h-4 text-white hidden group-hover:block cursor-pointer" onClick={handlePlayClick} />
                    </>
                )}
            </div>

            <div className="col-span-3 flex items-center">
                <div className={`font-medium truncate text-sm ${isCurrentSong ? 'text-green-400' : 'text-white'}`}>
                    {song.title}
                </div>
            </div>

            <div className="col-span-3 flex items-center">
                <span className="text-gray-400 text-sm truncate">
                    {song.artists || song.artist?.map(a => a.name).join(", ") || 'Unknown'}
                </span>
            </div>

            <div className="col-span-2 flex items-center">
                <span className="text-gray-400 text-sm">{song.album || song.genre?.name || "Unknown"}</span>
            </div>

            <div className="col-span-2 flex items-center">
                <span className="text-gray-400 text-sm">{song.dateAdded || song.createdAt?.slice(0, 10) || 'N/A'}</span>
            </div>

            <div className="col-span-1 flex items-center gap-2 justify-end">
                <span className="text-gray-400 text-sm">{song.duration || '0:00'}</span>
                <button 
                    onClick={handleDropdownClick}
                    className="w-6 h-6 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <MoreHorizontal className="w-full h-full" />
                </button>
                {dropdownOpen === song.id && (
                    <div className="relative z-50">
                        <Dot
                            isOpen={true}
                            setIsOpen={() => setDropdownOpen(null)}
                            position="right"
                            onItemClick={handleDropdownItemClick}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

SongRowList.displayName = 'SongRowList';
SongRowCompact.displayName = 'SongRowCompact';

const LikedSong = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [viewMode, setViewMode] = useState('List');
    const [isScrolled, setIsScrolled] = useState(false);
    const [musics, setMusic] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [visibleSongsCount, setVisibleSongsCount] = useState(5);
    const { user } = useAuth()

    const isPremiumUser = user?.isPremium
    
    const scrollRef = useRef(null);
    const dispatch = useDispatch();

    const currentTrackId = useSelector(selectCurrentTrackId);
    const currentTrackIndex = useSelector(selectCurrentTrackIndex);
    const currentTrack = useSelector(selectCurrentTrack);
    const isPlaying = useSelector(selectIsPlaying);
    const currentPlaylistId = useSelector(selectCurrentPlaylistId);

    const isCurrentPlaylist = useMemo(() => currentPlaylistId === LIKED_SONGS_PLAYLIST_ID, [currentPlaylistId]);

    const handleShowMore = useCallback(() => {
        setVisibleSongsCount(prev => prev + 5);
    }, []);

    const visibleSongs = useMemo(() => {
        return musics.slice(0, visibleSongsCount);
    }, [musics, visibleSongsCount]);

    const hasMoreSongs = useMemo(() => {
        return musics.length > visibleSongsCount;
    }, [musics.length, visibleSongsCount]);

    const handleScroll = useCallback(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            const shouldBeScrolled = scrollContainer.scrollTop > 100;
            if (shouldBeScrolled !== isScrolled) {
                setIsScrolled(shouldBeScrolled);
            }
        }
    }, [isScrolled]);

    useEffect(() => {
        let isMounted = true;
        const token = localStorage.getItem("accessToken");
        
        const fetchLikedSongs = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/likedsongs`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (isMounted) {
                    const processedSongs = data.map(song => {
                        const songId = song._id || song.id;
                        
                        const audioUrl = song.url
                        
                        console.log('Processing song:', {
                            title: song.title,
                            originalId: song._id || song.id,
                            mappedId: songId,
                            audioUrl: audioUrl,
                            hasAudio: !!audioUrl
                        });
                        
                        return {
                            ...song,
                            id: songId,
                            audioUrl: audioUrl,
                            video: song.video || song.videoUrl || null
                        };
                    });
                    
                    const songsWithAudio = processedSongs.filter(song => {
                        if (!song.audioUrl) {
                            console.warn('Song without audio URL:', song.title);
                            return false;
                        }
                        return true;
                    });
                    
                    console.log('Processed liked songs:', songsWithAudio);
                    setMusic(songsWithAudio);
                    
                    dispatch(setSongsForPlaylist({ 
                        playlistId: LIKED_SONGS_PLAYLIST_ID, 
                        songs: songsWithAudio 
                    }));
                }
            } catch (error) {
                console.error("Error fetching liked songs:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchLikedSongs();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    useEffect(() => {
        const scrollContainer = scrollRef.current;

        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll]);

    const handlePlay = useCallback((song = null, index = null) => {
        console.log('=== handlePlay called ===');
        console.log('Song:', song);
        console.log('Index:', index);
        console.log('Current track ID:', currentTrackId);
        console.log('Is current playlist:', isCurrentPlaylist);
        console.log('Song audio URL:', song?.audioUrl);
        
        if (!song) {
            if (musics.length > 0) {
                song = musics[0];
                index = 0;
            } else {
                console.warn('No songs available to play');
                return;
            }
        }
        
        if (song && song.id === currentTrackId && isCurrentPlaylist) {
            console.log('Toggling play/pause for same song');
            dispatch(togglePlay());
            return;
        }

        if (!song.audioUrl) {
            console.error('Cannot play song without audio URL:', song);
            return;
        }

        console.log('Playing new song:', {
            title: song.title,
            id: song.id,
            audioUrl: song.audioUrl,
            index: index
        });

        dispatch(setCurrentPlaylist(LIKED_SONGS_PLAYLIST_ID));
        
        dispatch(
            playTrackFromPlaylist({
                playlistId: LIKED_SONGS_PLAYLIST_ID,
                trackId: song.id,
                trackIndex: index !== null ? index : 0,
            })
        );
        
        
    }, [currentTrackId, isCurrentPlaylist, dispatch, musics]);

    const handleViewChange = useCallback((mode) => {
        setViewMode(mode);
        setShowDropdown(false);
    }, []);

    const toggleDropdown = useCallback(() => {
        setShowDropdown(prev => !prev);
    }, []);

    const handleMainPlayButton = useCallback(() => {
        console.log('=== Main play button clicked ===');
        console.log('Musics length:', musics.length);
        console.log('Is current playlist:', isCurrentPlaylist);
        console.log('Current track:', currentTrack);
        console.log('Is playing:', isPlaying);
        
        if (musics.length > 0) {
            if (!isCurrentPlaylist || !currentTrack) {
                console.log('Playing first song from liked songs');
                handlePlay(musics[0], 0);
            } else {
                console.log('Toggling play/pause for current playlist');
                dispatch(togglePlay());
            }
        } else {
            console.warn('No songs available to play');
        }
    }, [currentTrack, isCurrentPlaylist, musics, handlePlay, dispatch, isPlaying]);

    const [isDownloading, setIsDownloading] = useState(false);

    const downloadAllSongs = async () => {
        if (!isPremiumUser) {
            toast.error('Premium subscription required for downloads');
            return;
        }

        if (isDownloading) {
            return;
        }

        setIsDownloading(true);

        try {
            const songsToDownload = visibleSongs.filter(song => song.url || song.audioUrl);

            if (songsToDownload.length === 0) {
                toast.info('No songs available for download');
                setIsDownloading(false);
                return;
            }

            const confirmed = window.confirm(`Download ${songsToDownload.length} songs?`);
            if (!confirmed) {
                setIsDownloading(false);
                return;
            }

            for (let i = 0; i < songsToDownload.length; i++) {
                const song = songsToDownload[i];

                try {
                    const response = await fetch(song.url || song.audioUrl);
                    if (!response.ok) throw new Error('Network response was not ok');

                    const blob = await response.blob();

                    const blobUrl = window.URL.createObjectURL(blob);

                    const cleanTitle = (song.title || 'song').replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_');
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `${cleanTitle}.mp3`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    window.URL.revokeObjectURL(blobUrl);

                    if (i < songsToDownload.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                } catch (error) {
                    console.error(`Failed to download ${song.title}:`, error);
                }
            }

            alert(`Started downloading ${songsToDownload.length} songs`);
        } catch (error) {
            console.error('Download error:', error);
            alert('Download failed. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };


    const MainPlayButton = useMemo(() => (
        <button
            className="bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center w-12 h-12 transition-all hover:scale-105"
            onClick={handleMainPlayButton}
            disabled={musics.length === 0}
        >
            {isPlaying && isCurrentPlaylist ?
                <Pause className="w-5 h-5 text-black fill-black" /> :
                <Play className="w-5 h-5 text-black fill-black ml-1" />
            }
        </button>
    ), [isPlaying, isCurrentPlaylist, musics, handleMainPlayButton]);

    const HeaderSection = useMemo(() => (
        <div className="flex items-center justify-between p-4 bg-[#141414] sticky top-[-5px] z-20">
            <div className="flex items-center space-x-4">
                {MainPlayButton}
                {isPremiumUser && (
                    <button
                        className={`text-gray-400 hover:text-white transition-colors ${
                            isDownloading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={downloadAllSongs}
                        disabled={isDownloading}
                        title={isDownloading ? 'Downloading...' : 'Download all visible songs'}
                    >
                        {isDownloading ? (
                            <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Download className="w-6 h-6" />
                        )}
                    </button>
                )}

            </div>
            <div className="relative">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors" onClick={toggleDropdown}>
                    <span className="text-sm">{viewMode}</span>
                    <Menu className="w-4 h-4" />
                </button>

                {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 bg-[#1a1a1a] rounded-md shadow-lg z-10 min-w-[150px]">
                        <div className="py-1">
                            <span className="flex items-center space-x-3 px-4 py-2 text-sm font-semibold text-gray-300">View as</span>
                            <button
                                className={`flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left transition-colors ${viewMode === 'Compact' ? 'text-green-400' : ''}`}
                                onClick={() => handleViewChange('Compact')}
                            >
                                <LayoutList className="w-4 h-4" />
                                <span>Compact</span>
                                {viewMode === 'Compact' && <div className="w-1 h-1 bg-green-400 rounded-full ml-auto"></div>}
                            </button>
                            <button
                                className={`flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left transition-colors ${viewMode === 'List' ? 'text-green-400' : ''}`}
                                onClick={() => handleViewChange('List')}
                            >
                                <List className="w-4 h-4" />
                                <span>List</span>
                                {viewMode === 'List' && <div className="w-1 h-1 bg-green-400 rounded-full ml-auto"></div>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    ), [MainPlayButton, isScrolled, showDropdown, viewMode, toggleDropdown, handleViewChange]);

    const SongList = useMemo(() => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-2"></div>
                        <div className="text-gray-400">Loading liked songs...</div>
                    </div>
                </div>
            );
        }

        if (musics.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <Heart className="w-12 h-12 mb-4" />
                    <p>No liked songs yet</p>
                </div>
            );
        }

        if (viewMode === 'List') {
            return (
                <>
                    <div className="grid grid-cols-12 gap-4 px-8 py-3 sticky top-18 bg-[#121212] text-gray-400 text-sm font-medium border-b border-[#1d1d1d] z-10">
                        <div className="col-span-1 pl-2">#</div>
                        <div className="col-span-5">Title</div>
                        <div className="col-span-4 hidden sm:block">Album</div>
                        <div className="col-span-1 hidden md:block">Date added</div>
                        <div className="col-span-1 flex justify-end">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="px-6">
                        {visibleSongs.map((song, index) => (
                            <SongRowList
                                key={`${song.id || song._id}-${index}`}
                                song={song}
                                index={index}
                                currentTrackId={currentTrackId}
                                isPlaying={isPlaying}
                                isCurrentPlaylist={isCurrentPlaylist}
                                onPlay={handlePlay}
                                dropdownOpen={dropdownOpen}
                                setDropdownOpen={setDropdownOpen}
                            />
                        ))}
                        {hasMoreSongs && (
                            <div className="flex py-6">
                                <button
                                    onClick={handleShowMore}
                                    className="px-6 py-2 text-sm font-medium text-[#999999] hover:text-white"
                                >
                                    See more
                                </button>
                            </div>
                        )}
                    </div>
                </>
            );
        } else {
            return (
                <div className="px-4">
                    <div className="grid grid-cols-12 gap-4 py-2 border-b border-[#1d1d1d] sticky top-18 bg-[#121212] text-gray-400 text-sm font-medium z-10">
                        <div className="col-span-1 pl-8">#</div>
                        <div className="col-span-3">Title</div>
                        <div className="col-span-3">Artist</div>
                        <div className="col-span-2">Album</div>
                        <div className="col-span-2">Date added</div>
                        <div className="col-span-1 flex justify-center">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>

                    <div>
                        {visibleSongs.map((song, index) => (
                            <SongRowCompact
                                key={`${song.id || song._id}-${index}`}
                                song={song}
                                index={index}
                                currentTrackId={currentTrackId}
                                isPlaying={isPlaying}
                                isCurrentPlaylist={isCurrentPlaylist}
                                onPlay={handlePlay}
                                dropdownOpen={dropdownOpen}
                                setDropdownOpen={setDropdownOpen}
                            />
                        ))}
                        {hasMoreSongs && (
                            <div className="flex justify-center py-6">
                                <button
                                    onClick={handleShowMore}
                                    className="px-6 py-2 text-sm font-medium text-white bg-transparent border border-gray-600 rounded-full hover:bg-gray-800 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                                >
                                    Show more
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    }, [viewMode, loading, visibleSongs, currentTrackId, isPlaying, isCurrentPlaylist, handlePlay, dropdownOpen, hasMoreSongs, handleShowMore, musics.length]);

    useEffect(() => {
        console.log('=== Redux State Debug ===');
        console.log('currentTrackId:', currentTrackId);
        console.log('currentTrack (from Redux):', currentTrack);
        console.log('isPlaying:', isPlaying);
        console.log('currentPlaylistId:', currentPlaylistId);
        console.log('isCurrentPlaylist:', isCurrentPlaylist);
        console.log('musics.length:', musics.length);
        console.log('LIKED_SONGS_PLAYLIST_ID:', LIKED_SONGS_PLAYLIST_ID);
        
        if (musics.length > 0) {
            console.log('First song sample:', {
                id: musics[0].id,
                title: musics[0].title,
                audioUrl: musics[0].audioUrl,
                hasAudio: !!musics[0].audioUrl
            });
        }
        console.log('========================');
    }, [currentTrackId, currentTrack, isPlaying, currentPlaylistId, isCurrentPlaylist, musics]);

    return (
        <div className="flex bg-[#121212] text-white min-h-screen">
            <div className="flex-1 rounded-lg" ref={scrollRef}>
                <div className="bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 font-inter text-gray-100 p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8">
                        <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br from-indigo-700 to-purple-700 rounded-lg flex items-center justify-center shadow-2xl">
                            <Heart className="w-24 h-24 text-white" fill="white" />
                        </div>

                        <div className="flex flex-col text-center sm:text-left">
                            <span className="text-sm font-semibold text-gray-300">Playlist</span>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-2 mb-4">
                                Liked Songs
                            </h1>
                            <p className="text-sm text-gray-200">
                                {loading ? 'Loading...' : `${musics.length} song${musics.length !== 1 ? 's' : ''}`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#121212]">
                    {HeaderSection}
                    {SongList}
                </div>
            </div>

            {currentTrackId && (
                <BottomPlayer
                    songs={musics}
                    currentTrackId={currentTrackId}
                    currentTrackIndex={currentTrackIndex}
                    isPlaying={isPlaying}
                    handlePlay={handlePlay}
                />
            )}
        </div>
    );
};

export default LikedSong;