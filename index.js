const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let PORT = process.env.PORT || 3000;

let users = [];
let messages = [];

io.on('connection', (socket) => {
  console.log('Novo usuário conectado', socket.id);

  socket.on('disconnect', () => {
    console.log('Usuário desconectado!');
  });

  socket.on('join room', (room) => {
    socket.join(room);

    console.log(room);

    const userRoom = users.find((user) => user.room == room);
    if (userRoom) {
      userRoom.socket_id = socket.id;
    } else {
      users.push({
        room,
        socket_id: socket.id,
      });
    }
  });

  socket.on('message', (data) => {
    const { room, message, author } = data;
    const msg = {
      room,
      text: message,
      author,
    };
    console.log(message, author);
    messages.push(msg);
    io.to(room).emit('message', msg);
  });
});

server.listen(PORT, () => {
  console.log('Server is running!');
});
