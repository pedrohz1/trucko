import express from 'express';
import path from 'path'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

import dotenv from 'dotenv'
const dotEnv = config();

const app = express();
const server = createServer(app);
const io = new Server(server);
import Router from './server/routes/gameRouter.js';

import { Game } from "./server/models/Game.js"

app.use(express.static(path.join(__dirname, './client/public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');

app.use("/", router);

const rooms = new Map();

io.on('connection', (socket) => {

  socket.on("roomsList", () => {
    const lista = [];

    rooms.forEach((objectRoom, roomName) => {
      lista.push([roomName, roomName.numPlayers])
    })

    io.emit("roomList", lista);
  })

  socket.on("createRoom", (roomName, playerName) => {
    if(rooms.has(roomName)){
      io.emit("createRoom", false);
      return;
    };

    rooms.set(roomName, new Room(roomName, playerName, 2));
    socket.join(roomName);

    console.log(rooms.get(roomName))

    socket.emit("createRoom", true);
  });


  socket.on("joinRoom", (roomName, playerName) => {
    if(!rooms.has(roomName)){
      socket.emit("joinRoom", false);
      return;
    };

    socket.join(roomName);
    rooms.get(roomName).addPlayer(playerName);

    socket.emit("joinRoom", true);

    console.log(`${playerName} entrou em ${JSON.stringify(rooms.get(roomName))}`);
  });

  socket.on("disconnect", () => {
    console.log(io.sockets.adapter.rooms.keys());
  });
});



server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});