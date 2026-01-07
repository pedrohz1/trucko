import { Game } from "../models/Game.js"
import { Player } from "../models/Player.js"
import { STATES } from "../constants/gameConstants.js";

function transferOldToNewID(socket) {
    
}

function getRooms (io, rooms){
    const allRooms = [];
    rooms.forEach(room => {
            allRooms.push({
                roomName: room.roomName,
                numPlayers: room.numPlayers,
                numMaxPlayers: room.numMaxPlayers
        })
    });

    io.emit("roomList", allRooms);
}

export function roomController(io, rooms) {

    io.on('connection', (socket) => {

        socket.on("roomList", () => {
            getRooms(io, rooms);
        })

        socket.on("createRoom", (roomName, playerName) => {
            if (rooms.has(roomName)) {
                io.emit("createRoom", false);
                return;
            };

            rooms.set(roomName, new Game(roomName, new Player(playerName, socket.id, true), 4));
            socket.data.roomName = roomName;
            socket.data.host = true;
            
            socket.join(roomName);

            console.log(rooms.get(roomName));

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
            console.log(rooms.get(roomName));

            const r = rooms.get(roomName);
            r.startRound().then(() => {
                console.log(r.players);
            })
        });

        socket.on("exitRoom", (roomName) => {
            
        });
        //socket.on("joinTeam");
        //socket.on("exitTeam");

        //socket.on("changeTeam")

        socket.on("startGame", (roomName) => {
            const room = rooms.get(roomName);
            if(!socket.data.host && room.states != STATES.LOBBY){
                console.log("Partida nao esta em estado de lobby");
                return;
            }
            if(!(room.players.size = room.numMaxPlayers)){
                console.log("Nem todos estão em times");
                return;
            }

            //if(rooms.get(socket.data.rooms))
            console.log("partida iniciada");
            io.to(roomName).emit("startGame");
        });

        socket.on("disconnect", (reason) => {
            //console.log(io.sockets.adapter.rooms.keys());
            console.log(socket.id + " disconnected " + reason);
        });
    });
}