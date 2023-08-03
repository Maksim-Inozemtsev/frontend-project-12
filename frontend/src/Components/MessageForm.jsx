import React, { useContext } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Formik, Field } from 'formik';
import authContext from './context';
import { SocketContext } from './socketContext';

const MessageForm = () => {
  const { currentChannel } = useSelector(state => state.channelsReducer);
  const { messages } = useSelector(state => state.messagesReducer);
  const context = useContext(authContext);
  const socket = useContext(SocketContext);
  const { currentUser } = context;
  
  const myHandleSubmit = (values, action) => {
    const newMessage = { body: `${values.message}`, channelId: `${currentChannel}`, username: `${currentUser}` }
    socket.emit('newMessage', newMessage);
    action.resetForm();
  };

  return (
    <Formik initialValues={{ message: '' }} onSubmit={myHandleSubmit}>
    {({ handleSubmit, isSubmitting, handleChange, values }) => (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col xs={12} md={8}>
          <Field
            name="message"
            type="text"
            id="message"
            placeholder="Введите сообщение..."
            value={values.message}
            onChange={handleChange}
          />
        </Col>
        <Col xs={12} md={4}>
          <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
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
