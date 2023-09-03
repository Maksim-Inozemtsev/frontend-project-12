import { useEffect, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, Navbar, Container, Row, Col,
} from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import authContext from '../context/AuthContext';
import apiPath from '../routes.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import ModalComponent from '../components/ModalComponent';
import Channels from '../components/Channels';
import Messages from '../components/Messages';
import MessageForm from '../components/MessageForm';
import 'react-toastify/dist/ReactToastify.css';

const { getData } = apiPath;

const MainPage = () => {
  const { t } = useTranslation();
  const context = useContext(authContext);
  const { currentToken, logout } = context;
  const dispatch = useDispatch();
  const notify = (e) => toast(e);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(getData(), {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        setLoading(false);
        const {
          channels,
          currentChannelId,
          messages,
        } = data;
        dispatch(channelsActions.setChannels(channels));
        dispatch(channelsActions.setCurrentChannel(currentChannelId));
        dispatch(messagesActions.setMessages(messages));
      } catch (error) {
        setLoading(false);
        notify(error.message);
        if (error.response && error.response.status === 401) {
          logout();
        }
      }
    };

    fetchData();
  }, []);

  const handleModal = () => {
    dispatch(modalsActions.setShow(true));
    dispatch(modalsActions.setType('add'));
  };

  return (
    <Container style={{ height: '100vh' }}>
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 'calc(50vh - 50px)',
        }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Container fluid id="chat" className="d-flex flex-column h-100 bg-light">
          <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <Container>
              <Navbar.Brand as="a" href="/">{t('title')}</Navbar.Brand>
              <Button type="button" className="btn btn-primary" onClick={logout}>{t('logOut')}</Button>
            </Container>
          </Navbar>
          <Container className="h-100 my-4 overflow-hidden rounded shadow">
            <Row className="h-100 bg-white flex-md-row">
              <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
                <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                  <b>{t('channels')}</b>
                  <Button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={() => handleModal()}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" fill="white" />
                    </svg>
                    <span className="visually-hidden">+</span>
                  </Button>
                </div>
                <Channels />
              </Col>
              <Col className="col p-0 h-100">
                <div className="d-flex flex-column h-100">
                  <Messages />
                  <MessageForm />
                </div>
              </Col>
            </Row>
          </Container>
          <ModalComponent />
          <ToastContainer />
        </Container>
      )}
    </Container>
  );
};

export default MainPage;
