import { Outlet } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import authContext from '../context';
import axios from 'axios';
import apiPath from '../../routes.js';
import { actions as channelsActions } from '../../Slices/channelsSlice.js';
import { actions as messagesActions } from '../../Slices/messagesSlice.js';
import Channels from '../Channels';
import Messages from '../Messages';
import MessageForm from '../MessageForm';

const { getData } = apiPath;

const MainPage = () => {
  const context = useContext(authContext);
  const { currentToken, logout } = context;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(getData(), {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      const {
        channels,
        messages,
      } = data;

      dispatch(channelsActions.setChannels(channels));
      dispatch(messagesActions.setMessages(messages));
    };

    fetchData();
  });
  
  return (
    <Container fluid>
    <header className="App-header">
      <h1>
        Добро пожаловать в чат Максима Иноземцева
      </h1>
      <Row>
          <Col xs={12} md={4}>
            <Channels />
          </Col>
          <Col xs={12} md={8}>
            <Messages />
            <MessageForm />
          </Col>
        </Row>
      <button onClick={logout}>
      Выйти
      </button>
    </header>
    <Outlet />
  </Container>
  )
};

export default MainPage;
