import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannel: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels(state, { payload }) {
      state.channels = payload;
    },

    setCurrentChannel(state, { payload }) {
      state.currentChannel = payload;
    },
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;