import { Game } from "../models/Game.js"
import { Player } from "../models/Player.js"

export function roomServices(io, rooms) {

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

        socket.on("startGame", () => {
            if(!socket.data.host){
                console.log("erro ao começar");
                return;
            }
            console.log("partida iniciada");
        });

        socket.on("disconnect", (reason) => {
            //console.log(io.sockets.adapter.rooms.keys());
            console.log(socket.id + " disconnected " + reason);
        });
    });
}