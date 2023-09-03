import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';

const Channels = () => {
  const { t } = useTranslation();
  const { channels, currentChannelId } = useSelector((state) => state.channelsReducer);
  const dispatch = useDispatch();
  const channelsBoxRef = useRef(null);

  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleModal = (typechannel, idChannel) => {
    dispatch(modalsActions.setShow(true));
    dispatch(modalsActions.setType(typechannel));
    dispatch(modalsActions.setChannelId(idChannel));
    setOpenMenuId(null);
  };

  const handler = (id) => {
    dispatch(channelsActions.setCurrentChannel(id));
    setOpenMenuId(null);
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
        const dropdownButtonClass = cn('flex-grow-0', 'dropdown-toggle', 'dropdown-toggle-split', 'btn', {
          'btn-secondary': channel.id === currentChannelId,
        });

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
              <div className="dropdown">
                <button
                  className={dropdownButtonClass}
                  type="button"
                  id={`dropdownMenuButton-${channel.id}`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() => toggleMenu(channel.id)}
                >
                  <span className="visually-hidden">{t('modal.manageChannel')}</span>
                </button>
                {openMenuId === channel.id && (
                <div
                  aria-labelledby="react-aria3209376880-1"
                  className="dropdown-menu show"
                  data-popper-reference-hidden="false"
                  data-popper-escaped="false"
                  data-popper-placement="bottom-end"
                  style={{ position: 'absolute', inset: '0px 0px auto auto', transform: 'translate(0px, 40px)' }}
                >
                  <button data-rr-ui-dropdown-item="" className="dropdown-item" type="button" tabIndex={0} onClick={() => handleModal('remove', channel.id)}>{t('delete')}</button>
                  <button data-rr-ui-dropdown-item="" className="dropdown-item" type="button" tabIndex={0} onClick={() => handleModal('rename', channel.id)}>{t('rename')}</button>
                </div>
                )}
              </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Channels;
