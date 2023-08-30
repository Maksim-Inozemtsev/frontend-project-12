import React, {
  useState, useEffect, useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import filter from 'leo-profanity';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { handleSocket } from '../context/socketContext';

const ModalComponent = () => {
  const { t } = useTranslation();
  const { channels } = useSelector((state) => state.channelsReducer);
  const { show, type, channelId } = useSelector((state) => state.modalsReducer);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [channelName, setChannelName] = useState('');
  const [error, setError] = useState('');

  const notify = (arg) => toast(arg);
  filter.add(filter.getDictionary('en'));
  filter.add(filter.getDictionary('ru'));

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  const onHide = () => {
    dispatch(modalsActions.setShow(false));
  };

  const handleAddRename = async () => {
    if (channelName.trim() !== '') {
      const data = type === 'add' ? { name: filter.clean(channelName) } : { id: channelId, name: filter.clean(channelName) };
      if (!channels.some((el) => el.name === channelName)) {
        try {
          if (type === 'add') {
            await handleSocket('newChannel', data);
          } else {
            await handleSocket('renameChannel', data);
          }
          notify(type === 'add' ? t('toastify.addChannel') : t('toastify.renameChannel'));
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

  const handleRemove = async () => {
    try {
      await handleSocket('removeChannel', { id: channelId });
      notify(t('toastify.deleteChannel'));
    } catch (err) {
      notify(err.message);
    }
    onHide();
  };

  switch (type) {
    case 'add':
    case 'rename': {
      return (
        <Modal show={show} onHide={onHide}>
          <Modal.Header closeButton>
            <Modal.Title>{type === 'add' ? t('modal.addChannel') : t('modal.renameChannel')}</Modal.Title>
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
                  handleAddRename();
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
            <Button variant="primary" onClick={() => handleAddRename()}>{type === 'add' ? t('add') : t('rename')}</Button>
          </Modal.Footer>
        </Modal>
      );
    }
    case 'remove': {
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
    }
    default:
      return null;
  }
};

export default ModalComponent;
