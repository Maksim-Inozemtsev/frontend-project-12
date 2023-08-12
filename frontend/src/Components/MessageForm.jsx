import React, { useContext } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Formik, Field } from 'formik';
import authContext from './context';
import { SocketContext } from './socketContext';

const MessageForm = () => {
  const { currentChannelId } = useSelector(state => state.channelsReducer);
  const { messages } = useSelector(state => state.messagesReducer);
  const context = useContext(authContext);
  const socket = useContext(SocketContext);
  const { currentUser } = context;
  
  const myHandleSubmit = (values, action) => {
    const newMessage = { body: `${values.message}`, channelId: `${currentChannelId}`, username: `${currentUser}` }
    socket.emit('newMessage', newMessage);
    action.resetForm();
  };

  return (
    <Formik initialValues={{ message: '' }} onSubmit={myHandleSubmit}>
    {({ handleSubmit, isSubmitting, handleChange, values }) => (
    <Form className="py-1 border rounded-2" onSubmit={handleSubmit}>
      <div className="input-group has-validation">
        <Field
          className="border-0 p-0 ps-2 form-control"
          name="message"
          type="text"
          id="message"
          placeholder="Введите сообщение..."
          value={values.message}
          onChange={handleChange}
        />
        <Button type="submit" variant="primary" className="btn btn-group-vertical" disabled={isSubmitting || !values.message.trim()}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
          </svg>
          <span className="visually-hidden">Отправить</span>
        </Button>
      </div>
    </Form>
    )}
    </Formik>
  );
};

export default MessageForm;
