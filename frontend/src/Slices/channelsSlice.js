import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannelId: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels(state, { payload }) {
      state.channels = payload;
    },

    setCurrentChannel(state, { payload }) {
      state.currentChannelId = payload;
    },

    addChannel(state, { payload }) {
      state.channels = [...state.channels, payload];
    },

    removeChannel(state, { payload }) {
      state.channels = state.channels.filter(item => item.id !== payload.id);
      if (state.currentChannelId === payload.id) {
        const defaultChannel = state.channels[0];
        const defaultChannelId = defaultChannel.id;
        state.currentChannelId = defaultChannelId;
      }
    },

    renameChannel(state, { payload }) {
      const channel = state.channels.find(el => el.id === payload.id);
      channel.name = payload.name;
    },
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;