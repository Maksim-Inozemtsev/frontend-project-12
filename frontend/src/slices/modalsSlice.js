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
    openModal(state, { payload }) {
      const { type, channelId } = payload;
      state.show = true;
      state.type = type;
      state.channelId = channelId;
    },

    closeModal(state) {
      state.show = false;
      state.type = null;
      state.channelId = null;
    },
  },
});

export const { actions } = modalsSlice;
export default modalsSlice.reducer;
