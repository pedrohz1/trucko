const express = require('express');
const path = require('path');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const dotenv = require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server);
const router = require('./server/routes/gameRouter');

app.use(express.static(path.join(__dirname, './client/public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');

app.use("/", router);

/*
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.join("room 1");
  console.log(socket.rooms);

  socket.on("disconnect", () => {
    console.log(io.sockets.adapter.rooms.keys());
  });
});
*/

const rooms = new Set();

//Ricardo: depois, mudar o set de String para set de objetos Room
io.on('connection', (socket) => {
  socket.on("createRoom", (roomName, playerName) => {
    if(rooms.has(roomName)){
      io.emit("createRoom", false);
      return;
    };

    rooms.add(roomName);
    socket.join(roomName);

    io.emit("createRoom", true);
  });

  socket.on("disconnect", () => {
    console.log(io.sockets.adapter.rooms.keys());
  });
});



server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});