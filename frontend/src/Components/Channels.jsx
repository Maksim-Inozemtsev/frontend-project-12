import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as channelsActions } from '../Slices/channelsSlice.js';

const Channels = () => {
  const { channels } = useSelector((state) => state.channelsReducer);
  const dispatch = useDispatch();

  const handler = (id) => {
    dispatch(channelsActions.setCurrentChannel(id));
  }

  return (
    <div className="mt-3">
      {channels.map((channel) => (
        <div key={channel.id} onClick={() => handler(channel.id)}>{channel.name}</div>
      ))}
    </div>
  );
};

export default Channels;
