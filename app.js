import express from 'express';
import path from 'path'

import { createServer } from 'node:http'
import { Server } from 'socket.io'

const app = express();
const server = createServer(app);
const io = new Server(server);

import { router } from './server/routes/gameRouter.js';
import { roomServices } from './server/services/roomServices.js';

import url from 'url';
import { gameServices } from './server/services/gameServices.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, './client/public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');

app.use("/", router);

const rooms = new Map();
roomServices(io, rooms);
gameServices(io, rooms);

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});