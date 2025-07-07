import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import playerReducer from "./playerSlice"
import recentlyPlayedReducer from './recentlyPlayedPlaylistsSlice';
import notificationReducer from './notificationSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        player: playerReducer,
        recentlyPlayed: recentlyPlayedReducer,
        notifications: notificationReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['player/setAudioRef', 'player/setVideoRef'],
            ignoredPaths: ['player.audioRef', 'player.videoRef'],
        },
    }),
});

