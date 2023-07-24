import { Outlet, useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();
  return (
    <>
    <header className="App-header">
      <h1>
        Добро пожаловать в чат Максима Иноземцева
      </h1>
      <button onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login', { replace: false })
      }}>
      Выйти
      </button>
    </header>
    <Outlet />
  </>
  )
};

export default MainPage;
