import express from 'express';
import path from 'path'

import { createServer } from 'node:http'
import { Server } from 'socket.io'

const app = express();
const server = createServer(app);
const io = new Server(server);

import { router } from './server/routes/gameRouter.js';
import { roomController } from './server/controllers/roomController.js';

import url from 'url';
import { gameController } from './server/controllers/gameController.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, './client/public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');

app.use("/", router);

const rooms = new Map();
roomController(io, rooms);
gameController(io, rooms);

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});