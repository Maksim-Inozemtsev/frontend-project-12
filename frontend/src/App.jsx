import { useContext } from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter, Routes, Route, Navigate, Outlet,
} from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import i18next from './i18next';
import LoginForm from './components/pages/LoginForm';
import SignupForm from './components/pages/SignupForm';
import NotFoundPage from './components/pages/NotFoundPage';
import MainPage from './components/pages/MainPage';
import { actions as messagesActions } from './slices/messagesSlice.js';
import { actions as channelsActions } from './slices/channelsSlice.js';
import authContext, { ContextProvider } from './components/AuthContext';
import { SocketContext, socket } from './components/socketContext';
import store from './slices/store.js';
import './App.css';

socket.on('newMessage', (message) => {
  store.dispatch(messagesActions.setMessage(message));
});
socket.on('newChannel', (channel) => {
  store.dispatch(channelsActions.addChannel(channel));
});
socket.on('removeChannel', (channel) => {
  store.dispatch(channelsActions.removeChannel(channel));
});
socket.on('renameChannel', (channel) => {
  store.dispatch(channelsActions.renameChannel(channel));
});

const UseOutlet = () => {
  const { loggedIn } = useContext(authContext);
  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

const rollbarConfig = {
  accessToken: 'd6ec948d5561494f9834dca0c71be392',
  environment: 'production',
};

const App = () => (
  <RollbarProvider config={rollbarConfig}>
    <ErrorBoundary>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            <SocketContext.Provider value={socket}>
              <ContextProvider>
                <Routes>
                  <Route path="/" element={<UseOutlet />}>
                    <Route path="" element={<MainPage />} />
                  </Route>
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/signup" element={<SignupForm />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </ContextProvider>
            </SocketContext.Provider>
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </ErrorBoundary>
  </RollbarProvider>
);

export default App;
