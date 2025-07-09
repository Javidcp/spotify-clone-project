import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axios';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (userId) => {
    const res = await api.get(`/notifications/${userId}`);
    return res.data;
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (userId) => {
    await api.put(`/notifications/mark-all-read/${userId}`);
    return userId;
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    status: 'idle',
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, isRead: true }));
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
