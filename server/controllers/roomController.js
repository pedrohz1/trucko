import { Game } from "../models/Game.js"
import { Player } from "../models/Player.js"
import { STATES } from "../constants/gameConstants.js";

export function roomController(io, rooms) {

    io.on('connection', (socket) => {

        socket.on("createRoom", (roomName, playerName) => {
            if (rooms.has(roomName)) {
                io.emit("createRoom", false);
                return;
            };

            rooms.set(roomName, new Game(roomName, new Player(playerName, socket.id, true), 4));
            socket.data.roomName = roomName;
            socket.data.host = true;
            
            socket.join(roomName);

            console.log(rooms.get(roomName))
            
            socket.emit("createRoom", true);
        });


        socket.on("joinRoom", (roomName, playerName) => {
            if (!rooms.has(roomName)) {
                socket.emit("joinRoom", false);
                return;
            };

            socket.join(roomName);
            rooms.get(roomName).addPlayer(new Player(playerName, socket.id, false));
            socket.data.roomName = roomName;
            socket.data.host = false;

            socket.emit("joinRoom", true);

            console.log(`${playerName} entrou em ${JSON.stringify(rooms.get(roomName))}`);

            const r = rooms.get(roomName);
            r.startRound().then(() => {
                console.log(r.players);
            })
        });

        socket.on("joinTeam");
        socket.on("exitTeam");
        socket.on("exitRoom");

        //socket.on("changeTeam")

        socket.on("startGame", (roomName) => {
            if(!socket.data.host && rooms.get(roomName).states != STATES.LOBBY){
                console.log("erro ao começar");
                return;
            }

            if(rooms.get(socket.data.rooms))
            console.log("partida iniciada");
            io.to(roomName).emit("startGame");
        });

        socket.on("disconnect", (reason) => {
            //console.log(io.sockets.adapter.rooms.keys());
            console.log(socket.id + " disconnected " + reason);
        });
    });
}