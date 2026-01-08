import { Game } from "../models/Game.js"
import { Player } from "../models/Player.js"
import { STATES } from "../constants/gameConstants.js";

function getRooms(io, rooms) {
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
                io.emit("createRoom", false, "Já existe uma sala com esse nome!");
                return;
            };

            rooms.set(roomName, new Game(roomName, new Player(playerName, socket.id, true), 4));
            socket.data.roomName = roomName;
            socket.data.host = true;
            socket.data.name = playerName;
            socket.data.id = null;

            socket.join(roomName);

            console.log(rooms.get(roomName));

            getRooms(io, rooms);
            socket.emit("createRoom", true);
        });


        socket.on("joinRoom", (roomName, playerName) => {
            if (!rooms.has(roomName)) {
                socket.emit("joinRoom", false, "Essa sala não existe!");
                return;
            };

            if (socket.data.roomName == roomName) {
                socket.emit("joinRoom", false, "Você já está em uma sala!");
                return;
            }

            //if (rooms.get(roomName).players.get(1).id == socket.id || ) { } 

            socket.join(roomName);
            rooms.get(roomName).addPlayer(new Player(playerName, socket.id, false));
            socket.data.roomName = roomName;
            socket.data.host = false;
            socket.data.name = playerName;
            socket.data.id = null;

            getRooms(io, rooms);
            socket.emit("joinRoom", true);

            console.log(`${playerName} entrou em ${JSON.stringify(rooms.get(roomName))}`);
            console.log(rooms.get(roomName));

            const r = rooms.get(roomName);
            r.startRound().then(() => {
                console.log(r.players);
            })
        });

        socket.on("exitRoom", (roomName) => {
            if((rooms.get(roomName).players.size == 0 && rooms.get(roomName).playersWithoutTeam.size == 0) || socket.data.host){
                rooms.delete(roomName);
                getRooms(io, rooms);
            }
            
            if(rooms.get(roomName).playersWithoutTeam.has(socket.data.name)){
                rooms.get(roomName).playersWithoutTeam.delete(socket.data.name)
                console.log(`player: ${socket.data.name} removido`);

            }else if(rooms.get(roomName).players.has(socket.data.id)){
                rooms.get(roomName).players.delete(socket.data.id)
                console.log(`player: ${socket.data.name} removido`);

            }else{
                socket.emit("exitRoom", false, "Player não encontrado");
            }
            socket.emit("exitRoom", true, "");    
        });

        //socket.on("joinTeam");
        //socket.on("exitTeam");

        //socket.on("changeTeam");

        socket.on("startGame", (roomName) => {
            const room = rooms.get(roomName);
            if (!socket.data.host) {
                socket.emit("startGame", false, "Partida nao esta em estado de lobby");
                return;
            }
            if (room.states != STATES.LOBBY) {
                socket.emit("startGame", false, "Partida");
                return;
            }
            if (room.players.size === room.numMaxPlayers) {
                socket.emit("startGame", false, "Essa sala está cheia!");
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