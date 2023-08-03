import { useContext } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginForm from './Components/Pages/LoginForm';
import SignupForm from './Components/Pages/SignupForm';
import NotFoundPage from './Components/Pages/NotFoundPage';
import MainPage from './Components/Pages/MainPage';
import { actions as messagesActions } from './Slices/messagesSlice.js';
import authContext, { ContextProvider } from './Components/context';
import { SocketContext, socket } from './Components/socketContext';
import store from './Slices/store.js';
import './App.css';

socket.on('newMessage', (message) => {
  store.dispatch(messagesActions.setMessage(message));
});

const UseOutlet = () => {
  const { loggedIn } = useContext(authContext);
  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
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
      </Provider>
    </BrowserRouter> 
  );
}

export default App;
