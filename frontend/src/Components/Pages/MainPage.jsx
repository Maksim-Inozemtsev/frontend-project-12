import { useEffect, useContext, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Navbar, Container, Row, Col } from 'react-bootstrap';
import authContext from '../context';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import apiPath from '../../routes.js';
import { actions as channelsActions } from '../../Slices/channelsSlice.js';
import { actions as messagesActions } from '../../Slices/messagesSlice.js';
import ModalAddChannel from '../Modals/ModalAdd';
import Channels from '../Channels';
import Messages from '../Messages';
import MessageForm from '../MessageForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


const { getData } = apiPath;

const MainPage = () => {
  const { t } = useTranslation();
  const context = useContext(authContext);
  const { currentToken, logout } = context;
  const dispatch = useDispatch();
  const notify = (e) => toast(e);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(getData(), {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        const {
          channels,
          currentChannelId,
          messages,
        } = data;

        dispatch(channelsActions.setChannels(channels));
        dispatch(channelsActions.setCurrentChannel(currentChannelId));
        dispatch(messagesActions.setMessages(messages));
      } catch (error) {
        notify(error.message);
      }
    };

    fetchData();
  }, []);

  const { channels } = useSelector((state) => state.channelsReducer);
  const prevChannelsLength = useRef(channels.length);

  useEffect(() => {
    if (channels.length > prevChannelsLength.current) {
      dispatch(channelsActions.setCurrentChannel(channels[channels.length - 1].id));
    }
    prevChannelsLength.current = channels.length;
  }, [channels]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Container fluid id="chat" className="d-flex flex-column h-100 bg-light">
      <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <Container>
          <Navbar.Brand as="a" href="/">{t('title')}</Navbar.Brand>
          <Button type="button" className="btn btn-primary" onClick={logout}>{t('logOut')}</Button>
        </Container>
      </Navbar>
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
          <Col className="border-end px-0 bg-light flex-column d-flex" xs={4} md={2}>
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>{t('channels')}</b>
              <Button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={() => setIsModalOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" fill="white" />
                </svg>
                <span className="visually-hidden">+</span>
              </Button>
              <ModalAddChannel
                show={isModalOpen}
                onHide={() => setIsModalOpen(false)}
              />
            </div>
            <Channels />
          </Col>
          <Col xs={12} md={8}>
            <div
              style={{
              height: '60vh',
              overflowY: 'auto',
              }}
            >
              <Messages />
            </div>  
              <div
                style={{
                marginTop: 'auto',
                padding: '0 20px 20px',
                }}
              >
                <MessageForm />
              </div>
          </Col>
        </Row>
        </Container>
        <ToastContainer />
    </Container>
  )
};

export default MainPage;
