import React, { useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Formik, Field } from 'formik';
import authContext from './context';
import { SocketContext } from './socketContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import filter from 'leo-profanity';

const MessageForm = () => {
  const { t } = useTranslation();
  const { currentChannelId } = useSelector((state) => state.channelsReducer);
  const context = useContext(authContext);
  const socket = useContext(SocketContext);
  const { currentUser } = context;
  const notify = (e) => toast(e);
  filter.add(filter.getDictionary('en'));
  filter.add(filter.getDictionary('ru'));

  const addMessage = (message) => new Promise((resolve, reject) => {
    socket.timeout(1000).emit('newMessage', message, (error, response) => (
      response?.status === 'ok' ? resolve(response?.data) : reject(error)
    ));
  });

  const myHandleSubmit = async (values, action) => {
    const filteredMessage = filter.clean(values.message);
    const newMessage = { body: filteredMessage, channelId: `${currentChannelId}`, username: `${currentUser}` };
    try {
      await addMessage(newMessage);
    } catch (error) {
      notify(error.message);
    }
    action.resetForm();
  };

  return (
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
  );
};

export default MessageForm;
