import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginForm from './Components/Pages/Form';
import NotFoundPage from './Components/Pages/NotFoundPage';
import MainPage from './Components/Pages/MainPage';
import authContext, { ContextProvider } from './Components/context';
import './App.css';

const UseOutlet = () => {
  const { loggedIn } = useContext(authContext);
  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <ContextProvider>
        <Routes>
          <Route path="/" element={<UseOutlet />}>
            <Route path="" element={<MainPage />} />
          </Route>
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ContextProvider>
    </BrowserRouter> 
  );
}

export default App;
