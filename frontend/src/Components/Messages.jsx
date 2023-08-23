import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Messages = () => {
  const { t } = useTranslation();
  const { channels, currentChannelId } = useSelector((state) => state.channelsReducer);
  const { messages } = useSelector((state) => state.messagesReducer);
  const currentChannelMessages = messages.filter((el) => el.channelId === currentChannelId?.toString());
  const currentChannel = channels.find((item) => item.id == currentChannelId);

  return (
    <div className="mt-3">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0"><b># {currentChannel && currentChannel.name}</b></p><span className="text-muted">{t('messages.key', { count: currentChannelMessages.length })}</span>
      </div>
      {currentChannelMessages.map((message) => <div key={message.id}><b>{message.username}:</b> {message.body}</div>)}
    </div>
  );
};

export default Messages;
