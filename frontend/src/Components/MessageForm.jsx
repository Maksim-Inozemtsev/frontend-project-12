import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const MessageForm = () => {
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Здесь будет код обработки отправки сообщения
    console.log('Отправлено сообщение:', message);
    setMessage('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col xs={12} md={8}>
          <Form.Control
            type="text"
            placeholder="Введите сообщение..."
            value={message}
            onChange={handleChange}
          />
        </Col>
        <Col xs={12} md={4}>
          <Button type="submit" variant="primary" className="w-100">
            Отправить
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default MessageForm;
