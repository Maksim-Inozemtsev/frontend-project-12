import React, { useContext } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Formik, Field } from 'formik';
import io from 'socket.io-client';
import { actions as messagesActions } from '../Slices/messagesSlice.js';
import channelsReducer from '../Slices/channelsSlice.js';
import authContext from './context';

const { currentChannel } = channelsReducer;

const socket = io();

const MessageForm = () => {
  const context = useContext(authContext);
  const { currentUser } = context;
  const dispatch = useDispatch();
  
  const myHandleSubmit = (event) => {
    event.preventDefault();
    const newMessage = { body: `${event.target.value}`, channelId: `${currentChannel}`, username: `${currentUser}` }
    dispatch(messagesActions.setMessage(newMessage));
    socket.emit('newMessage', newMessage);
  };

  return (
    <Formik initialValues={{ message: '' }} onSubmit={myHandleSubmit}>
    {({ handleSubmit, isSubmitting,  resetForm}) => (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col xs={12} md={8}>
          <Field
            name="message"
            type="text"
            id="message"
            placeholder="Введите сообщение..."
          />
        </Col>
        <Col xs={12} md={4}>
          <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting} onClick={() => resetForm()}>
            Отправить
          </Button>
        </Col>
      </Row>
    </Form>
    )}
    </Formik>
  );
};

export default MessageForm;
