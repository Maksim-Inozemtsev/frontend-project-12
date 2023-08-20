import { useContext } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18next from './i18next';
import LoginForm from './Components/Pages/LoginForm';
import SignupForm from './Components/Pages/SignupForm';
import NotFoundPage from './Components/Pages/NotFoundPage';
import MainPage from './Components/Pages/MainPage';
import { actions as messagesActions } from './Slices/messagesSlice.js';
import { actions as channelsActions } from './Slices/channelsSlice.js';
import authContext, { ContextProvider } from './Components/context';
import { SocketContext, socket } from './Components/socketContext';
import store from './Slices/store.js';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
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
}

const rollbarConfig = {
  accessToken: 'd6ec948d5561494f9834dca0c71be392',
  environment: 'production',
};

function App() {
  return (
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
}

export default App;
