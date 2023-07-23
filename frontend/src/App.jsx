import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './Components/Pages/form';
import NotFoundPage from './Components/Pages/NotFoundPage';
import MainPage from './Components/Pages/MainPage';
import './App.css';

function App() {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <MainPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter> 
  );
}

export default App;
