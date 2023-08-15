import React, { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocketContext } from '../socketContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalRemoveChannel = ({ show, channelId, onHide }) => {
  const { t } = useTranslation();  
  const socket = useContext(SocketContext);
  const notify = (arg) => toast(arg);
  
  const handleRemove = (id) => {
    try {
      socket.emit('removeChannel', { id });
    } catch (err) {
      notify(err.message);
    }
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
          <Button variant="secondary" className="me-2 btn btn-secondary" onClick={onHide}>{t('cancel')}</Button>
          <Button variant="primary" className="btn btn-danger" onClick={() => { handleRemove(channelId); notify(t('toastify.deleteChannel')); }}>{t('delete')}</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
  
export default ModalRemoveChannel;