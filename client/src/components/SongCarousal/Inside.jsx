/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, Pause, Plus, MoreHorizontal, Menu, LayoutList, List, Clock, Download } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Logo from "../../assets/Spotify logo.png";
import { 
    fetchPlaylistSongs,
    fetchPlaylistMetadata,
    setCurrentPlaylist,
    setSongsForPlaylist,
    playTrackFromPlaylist,
    togglePlay,
    setShowVideoComponent,
    clearCurrentTrack,
    setSelectedPlaylist,
    setIsPlaying,
    selectCurrentTrackId,
    selectCurrentTrackIndex,
    selectCurrentTrack,
    selectIsPlaying,
    selectShowVideoComponent,
    selectSongsForPlaylist,
    selectIsLoadingForPlaylist,
    selectErrorForPlaylist,
    selectCurrentPlaylistId,
    selectPlaylistMetadata
} from '../../redux/playerSlice';
import BottomPlayer from '../Player';
import VideoPlayer from './VideoPlayer';
import api from '../../utils/axios';
import Dot from "../Dot"
import { addRecentlyPlayedPlaylist } from '../../redux/recentlyPlayedPlaylistsSlice';
import LikeButton from '../LikkedButton';
import useAuth from '../../hooks/useAuth';
import { saveAs } from 'file-saver';

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
        setDropdownOpen(null);
    }, [setDropdownOpen]);

    return (
        <div
            className={`flex justify-between sm:grid sm:grid-cols-12  sm:gap-4 py-2 sm:px-2 rounded-md  hover:bg-[#1d1d1d] transition-colors group ${
                isCurrentSong ? 'bg-[#1d1d1d]' : ''
            }`}
        >
            <div className="col-span-1 hidden sm:flex items-center">
            {currentTrackId === song.id && isPlaying ? (
                <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-green-400 animate-pulse"></div>
                    <div className="w-1 h-4 bg-green-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-4 bg-green-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
            ) : (
                <>
                    <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                    <Play className="w-4 h-4 text-white hidden group-hover:block" onClick={() => onPlay(song, index)}/>
                </>
            )}
        </div>

        <div className="col-span-5 flex items-center space-x-3">
            <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="min-w-0">
                <div className={`hidden sm:block font-medium truncate ${currentTrackId === song.id ? 'text-green-400' : 'text-white'}`}>
                    {song.title}
                </div>
                <div className={`sm:hidden block font-medium truncate ${currentTrackId === song.id ? 'text-green-400' : 'text-white'}`} onClick={() => onPlay(song, index)}>
                    {song.title}
                </div>
                <div className="text-sm text-gray-400 truncate">{song.artist.map(a => a.name).join(", ") || 'Unknown'}</div>
            </div>
        </div>

        <div className="col-span-3 hidden sm:flex items-center">
            <span className="text-gray-400 text-sm truncate hover:underline cursor-pointer">
                {song.genre?.name || "Unknown"}
            </span>
        </div>

        <div className="col-span-1 md:flex items-center hidden">
            <span className="text-gray-400 text-sm">{song.createdAt.slice(0, 10)}</span>
        </div>

        <div className="sm:col-span-2 flex items-center  gap-2 sm:justify-between justify-end">
            <div className="pl-5 sm:hover:text-white sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity cursor-pointer"><LikeButton song={song}/></div>
            <span className="text-gray-400 text-sm hidden sm:block">{song.duration}</span>
            <button 
                onClick={() => setDropdownOpen(dropdownOpen === song.id ? null : song.id)}  
                className="w-6 h-6 text-gray-400 sm:hover:text-white sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity"
            >
                <MoreHorizontal className="w-full h-full" />
            </button>
            {dropdownOpen === song.id && (
                <div className="relative z-50">
                    <Dot
                        isOpen={true}
                        setIsOpen={() => setDropdownOpen(null)}
                        position="right"
                        onItemClick={() => {
                            // console.log('Clicked:', item.label);
                            setDropdownOpen(null);
                        }}
                        song={song?._id}
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
            className={`grid grid-cols-12 gap-4 py-2 rounded-md hover:bg-[#1d1d1d] transition-colors group cursor-pointer ${
                isCurrentSong ? 'bg-[#1d1d1d]' : ''
            }`}
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
                        <Play className="w-4 h-4 text-white hidden group-hover:block" onClick={handlePlayClick}/>
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
                    {song.artist?.map(a => a.name).join(", ") || 'Unknown'}
                </span>
            </div>

            <div className="col-span-2 flex items-center">
                <span className="text-gray-400 text-sm">{song.genre?.name || "Unknown"}</span>
            </div>

            <div className="col-span-1 flex items-center">
                <span className="text-gray-400 text-sm">{song.createdAt?.slice(0, 10) || 'N/A'}</span>
            </div>

            <div className="col-span-2 flex items-center gap-2 justify-end">
                <span className='hover:text-white opacity-0 group-hover:opacity-100 transition-opacity'><LikeButton song={song}/></span>
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

const Inside = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [viewMode, setViewMode] = useState('List');
    const [isScrolled, setIsScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [visibleSongsCount, setVisibleSongsCount] = useState(5);
    const { user } = useAuth()
    const isPremiumUser = user?.isPremium

    
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const { playlistId } = useParams();
    const dispatch = useDispatch();

    const currentTrackId = useSelector(selectCurrentTrackId);
    const currentTrackIndex = useSelector(selectCurrentTrackIndex);
    const currentTrack = useSelector(selectCurrentTrack);
    const isPlaying = useSelector(selectIsPlaying);
    const showVideoComponent = useSelector(selectShowVideoComponent);
    const currentPlaylistId = useSelector(selectCurrentPlaylistId);
    
    const isLoadingPlaylist = useSelector(selectIsLoadingForPlaylist(playlistId));
    const playlistError = useSelector(selectErrorForPlaylist(playlistId));
    const genrePlaylist = useSelector(selectPlaylistMetadata(playlistId));
    
    const isCurrentPlaylist = useMemo(() => currentPlaylistId === playlistId, [currentPlaylistId, playlistId]);
    
    const songs = useSelector(selectSongsForPlaylist(playlistId));

    useEffect(() => {
        setVisibleSongsCount(3);
    }, [playlistId]);

    const handleShowMore = useCallback(() => {
        setVisibleSongsCount(prev => prev + 3);
    }, []);

    const visibleSongs = useMemo(() => {
        return songs.slice(0, visibleSongsCount);
    }, [songs, visibleSongsCount]);

    const hasMoreSongs = useMemo(() => {
        return songs.length > visibleSongsCount;
    }, [songs.length, visibleSongsCount]);

    useEffect(() => {
        if (playlistId) {
            dispatch(setSelectedPlaylist(playlistId));
            dispatch(fetchPlaylistSongs({ playlistId, isGenrePlaylist: true }));
            dispatch(fetchPlaylistMetadata({ playlistId, isGenrePlaylist: true }));
        }
    }, [playlistId, dispatch]);

    const currentUserId = useSelector(state => state.recentlyPlayed.currentUserId);

    useEffect(() => {
        if (currentUserId && genrePlaylist) {
            const playlistIdValue = genrePlaylist._id || genrePlaylist.id;
            const playlistName = genrePlaylist.name;
            
            if (playlistIdValue && playlistName) {
                const playlistData = {
                    id: playlistIdValue,
                    name: playlistName,
                    cover: genrePlaylist.cover || genrePlaylist.coverImage || genrePlaylist.image,
                    description: genrePlaylist.description || ''
                };
                
                dispatch(addRecentlyPlayedPlaylist(playlistData));
            }
        }
    }, [currentUserId, genrePlaylist, dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentUserId && genrePlaylist) {
                const playlistIdValue = genrePlaylist._id || genrePlaylist.id;
                const playlistName = genrePlaylist.name;
                
                if (playlistIdValue && playlistName) {
                    const playlistData = {
                        id: playlistIdValue,
                        name: playlistName,
                        cover: genrePlaylist.cover || genrePlaylist.coverImage || genrePlaylist.image,
                        description: genrePlaylist.description || ''
                    };
                    
                    dispatch(addRecentlyPlayedPlaylist(playlistData));
                }
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [playlistId, currentUserId, genrePlaylist, dispatch]);

    useEffect(() => {
        if (!isCurrentPlaylist || !currentTrack) {
            if (playlistId) {
                dispatch(setCurrentPlaylist(playlistId));
            }
        }
    }, [playlistId, dispatch, isCurrentPlaylist, currentTrack]);

    const handleScroll = useCallback(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            const shouldBeScrolled = scrollContainer.scrollTop > 100;
            setIsScrolled(shouldBeScrolled);
        }
    }, []);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            let timeoutId;
            const throttledScroll = () => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(handleScroll, 16);
            };
            
            scrollContainer.addEventListener("scroll", throttledScroll, { passive: true });
            
            return () => {
                clearTimeout(timeoutId);
                scrollContainer.removeEventListener("scroll", throttledScroll);
            };
        }
    }, [handleScroll]);

    const handlePlay = useCallback((song = null, index = null) => {
        if (song && song.id === currentTrackId && isCurrentPlaylist) {
            dispatch(togglePlay());
            return;
        }

        if (song && typeof song === "object") {
            dispatch(
                playTrackFromPlaylist({
                    playlistId,
                    trackId: song.id,
                    trackIndex: index !== null ? index : 0,
                })
            );
        } else {
            dispatch(togglePlay());
        }
    }, [currentTrackId, isCurrentPlaylist, playlistId, dispatch]);

    const handleViewChange = useCallback((mode) => {
        setViewMode(mode);
        setShowDropdown(false);
    }, []);

    const toggleDropdown = useCallback(() => {
        setShowDropdown(prev => !prev);
    }, []);



    const handleDownloadAll = async () => {
        for (const song of songs) {
            try {
                const response = await fetch(song.url);
                const blob = await response.blob();
                saveAs(blob, `${song.title}.mp3`);
            } catch (err) {
                console.error(`Failed to download ${song.title}`, err);
            }
        }
    };


    const MainPlayButton = useMemo(() => (
        <>
        <button
            className="bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center w-12 h-12 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => {
                if (!isCurrentPlaylist || !currentTrack) {
                    if (songs && songs.length > 0) {
                        handlePlay(songs[0], 0);
                    }
                } else {
                    dispatch(togglePlay());
                }
            }}
            disabled={!songs || songs.length === 0}
        >
            {isPlaying && isCurrentPlaylist ?
                <Pause className="w-5 h-5 text-black fill-black" /> :
                <Play className="w-5 h-5 text-black fill-black ml-1" />
            }
        </button>
        {isPremiumUser && (
            <button
                className={`text-gray-400 hover:text-white transition-colors `}
                onClick={handleDownloadAll}
            >
                
                    <Download className="w-6 h-6" />
            </button>
        )}</>
    ), [isPlaying, currentTrack, isCurrentPlaylist, songs, handlePlay, dispatch, isPremiumUser ]);

    const SongList = useMemo(() => {
        if (!songs || songs.length === 0) {
            return (
                <div className="text-center text-gray-400 py-6">
                    {isLoadingPlaylist ? 'Loading songs...' : 'No songs found'}
                </div>
            );
        }

        if (viewMode === 'List') {
            return (
                <>
                    <div className="grid grid-cols-12 gap-4 px-8 py-3 sticky top-[-5px] bg-[#121212] text-gray-400 text-sm font-medium border-b border-[#1d1d1d]">
                        <div className="col-span-1 pl-2">#</div>
                        <div className="sm:col-span-5">Title</div>
                        <div className="col-span-3 hidden sm:block">Album</div>
                        <div className="col-span-1 hidden md:block">Date added</div>
                        <div className="col-span-2 hidden sm:flex sm:justify-center">
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
                            <div className="flex  py-6">
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
    }, [viewMode, currentTrackId, isCurrentPlaylist, isPlaying, handlePlay, visibleSongs, isLoadingPlaylist, dropdownOpen, hasMoreSongs, handleShowMore]);

    const totalDuration = useMemo(() => {
        if (!songs || songs.length === 0) return '0 sec';
        
        let totalSeconds = 0;
        songs.forEach(song => {
            if (song.duration) {
                const [mins, secs] = song.duration.split(":").map(Number);
                if (!isNaN(mins) && !isNaN(secs)) {
                    totalSeconds += (mins * 60 + secs);
                }
            }
        });

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        let formatted = "";
        if (hours > 0) {
            formatted += `${hours} hrs `;
        }
        if (minutes > 0 || hours > 0) {
            formatted += `${minutes} min `;
        }
        formatted += `${seconds} sec`;
        return formatted.trim();
    }, [songs]);

    if (isLoadingPlaylist && !genrePlaylist) {
        return (
            <div className="flex bg-[#121212] text-white min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-2"></div>
                    <div>Loading playlist...</div>
                </div>
            </div>
        );
    }

    if (playlistError) {
        return (
            <div className="flex bg-[#121212] text-white min-h-screen items-center justify-center">
                <div className="text-center text-red-400">
                    Error loading playlist: {playlistError}
                </div>
            </div>
        );
    }

    if (!genrePlaylist && !isLoadingPlaylist) {
        return (
            <div className="flex bg-[#121212] text-white min-h-screen items-center justify-center">
                <div className="text-center text-gray-400">
                    Playlist not found
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-[#121212] text-white min-h-screen">
            <div className="flex-1 rounded-lg" ref={scrollRef}>
                {genrePlaylist && (
                    <div
                        className="p-7 relative"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${genrePlaylist.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <h4 className="text-sm opacity-80">Public Playlist</h4>
                        <h1 className="text-3xl md:text-8xl font-bold mb-3">{genrePlaylist.name}</h1>
                        <p className="text-xs sm:text-sm text-gray-300 mb-2">{genrePlaylist.description}</p>
                        <div className="flex mt-1 gap-1 items-center text-sm">
                            <img src={Logo} className='hidden sm:block w-6 mr-1' alt="Spotify Logo" />
                            <p className="hidden sm:block font-bold">Spotify</p>
                            <span className="hidden sm:block w-1 rounded-full bg-gray-300 h-1"></span>
                            <div className="font-semibold text-xs sm:text-sm text-gray-300">
                                {songs.length} songs, about {totalDuration}
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-[#121212]">
                    <div className="flex items-center justify-between p-4 bg-[#141414] sticky top-[-5px] z-20">
                        <div className="flex items-center space-x-4">
                            {MainPlayButton}
                            {!isScrolled && (
                                <>
                                    
                                    <button className="hidden text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                                        <MoreHorizontal className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="hidden sm:block relative">
                            <button
                                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1"
                                onClick={toggleDropdown}
                            >
                                <span className="text-sm">{viewMode}</span>
                                <Menu className="w-4 h-4" />
                            </button>

                            {showDropdown && (
                                <div className=" absolute right-0 top-full mt-2 bg-[#1a1a1a] rounded-md shadow-lg z-30 min-w-[150px]">
                                    <div className="py-1">
                                        <span className="flex items-center space-x-3 px-4 py-2 text-sm font-semibold text-gray-300">
                                            View as
                                        </span>
                                        <button
                                            className={`flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left transition-colors ${viewMode === 'Compact' ? 'text-green-400' : ''}`}
                                            onClick={() => handleViewChange('Compact')}
                                        >
                                            <LayoutList className="w-4 h-4" />
                                            <span>Compact</span>
                                            {viewMode === 'Compact' && (
                                                <div className="w-1 h-1 bg-green-400 rounded-full ml-auto"></div>
                                            )}
                                        </button>
                                        <button
                                            className={`flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left transition-colors ${viewMode === 'List' ? 'text-green-400' : ''}`}
                                            onClick={() => handleViewChange('List')}
                                        >
                                            <List className="w-4 h-4" />
                                            <span>List</span>
                                            {viewMode === 'List' && (
                                                <div className="w-1 h-1 bg-green-400 rounded-full ml-auto"></div>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {SongList}
                </div>
            </div>
            
            {currentTrack && (
                <BottomPlayer
                    songs={songs}
                    currentTrackId={currentTrackId}
                    currentTrackIndex={currentTrackIndex}
                    isPlaying={isPlaying}
                    handlePlay={handlePlay}
                />
            )}
        </div>
    );
};

export default Inside;