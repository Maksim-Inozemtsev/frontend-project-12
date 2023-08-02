import React from 'react';
import { useSelector } from 'react-redux';

const Messages = () => {
  const { currentChannelMessages } = useSelector((state) => state.messagesReducer);

  return (
    <div className="mt-3">
      {currentChannelMessages.map((message) => (
        <div key={message.id}>{message}</div>
      ))}
    </div>
  );
};

export default Messages;
