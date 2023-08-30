/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false,
  type: null,
  channelId: null,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setShow(state, { payload }) {
      state.show = payload;
    },

    setType(state, { payload }) {
      state.type = payload;
    },

    setChannelId(state, { payload }) {
      state.channelId = payload;
    },
  },
});

export const { actions } = modalsSlice;
export default modalsSlice.reducer;
