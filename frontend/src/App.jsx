import { useContext } from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter, Routes, Route, Navigate, Outlet,
} from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import filter from 'leo-profanity';
import i18next from './i18next';
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import NotFoundPage from './pages/NotFoundPage';
import MainPage from './pages/MainPage';
import { actions as messagesActions } from './slices/messagesSlice.js';
import { actions as channelsActions } from './slices/channelsSlice.js';
import authContext, { AuthContextProvider } from './context/AuthContext';
import { SocketContextProvider, socket } from './context/SocketContext';
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
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  environment: 'production',
};

const App = () => {
  filter.add(filter.getDictionary('en'));
  filter.add(filter.getDictionary('ru'));

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18next}>
              <SocketContextProvider>
                <AuthContextProvider>
                  <Routes>
                    <Route path="/" element={<UseOutlet />}>
                      <Route path="" element={<MainPage />} />
                    </Route>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </AuthContextProvider>
              </SocketContextProvider>
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default App;
