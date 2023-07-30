import React from 'react';
import { useSelector } from 'react-redux';

const Channels = () => {
  const { channels } = useSelector((state) => state.channelsReducer);

  return (
    <div className="mt-3">
      {channels.map((channel) => (
        <div key={channel.id}>{channel}</div>
      ))}
    </div>
  );
};

export default Channels;
