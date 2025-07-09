import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axios";

export const toggleLikedSong = createAsyncThunk(
    'likedSongs/toggleLikedSong',
    async (songId, { rejectWithValue }) => {
        try {
        const { data } = await api.post("/likedSongs", { songId });
        return data.likedSongs;
        } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to toggle liked song");
        }
    }
);

export const fetchLikedSongs = createAsyncThunk(
    'likedSongs/fetchLikedSongs',
    async (_, { rejectWithValue }) => {
        try {
        const { data } = await api.get("/likedSongs");
        return data.likedSongs;
        } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch liked songs");
        }
    }
);

const likedSongsSlice = createSlice({
    name: "likedSongs",
    initialState: {
        liked: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setLikedSongs: (state, action) => {
        state.liked = action.payload;
        state.error = null;
        },
        toggleLike: (state, action) => {
        const song = action.payload;
        const existingIndex = state.liked.findIndex(s => {
            const likedId = typeof s === 'object' ? s._id : s;
            return likedId === song._id;
        });
        
        if (existingIndex !== -1) {
            state.liked.splice(existingIndex, 1);
        } else {
            state.liked.push(song);
        }
        },
        clearError: (state) => {
        state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(toggleLikedSong.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(toggleLikedSong.fulfilled, (state, action) => {
            state.isLoading = false;
            state.liked = action.payload;
            state.error = null;
        })
        .addCase(toggleLikedSong.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        .addCase(fetchLikedSongs.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchLikedSongs.fulfilled, (state, action) => {
            state.isLoading = false;
            state.liked = action.payload;
            state.error = null;
        })
        .addCase(fetchLikedSongs.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    },
});

export const { setLikedSongs, toggleLike, clearError } = likedSongsSlice.actions;

export const selectLikedSongs = (state) => state.player.likedSongs || [];
export const selectIsLoading = (state) => state.likedSongs?.isLoading || false;
export const selectError = (state) => state.likedSongs?.error || null;
export const selectIsLiked = (songId) => (state) => {
    const likedSongs = state.player.likedSongs || [];
    return likedSongs.some(s => {
        const likedId = typeof s === 'object' ? s._id : s;
        return likedId === songId;
    });
};

export default likedSongsSlice.reducer;