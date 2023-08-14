import React, { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocketContext } from '../socketContext';
import { useTranslation } from 'react-i18next';

const ModalRemoveChannel = ({ show, channelId, onHide }) => {
  const { t } = useTranslation();  
  const socket = useContext(SocketContext);
  
    const handleRemove = (id) => {
      socket.emit('removeChannel', { id });
      onHide();
    };
  
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal.deleteChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p className="lead">{t('modal.confirm')}</p>
            <div className="d-flex justify-content-end">
                <Button type="button" className="me-2 btn btn-secondary" onClick={onHide}>{t('cancel')}</Button>
                <Button type="button" className="btn btn-danger" onClick={() => handleRemove(channelId)}>{t('delete')}</Button>
            </div>
        </Modal.Body>
      </Modal>
    );
  };
  
  export default ModalRemoveChannel;