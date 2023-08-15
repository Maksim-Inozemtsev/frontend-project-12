import React, { useState, useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocketContext } from '../socketContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalAddChannel = ({ show, onHide }) => {
    const { t } = useTranslation();
    const socket = useContext(SocketContext);
    const [channelName, setChannelName] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);
    const notify = (arg) => toast(arg);

    const { channels } = useSelector((state) => state.channelsReducer);

    useEffect(() => {
      if (show && inputRef.current) {
        inputRef.current.focus();
      }
    }, [show]);
  
    const handleAddClick = () => {
      if (channelName.trim() !== '') {
        const newChannel = { name: channelName };
        if (!channels.some((el) => el.name === channelName)) {
          try {
            socket.emit('newChannel', newChannel);
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
                  notify(t('toastify.addChannel'));
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
          <Button variant="primary" onClick={() => { handleAddClick(); notify(t('toastify.addChannel')); }}>{t('add')}</Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
  export default ModalAddChannel;