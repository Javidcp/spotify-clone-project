// redux/likedSongsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const likedSongsSlice = createSlice({
    name: "likedSongs",
    initialState: {
        liked: [],
    },
    reducers: {
        setLikedSongs: (state, action) => {
        state.liked = action.payload;
        },
        toggleLike: (state, action) => {
        const song = action.payload;
        const exists = state.liked.find(s => s._id === song._id);
        if (exists) {
            state.liked = state.liked.filter(s => s._id !== song._id);
        } else {
            state.liked.push(song);
        }
        },
    },
});

export const { setLikedSongs, toggleLike } = likedSongsSlice.actions;
export default likedSongsSlice.reducer;
