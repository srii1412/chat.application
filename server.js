const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Store connected users
const users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user registration
  socket.on('register', (username) => {
    users[username] = socket.id; // Map username to socket ID
    socket.username = username;
    console.log(`${username} connected with ID: ${socket.id}`);
  });

  // Handle private messages
  socket.on('private message', ({ to, message }) => {
    const recipientSocketId = users[to];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('private message', {
        from: socket.username,
        message,
      });
    } else {
      socket.emit('error', `User ${to} is not online.`);
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`${socket.username} disconnected`);
    delete users[socket.username];
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
