import { useContext } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginForm from './Components/Pages/LoginForm';
import SignupForm from './Components/Pages/SignupForm';
import NotFoundPage from './Components/Pages/NotFoundPage';
import MainPage from './Components/Pages/MainPage';
import authContext, { ContextProvider } from './Components/context';
import store from './Slices/store.js';
import './App.css';

const UseOutlet = () => {
  const { loggedIn } = useContext(authContext);
  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
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
      </Provider>
    </BrowserRouter> 
  );
}

export default App;
