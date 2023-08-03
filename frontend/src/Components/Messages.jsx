import React from 'react';
import { useSelector } from 'react-redux';

const Messages = () => {
  const { currentChannel } = useSelector((state) => state.channelsReducer);
  const { messages } = useSelector((state) => state.messagesReducer);

  return (
    <div className="mt-3">
      {messages.filter(el => el.channelId === currentChannel.toString())
        .map((message) => <div key={message.id}>{message.username}: {message.body}</div>)}
    </div>
  );
};

export default Messages;
