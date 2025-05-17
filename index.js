// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
}
});

const users = {};

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId || socket.id;
  console.log('User connected:', userId);

  if (users[userId]) {
    // Send back stored data to that user on connect
    socket.emit('initialUserData', users[userId]);
  }

  socket.on('updateStatus', ({ lat, lng, servicios }) => {
    users[userId] = { id: userId, lat, lng, servicios };
    io.emit('usersUpdate', Object.values(users));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', userId);
    // Keep the data for reconnection
  });
});


server.listen(3000, () => {
  console.log('Socket.IO server running on port 3000');
});
