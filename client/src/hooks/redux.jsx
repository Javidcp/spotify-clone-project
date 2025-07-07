/* eslint-disable no-unused-vars */
import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  setCurrentTrack,
  setIsPlaying,
  togglePlay,
  nextTrack,
  previousTrack,
  setShowVideoComponent,
  setPause, 
  clearCurrentTrack,
  setCurrentTime,
  setDuration,
  setVolume,
  toggleMute,
  setHasTrackLoaded,
  setSelectedPlaylist,
  setAudioRef,
  setLoading,
  setShouldAutoPlay,
  setError,
  setCurrentPlaylist,
  fetchPlaylistSongs,
  setSongs,
  selectCurrentTrack,
  selectSongsForCurrentPlaylist,
  selectCurrentTrackId,
  selectCurrentTrackIndex,
  selectIsPlaying,
  selectPlayerUIState,
} from '../redux/playerSlice';

export const usePlayer = () => {
  const dispatch = useDispatch();

  const audioRef = useRef(null);
  // const videoRef = useRef(null);

  const currentPlaylistId = useSelector((state) => state.player.currentPlaylistId);
  const shouldAutoPlay = useSelector((state) => state.player.shouldAutoPlay);
  const hasTrackLoaded = useSelector((state) => state.player.hasTrackLoaded);

  const songs = useSelector(selectSongsForCurrentPlaylist);
  const currentTrack = useSelector(selectCurrentTrack);
  const currentTrackId = useSelector(selectCurrentTrackId);
  const currentTrackIndex = useSelector(selectCurrentTrackIndex);
  const isPlaying = useSelector(selectIsPlaying);
  const uiState = useSelector(selectPlayerUIState);

  const registerAudioRef = useCallback((ref) => {
    audioRef.current = ref;
  }, []);

  // const registerVideoRef = useCallback((ref) => {
  //   videoRef.current = ref;
  // }, []);

  const playTrack = useCallback((songId, songIndex = null) => {
    const resolvedIndex = songIndex !== null ? songIndex : songs.findIndex((song) => song.id === songId);

    if (resolvedIndex !== -1 && songs[resolvedIndex]) {
      const song = songs[resolvedIndex];

      if (!song.audioUrl && !song.url && !song.src && !song.audio) {
        console.error('Song missing audio URL:', song);
        dispatch(setError('Song audio not available'));
        return;
      }

      const normalizedSong = {
        ...song,
        audioUrl: song.audioUrl || song.url || song.src || song.audio || song.file
      };

      dispatch(setLoading(true));
      dispatch(
        setCurrentTrack({
          trackId: songId,
          trackIndex: resolvedIndex,
          song: normalizedSong,
        })
      );
      dispatch(setIsPlaying(true));

      if (song?.video || song?.videoUrl) {
        dispatch(setShowVideoComponent(true));
      } else {
        dispatch(setShowVideoComponent(false));
      }
    } else {
      console.error('Song not found:', songId, 'in songs:', songs);
      dispatch(setError('Song not found'));
    }
  }, [dispatch, songs]);

  const playPause = useCallback(() => {
    if (currentTrackId && currentTrack) {
      dispatch(togglePlay());
    } else if (songs.length > 0) {
      playTrack(songs[0].id, 0);
    }
  }, [dispatch, currentTrackId, currentTrack, songs, playTrack]);

  const pausePlayback = useCallback(() => {
    dispatch(setPause());
  }, [dispatch]);

  const clearTrack = useCallback(() => {
    dispatch(clearCurrentTrack());
  }, [dispatch]);

  const switchPlaylist = useCallback((playlistId, songsData = null, options = { 
    autoPlay: false, 
    preserveCurrentTrack: false,
    startFromTrack: null 
  }) => {
    dispatch(setCurrentPlaylist(playlistId));

    if (songsData && songsData.length > 0) {
      const processedSongs = songsData.map(song => ({
        ...song,
        audioUrl: song.audioUrl || song.url || song.src || song.audio || song.file,
        id: song.id || song._id
      }));

      dispatch(setSongs(processedSongs));

      if (options.autoPlay && !options.preserveCurrentTrack) {
        const startIndex = options.startFromTrack !== null ? options.startFromTrack : 0;
        const startSong = processedSongs[startIndex];
        
        if (startSong) {
          dispatch(setCurrentTrack({ 
            trackId: startSong.id, 
            trackIndex: startIndex, 
            song: startSong 
          }));
          dispatch(setIsPlaying(true));
        }
      }
    } else {
      dispatch(fetchPlaylistSongs(playlistId));
    }

    dispatch(setShowVideoComponent(false));
  }, [dispatch]);

  

const skipNext = useCallback(() => {
  if (songs.length > 0 && currentTrackIndex < songs.length - 1) {
    const nextIndex = currentTrackIndex + 1;
    const nextSong = songs[nextIndex];
    if (nextSong) {
      playTrack(nextSong.id, nextIndex);
    }
  }
}, [songs, currentTrackIndex, playTrack]);

const skipPrevious = useCallback(() => {
  if (songs.length > 0 && currentTrackIndex > 0) {
    const prevIndex = currentTrackIndex - 1;
    const prevSong = songs[prevIndex];
    if (prevSong) {
      playTrack(prevSong.id, prevIndex);
    }
  }
}, [songs, currentTrackIndex, playTrack]);




  const actions = useMemo(() => ({
    skipNext,
    skipPrevious,
    updateCurrentTime: (time) => dispatch(setCurrentTime(time)),
    updateDuration: (duration) => dispatch(setDuration(duration)),
    updateVolume: (volume) => dispatch(setVolume(volume)),
    toggleMuteVolume: () => dispatch(toggleMute()),
    setPlayerLoading: (loading) => dispatch(setLoading(loading)),
    setPlayerError: (error) => dispatch(setError(error)),
    setShowVideo: (show) => dispatch(setShowVideoComponent(show)),
    switchPlaylist,
    registerAudioRef: (ref) => dispatch(setAudioRef(ref)),
    // registerVideoRef,
    setSongs: (songs) => dispatch(setSongs(songs)),
    setShouldAutoPlay: (value) => dispatch(setShouldAutoPlay(value)),
  }), [dispatch, switchPlaylist, skipNext, skipPrevious]);

  return useMemo(() => ({
    currentPlaylistId,
    songs,
    currentTrackId,
    currentTrackIndex,
    currentTrack,
    isPlaying,
    shouldAutoPlay,
    audioRef,
    // videoRef,
    showVideoComponent: uiState.showVideoComponent,
    volume: uiState.volume,
    isMuted: uiState.isMuted,
    currentTime: uiState.currentTime,
    duration: uiState.duration,
    isLoading: uiState.isLoading,
    hasTrackLoaded,
    error: uiState.error,
    pausePlayback,
    clearTrack,
    playTrack,
    playPause,
    ...actions,
  }), [
    currentPlaylistId,
    songs,
    currentTrackId,
    shouldAutoPlay,
    currentTrackIndex,
    currentTrack,
    isPlaying,
    hasTrackLoaded,
    pausePlayback,
    clearTrack,
    uiState,
    playTrack,
    playPause,
    actions,
  ]);
};