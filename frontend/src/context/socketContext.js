import { io } from 'socket.io-client';
import { createContext } from 'react';

const socket = io();
const SocketContext = createContext();

const handleSocket = (action, data) => new Promise((resolve, reject) => {
  socket.timeout(1000).emit(action, data, (error, response) => {
    if (response?.status === 'ok') {
      resolve(response?.data);
    } else {
      reject(error);
    }
  });
});

export { socket, SocketContext, handleSocket };
