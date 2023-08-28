/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice.js';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages(state, { payload }) {
      state.messages = payload;
    },

    setMessage(state, { payload }) {
      state.messages.push(payload);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, action) => {
      const channelId = action.payload.id;
      const restMessages = state.messages.filter((e) => e.channelId !== channelId.toString());
      state.messages = restMessages;
    });
  },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;
