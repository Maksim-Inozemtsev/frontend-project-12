import React, { useState, useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocketContext } from '../socketContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import filter from 'leo-profanity';

const ModalRenameChannel = ({ show, channelId, onHide }) => {
    const { t } = useTranslation();
    const socket = useContext(SocketContext);
    const [channelName, setChannelName] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);
    const notify = (arg) => toast(arg);
    filter.add(filter.getDictionary('en'));
    filter.add(filter.getDictionary('ru'));

    const { channels } = useSelector((state) => state.channelsReducer);

    useEffect(() => {
      if (show && inputRef.current) {
        inputRef.current.focus();
      }
    }, [show]);
  
    const renameChannel =  (renameData) => new Promise((resolve, reject) => {
      socket.timeout(1000).emit('renameChannel', renameData, (error, response) => (
        response?.status === 'ok' ? resolve(response?.data) : reject(error)
      ));
    });
    
    const handleRenameClick = async () => {
      if (channelName.trim() !== '') {
        const data = { id: channelId, name: filter.clean(channelName) };
        if (!channels.some((el) => el.name === channelName)) {
          try {
            await renameChannel(data);
            notify(t('toastify.renameChannel'))
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
          <Modal.Title>{t('modal.renameChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className="visually-hidden" htmlFor="name">
            {t('modal.addChannelName')}
          </label>
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
            id="name"
          />
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>{t('cancel')}</Button>
          <Button variant="primary" onClick={() => handleRenameClick()}>{t('rename')}</Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
  export default ModalRenameChannel;