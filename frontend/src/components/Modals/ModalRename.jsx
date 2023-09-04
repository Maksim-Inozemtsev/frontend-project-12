import React, {
  useState, useEffect, useRef, useContext,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import filter from 'leo-profanity';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import SocketContext from '../../context/SocketContext';

const ModalRename = () => {
  const { t } = useTranslation();

  const schema = yup.object().shape({
    channelName: yup.string().min(3, t('errors.minMaxName')).max(20, t('errors.minMaxName')),
  });

  const { channels } = useSelector((state) => state.channelsReducer);
  const { show, type, channelId } = useSelector((state) => state.modalsReducer);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { handleSocket } = useContext(SocketContext);
  const [channelName, setChannelName] = useState('');
  const [error, setError] = useState('');

  const notify = (arg) => toast(arg);

  useEffect(() => {
    if (show && inputRef.current) {
      const currentChannel = channels.find((item) => item.id === channelId);
      setChannelName(currentChannel.name);
      inputRef.current.focus();
      setTimeout(() => {
        inputRef.current.select();
      }, 0);
    }
  }, [show]);

  const onHide = () => {
    dispatch(modalsActions.setShow(false));
  };

  const handleRename = async () => {
    if (channelName.trim() !== '') {
      try {
        await schema.validate({ channelName });
        const data = { id: channelId, name: filter.clean(channelName) };
        if (!channels.some((el) => el.name === channelName)) {
          try {
            await handleSocket('renameChannel', data);
            notify(t('toastify.renameChannel'));
          } catch (err) {
            notify(err.message);
          }
          setChannelName('');
          setError('');
          onHide();
        } else {
          setError(t('errors.uniqueChannel'));
        }
      } catch (validationError) {
        setError(validationError.message);
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
              handleRename();
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
        <Button variant="primary" onClick={() => handleRename()}>{type === 'add' ? t('add') : t('rename')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRename;
