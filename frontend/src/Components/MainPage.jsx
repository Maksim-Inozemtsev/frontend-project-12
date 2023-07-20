import { Outlet, useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();
  return (
    <>
    <header className="App-header">
      <h1>
        Добро пожаловать в чат Максима Иноземцева
      </h1>
    </header>
    <button onClick={() => navigate('/login', { replace: false })}>
      Зарегистрироваться
    </button>
    <Outlet />
  </>
  )
};

export default MainPage;
