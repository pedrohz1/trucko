const express = require('express');
const path = require('path');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const server = createServer(app);
const io = new Server(server);
const router = require('./routes/gameRouter');

app.use(express.static(path.join(__dirname, '../client/public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'ejs');

app.use("/", router);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.join("room 1");
  console.log(socket.rooms);

  socket.on("disconnect", (reason) => {
    console.log(io.sockets.adapter.rooms.keys())
  })
});


mongoose.connect(process.env.MONGOCONNECT)
  .then(() => {
    console.log('Mongo conectado');
  })
  .catch((err) => {
    console.error('Erro ao conectar:', err);
  });

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});