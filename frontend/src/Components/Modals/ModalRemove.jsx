import React, { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocketContext } from '../socketContext';

const ModalRemoveChannel = ({ show, channelId, onHide }) => {
    const socket = useContext(SocketContext);
  
    const handleRemoveClick = (id) => {
      socket.emit('removeChannel', { id });
      onHide();
    };
  
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Удалить канал</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p className="lead">Уверены?</p>
            <div className="d-flex justify-content-end">
                <Button type="button" className="me-2 btn btn-secondary" onClick={onHide}>Отменить</Button>
                <Button type="button" className="btn btn-danger" onClick={handleRemoveClick(channelId)}>Удалить</Button>
            </div>
        </Modal.Body>
      </Modal>
    );
  };
  
  export default ModalRemoveChannel;