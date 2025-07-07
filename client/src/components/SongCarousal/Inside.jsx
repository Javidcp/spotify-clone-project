/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, Pause, Plus, MoreHorizontal, Menu, LayoutList, List, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Logo from "../../assets/Spotify logo.png";
import { 
    fetchPlaylistSongs,
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
    selectCurrentPlaylistId
} from '../../redux/playerSlice';
import BottomPlayer from '../Player';
import VideoPlayer from './VideoPlayer';
import api from '../../utils/axios';
import Dot from "../Dot"
import { addRecentlyPlayedPlaylist } from '../../redux/recentlyPlayedPlaylistsSlice';
import LikeButton from '../LikkedButton';

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
        // console.log('Clicked:', item.label);
        setDropdownOpen(null);
    }, [setDropdownOpen]);

    return (
        <div
            className={`grid grid-cols-12 gap-4 py-2 px-2 rounded-md hover:bg-[#1d1d1d] transition-colors group cursor-pointer ${
                isCurrentSong ? 'bg-[#1d1d1d]' : ''
            }`}
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
                        <Play className="w-4 h-4 text-white hidden group-hover:block cursor-pointer" onClick={handlePlayClick}/>
                    </>
                )}
            </div>

            <div className="col-span-5 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                    <img 
                        src={song.coverImage} 
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
                        {song.artist?.map(a => a.name).join(", ") || 'Unknown'}
                    </div>
                </div>
            </div>

            <div className="col-span-3 hidden sm:flex items-center">
                <span className="text-gray-400 text-sm truncate hover:underline cursor-pointer">
                    {song.genre?.name || "Unknown"}
                </span>
            </div>

            <div className="col-span-1 md:flex items-center hidden">
                <span className="text-gray-400 text-sm">{song.createdAt?.slice(0, 10) || 'N/A'}</span>
            </div>

            <div className="col-span-2 flex items-center gap-2 justify-between">
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
    const [genrePlaylist, setGenrePlaylist] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [visibleSongsCount, setVisibleSongsCount] = useState(5);

    
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
    
    const isCurrentPlaylist = useMemo(() => currentPlaylistId === playlistId, [currentPlaylistId, playlistId]);
    
    const songs = useSelector((state) =>
        state.player.playlists[playlistId]?.songs || []
    );

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
            dispatch(fetchPlaylistSongs(playlistId));
        }
    }, [playlistId, dispatch]);

const currentUserId = useSelector(state => state.recentlyPlayed.currentUserId);

    useEffect(() => {
        if (currentUserId && genrePlaylist) {
            const playlistId = genrePlaylist._id || genrePlaylist.id;
            const playlistName = genrePlaylist.name;
            
            if (playlistId && playlistName) {
            const playlistData = {
                id: playlistId,
                name: playlistName,
                cover: genrePlaylist.cover || genrePlaylist.coverImage || genrePlaylist.image,
                description: genrePlaylist.description || ''
            };
            
            // console.log('Adding playlist to recently played:', playlistData);
            dispatch(addRecentlyPlayedPlaylist(playlistData));
            } else {
            // console.log('Missing required playlist data - ID or Name');
            }
        } else {
            // console.log('Skipping recently played - User ID:', currentUserId, 'Playlist:', !!genrePlaylist);
        }
    }, [currentUserId, genrePlaylist, dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentUserId && genrePlaylist) {
                const playlistId = genrePlaylist._id || genrePlaylist.id;
                const playlistName = genrePlaylist.name;
                
                if (playlistId && playlistName) {
                    const playlistData = {
                    id: playlistId,
                    name: playlistName,
                    cover: genrePlaylist.cover || genrePlaylist.coverImage || genrePlaylist.image,
                    description: genrePlaylist.description || ''
                    };
                    
                    // console.log('Delayed add to recently played:', playlistData);
                    dispatch(addRecentlyPlayedPlaylist(playlistData));
                }
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [playlistId, currentUserId]);


    useEffect(() => {
        let isMounted = true;
        
        const fetchGenrePlaylist = async () => {
            if (!playlistId) return;
            
            try {
                // console.log('Fetching playlist:', playlistId);
                const result = await dispatch(fetchPlaylistSongs(playlistId));

                if (!isMounted) return;

                if (fetchPlaylistSongs.fulfilled.match(result)) {
                    // console.log('Playlist songs fetched via Redux:', result.payload);
                } else {
                    console.warn('Redux fetch failed, trying direct API call');

                    const { data } = await api.get(`/genre-playlists/${playlistId}`);
                    
                    if (!isMounted) return;
                    
                    // console.log('Fetched playlist data directly:', data);
                    setGenrePlaylist(data);

                    if (data.songs && Array.isArray(data.songs)) {
                        const processedSongs = data.songs.map(song => ({
                            ...song,
                            id: song._id || song.id,
                            audioUrl: song.audioUrl || song.url || song.src || song.audio || song.file,
                            video: song.video || song.videoUrl || null
                        }));

                        // console.log('Processed songs:', processedSongs);
                        dispatch(setSongsForPlaylist({ playlistId, songs: processedSongs }));
                    }
                }

                if (!currentPlaylistId || !currentTrack) {
                    dispatch(setCurrentPlaylist(playlistId));
                }

            } catch (error) {
                if (isMounted) {
                    console.error("Error fetching genre playlist:", error);
                }
            }
        };

        fetchGenrePlaylist();
        
        return () => {
            isMounted = false;
        };
    }, [playlistId, dispatch, currentPlaylistId, currentTrack]);

    useEffect(() => {
        let isMounted = true;
        
        const fetchPlaylistMetadata = async () => {
            if (!genrePlaylist && playlistId) {
                try {
                    const { data } = await api.get(`/genre-playlists/${playlistId}`);
                    if (isMounted) {
                        setGenrePlaylist(data);
                    }
                } catch (error) {
                    if (isMounted) {
                        console.error("Error fetching playlist metadata:", error);
                    }
                }
            }
        };

        fetchPlaylistMetadata();
        
        return () => {
            isMounted = false;
        };
    }, [genrePlaylist, playlistId]);

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

    const MainPlayButton = useMemo(() => (
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
    ), [isPlaying, currentTrack, isCurrentPlaylist, songs, handlePlay, dispatch]);

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
                    <div className="grid grid-cols-12 gap-4 px-8 py-3 sticky top-18 bg-[#121212]  text-gray-400 text-sm font-medium border-b border-[#1d1d1d] z-10">
                        <div className="col-span-1 pl-2">#</div>
                        <div className="col-span-5">Title</div>
                        <div className="col-span-3 hidden sm:block">Album</div>
                        <div className="col-span-1 hidden md:block">Date added</div>
                        <div className="col-span-2 flex justify-center">
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
                        <p className="text-gray-300 mb-2">{genrePlaylist.description}</p>
                        <div className="flex mt-1 gap-1 items-center text-sm">
                            <img src={Logo} className='w-6 mr-1' alt="Spotify Logo" />
                            <p className="font-bold">Spotify</p>
                            <span className="w-1 rounded-full bg-gray-300 h-1"></span>
                            <div className="font-semibold text-gray-300">
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
                                    <button className="border-2 border-zinc-500 text-zinc-500 hover:border-white hover:text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                    <button className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded">
                                        <MoreHorizontal className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="relative">
                            <button
                                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1"
                                onClick={toggleDropdown}
                            >
                                <span className="text-sm">{viewMode}</span>
                                <Menu className="w-4 h-4" />
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 top-full mt-2 bg-[#1a1a1a] rounded-md shadow-lg z-30 min-w-[150px]">
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