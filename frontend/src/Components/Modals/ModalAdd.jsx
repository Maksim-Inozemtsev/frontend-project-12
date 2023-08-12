import React, { useState, useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocketContext } from '../socketContext';

const ModalAddChannel = ({ show, onHide }) => {
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
  
    const handleAddClick = () => {
      if (channelName.trim() !== '') {
        const newChannel = { name: channelName };
        if (!channels.some((el) => el.name === channelName)) {
          socket.emit('newChannel', newChannel);
          setChannelName('');
          setError('');
          onHide();
        } else {
          setError('Канал с таким именем уже существует');
        }
      } else {
        setError('Необходимо ввести название канала');
      }
    };
  
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить канал</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Название канала"
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
          <Button variant="secondary" onClick={onHide}>Отменить</Button>
          <Button variant="primary" onClick={handleAddClick}>Добавить</Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
  export default ModalAddChannel;