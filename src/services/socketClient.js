import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
  autoConnect: true,
});

// Socket event handlers for debugging in development
if (import.meta.env.DEV) {
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('Socket reconnection attempt:', attemptNumber);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('Socket reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_failed', () => {
    console.error('Socket reconnection failed after max attempts');
  });
}

// Register user with socket connection
export const registerSocket = (userId, role) => {
  if (socket.connected) {
    socket.emit('register', { userId, role });
  } else {
    socket.once('connect', () => {
      socket.emit('register', { userId, role });
    });
  }
};

export default socket;