import { io } from 'socket.io-client';
import { createContext, useMemo } from 'react';

export const socket = io();
const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const handleSocket = (action, data) => new Promise((resolve, reject) => {
    socket.timeout(1000).emit(action, data, (error, response) => {
      if (response?.status === 'ok') {
        resolve(response?.data);
      } else {
        reject(error);
      }
    });
  });

  const data = useMemo(() => ({
    socket, handleSocket,
  }), []);

  return (
    <SocketContext.Provider value={data}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
