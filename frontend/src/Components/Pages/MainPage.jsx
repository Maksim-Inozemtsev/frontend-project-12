import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import authContext from '../context';

const MainPage = () => {
  const context = useContext(authContext);
  const { logout } = context;
  return (
    <>
    <header className="App-header">
      <h1>
        Добро пожаловать в чат Максима Иноземцева
      </h1>
      <button onClick={logout}>
      Выйти
      </button>
    </header>
    <Outlet />
  </>
  )
};

export default MainPage;
