import React, { useState, useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocketContext } from '../socketContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import filter from 'leo-profanity';

const ModalAddChannel = ({ show, onHide }) => {
    const { t } = useTranslation();
    const socket = useContext(SocketContext);
    const [channelName, setChannelName] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);
    const notify = (arg) => toast(arg);
    filter.loadDictionary('ru');

    const { channels } = useSelector((state) => state.channelsReducer);

    useEffect(() => {
      if (show && inputRef.current) {
        inputRef.current.focus();
      }
    }, [show]);

    const addChannel =  (channel) => new Promise((resolve, reject) => {
      socket.timeout(1000).emit('newChannel', channel, (error, response) => (
        response?.status === 'ok' ? resolve(response?.data) : reject(error)
      ));
    });

    const handleAddClick = async () => {
    if (channelName.trim() !== '') {
      const newChannel = { name: filter.clean(channelName) };
      if (!channels.some((el) => el.name === channelName)) {
        try {
          await addChannel(newChannel);
          notify(t('toastify.addChannel'));
        } catch (err) {
          notify(err.message);
        }

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
          <Modal.Title>{t('modal.addChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder={t('modal.addChannelPlaceholder')}
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddClick();
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
          <Button variant="primary" onClick={() => handleAddClick()}>{t('add')}</Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
  export default ModalAddChannel;
 