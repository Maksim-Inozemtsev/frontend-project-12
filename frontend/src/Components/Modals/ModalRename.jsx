import React, { useState, useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocketContext } from '../socketContext';
import { useTranslation } from 'react-i18next';

const ModalRenameChannel = ({ show, channelId, onHide }) => {
    const { t } = useTranslation();
    const socket = useContext(SocketContext);
    const [channelName, setChannelName] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const { channels } = useSelector((state) => state.channelsReducer);

    useEffect(() => {
      if (show && inputRef.current) {
        inputRef.current.focus();
      }
    }, [show]);
  
    const handleRenameClick = () => {
      if (channelName.trim() !== '') {
        const data = { id: channelId, name: channelName };
        if (!channels.some((el) => el.name === channelName)) {
          socket.emit('renameChannel', data);
          setChannelName('');
          setError('');
          onHide();
        } else {
          setError(t('errors.uniqueChannel'));
        }
      } else {
        setError(t('errors.channelNameRequired'));
      }
    };
  
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal.renameChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder=""
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleRenameClick();
                }
            }}
            isInvalid={!!error}
            ref={inputRef}
          />
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>{t('cancel')}</Button>
          <Button variant="primary" onClick={handleRenameClick}>{t('rename')}</Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
  export default ModalRenameChannel;