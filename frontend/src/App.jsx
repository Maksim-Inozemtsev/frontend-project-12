import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Form from './Components/Pages/form';
import NotFoundPage from './Components/Pages/NotFoundPage';
import MainPage from './Components/MainPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Form />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter> 
  );
}

export default App;
