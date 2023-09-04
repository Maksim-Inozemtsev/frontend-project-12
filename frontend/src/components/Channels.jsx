import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dropdown, ButtonGroup,
} from 'react-bootstrap';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';

const Channels = () => {
  const { t } = useTranslation();
  const { channels, currentChannelId } = useSelector((state) => state.channelsReducer);
  const dispatch = useDispatch();
  const channelsBoxRef = useRef(null);

  const handleModal = (typechannel, idChannel) => {
    dispatch(modalsActions.setShow(true));
    dispatch(modalsActions.setType(typechannel));
    dispatch(modalsActions.setChannelId(idChannel));
  };

  const handler = (id) => {
    dispatch(channelsActions.setCurrentChannel(id));
  };

  useEffect(() => {
    channelsBoxRef.current?.lastChild?.scrollIntoView({ behavior: 'smooth' });
  }, [channels]);

  return (
    <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block" ref={channelsBoxRef}>
      {channels.map((channel) => {
        const buttonClass = cn('w-100', 'rounded-0', 'text-start', 'btn', {
          'btn-secondary': channel.id === currentChannelId,
        });
        const dropdownButtonClass = (id) => (id === currentChannelId
          ? 'secondary'
          : 'light');

        return (
          <li key={channel.id} className="nav-item w-100">
            <div role="group" className="d-flex dropdown btn-group">
              <button
                type="button"
                className={buttonClass}
                onClick={() => handler(channel.id)}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                <span className="me-1">#</span>
                {channel.name}
              </button>
              {channel.removable && (
              <Dropdown key={`dropdownMenuButton-${channel.id}`} as={ButtonGroup} className="d-flex">
                <Dropdown.Toggle
                  className="flex-grow-0"
                  variant={dropdownButtonClass(channel.id)}
                  split
                >
                  <span className="visually-hidden">{t('chat.channels.manageChannels')}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ position: 'absolute', inset: '0px 0px auto auto', transform: 'translate(0px, 40px)' }}>
                  <Dropdown.Item onClick={() => handleModal('remove', channel.id)}>{t('delete')}</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleModal('rename', channel.id)}>{t('rename')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Channels;
