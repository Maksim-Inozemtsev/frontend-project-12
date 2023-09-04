import React, {
  useEffect, useRef, useContext,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import SocketContext from '../../context/SocketContext';

const ModalRemove = () => {
  const { t } = useTranslation();
  const { show, channelId } = useSelector((state) => state.modalsReducer);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { handleSocket } = useContext(SocketContext);
  const notify = (arg) => toast(arg);

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  const onHide = () => {
    dispatch(modalsActions.setShow(false));
  };

  const handleRemove = async () => {
    try {
      await handleSocket('removeChannel', { id: channelId });
      notify(t('toastify.deleteChannel'));
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
          <Button variant="primary" className="btn btn-danger" onClick={() => handleRemove()}>{t('delete')}</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRemove;
