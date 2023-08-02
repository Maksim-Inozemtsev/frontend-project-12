import { createSlice } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice.js';

const initialState = {
  messages: [],
  currentChannelMessages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages(state, { payload }) {
      state.messages = payload;
    },

    setMessage(state, { payload }) {
      state.messages = [...state.messages, payload];
    },
  },

  extraReducers: (builder) => {
    builder.addCase(channelsActions.setCurrentChannel, (state, action) => {
      const currentMessages = state.messages.filter((item) => item.channelId === action.payload);
      state.currentChannelMessages = currentMessages;
    });
  },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;