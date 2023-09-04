import React, { useContext, useEffect, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Formik, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import filter from 'leo-profanity';
import authContext from '../context/AuthContext';
import SocketContext from '../context/SocketContext';

const MessageForm = () => {
  const { t } = useTranslation();
  const { currentChannelId } = useSelector((state) => state.channelsReducer);
  const { currentUser } = useContext(authContext);
  const { handleSocket } = useContext(SocketContext);
  const notify = (e) => toast(e);

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentChannelId]);

  const myHandleSubmit = async (values, action) => {
    const filteredMessage = filter.clean(values.message);
    const newMessage = { body: filteredMessage, channelId: `${currentChannelId}`, username: `${currentUser}` };
    try {
      await handleSocket('newMessage', newMessage);
      action.resetForm();
    } catch (error) {
      notify(error.message);
    }
    inputRef.current.focus();
  };

  return (
    <div className="mt-auto px-5 py-3">
      <Formik initialValues={{ message: '' }} onSubmit={myHandleSubmit}>
        {({
          handleSubmit, isSubmitting, handleChange, values,
        }) => (
          <Form className="py-1 border rounded-2" onSubmit={handleSubmit}>
            <div className="input-group has-validation">
              <Field
                aria-label="Новое сообщение"
                className="border-0 p-0 ps-2 form-control"
                name="message"
                type="text"
                id="message"
                placeholder={t('messagePlaceholder')}
                value={values.message}
                onChange={handleChange}
                innerRef={inputRef}
              />
              <Button type="submit" variant="primary" className="btn btn-group-vertical" disabled={isSubmitting || !values.message.trim()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                </svg>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MessageForm;
