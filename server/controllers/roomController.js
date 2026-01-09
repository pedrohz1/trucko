import { Game } from "../models/Game.js"
import { Player } from "../models/Player.js"
import { STATES } from "../constants/gameConstants.js";
import { startRound } from "./gameController.js";


//---Render Functions---//
function getRooms(io, rooms) {
    let allRooms = [];
    rooms.forEach(room => {
        allRooms.push({
            roomName: room.roomName,
            numPlayers: room.numPlayers,
            numMaxPlayers: room.numMaxPlayers
        })
    });

    io.emit("roomList", allRooms);
}

function getTeamMembers(io, room) {
    const arrayPlayersOut = Array.from(room.playersWithoutTeam.entries());
    const arrayPlayers = Array.from(room.players.entries());
    io.to(room.roomName).emit("teamList", room.roomName, room.numMaxPlayers, arrayPlayersOut, arrayPlayers);
}

//---Main function---//
export function roomController(io, rooms) {

    io.on('connection', (socket) => {

        socket.on("roomList", () => {
            getRooms(io, rooms);
        })

        socket.on("createRoom", (roomName, playerName, numMaxPlayers) => {
            if (rooms.has(roomName)) {
                socket.emit("createRoom", false, "Já existe uma sala com esse nome!");
                return;
            };

            rooms.set(roomName, new Game(roomName, new Player(playerName, socket.id, true), numMaxPlayers));
            socket.data.roomName = roomName;
            socket.data.host = true;
            socket.data.name = playerName;
            socket.data.id = (numMaxPlayers == 2) ? 1 : null;

            socket.join(roomName);

            console.log(rooms.get(roomName));

            getTeamMembers(io, rooms.get(roomName));
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

            socket.join(roomName);
            try {
                rooms.get(roomName).addPlayer(new Player(playerName, socket.id, false));
            } catch (e) {
                socket.emit("joinRoom", false, e.message);
            }
            socket.data.roomName = roomName;
            socket.data.host = false;
            socket.data.name = playerName;
            socket.data.id = (rooms.get(roomName).numMaxPlayers == 2) ? 2 : null;

            getTeamMembers(io, rooms.get(roomName));
            getRooms(io, rooms);
            socket.emit("joinRoom", true);

            console.log(`${playerName} entrou em ${JSON.stringify(rooms.get(roomName))}`);
            console.log(rooms.get(roomName));

            const r = rooms.get(roomName);
        });

        socket.on("exitRoom", () => {
            const room = rooms.get(socket.data.roomName);
            if (!room) {
                socket.emit("exitRoom", false, "Você não está em uma sala!");
                return;
            }

            const response = room.removePlayer(socket.data.name, socket.data.id);

            if ((room.players.size == 0 && room.playersWithoutTeam.size == 0) || socket.data.host) {
                rooms.delete(socket.data.roomName);
            }

            getTeamMembers(io, room);
            getRooms(io, rooms);
            socket.emit("exitRoom", response.success, response.message);
        });


        //---Team Functions---//
        socket.on("joinTeam", (ID) => {
            const room = rooms.get(socket.data.roomName);
            if (!room) {
                socket.emit("joinTeam", false, "Você não está em uma sala!");
                return;
            }
            if (ID < 1 || ID > 4) {
                socket.emit("joinTeam", false, "ID inválido");
                return;
            }
            if (socket.data.id != null || socket.data.team != null) {
                socket.emit("joinTeam", false, "Jogador já está em um time");
                return;
            }

            try {
                room.joinTeam(socket.data.name, ID);
                socket.data.id = ID;
                if (ID % 2) {
                    socket.data.team = 2;
                } else {
                    socket.data.team = 1;
                }

            } catch (e) {
                socket.emit("joinTeam", false, e.message);
                return;
            }

            getTeamMembers(io, room);
            socket.emit("joinTeam", true, "");
        });

        socket.on("exitTeam", () => {
            const room = rooms.get(socket.data.roomName);
            if (!room) {
                socket.emit("exitTeam", false, "Você não está em uma sala!");
                return;
            }
            if (socket.data.id == null) {
                socket.emit("exitTeam", false, "Você não está em time!");
                return;
            }
            room.exitTeam(socket.data.id);
            getTeamMembers(io, room);
            socket.emit("exitTeam", true, "");
        });

        socket.on("startGame", async () => {
            const room = rooms.get(socket.data.roomName);
            if (!room) {
                socket.emit("startGame", false, "Você não está em uma sala!");
                return;
            }
            if (!socket.data.host) {
                socket.emit("startGame", false, "Usuario não é o host");
                return;
            }
            if (room.state != STATES.LOBBY) {
                socket.emit("startGame", false, "Partida não esta em estado de lobby");
                return;
            }
            if (room.players.size !== room.numMaxPlayers) {
                socket.emit("startGame", false, "Essa sala não está cheia!");
                return;
            }

            io.to(socket.data.roomName).emit("startGame", true);
            await startRound(socket, io, rooms);
        });

        socket.on("disconnect", (reason) => {
            const room = rooms.get(socket.data.roomName);
            console.log(socket.id + " disconnected " + reason);
            if (!room) {
                return;
            }

            const response = room.removePlayer(socket.data.name, socket.data.id);

            if ((room.players.size == 0 && room.playersWithoutTeam.size == 0) || socket.data.host) {
                rooms.delete(socket.data.roomName);
            }

            getTeamMembers(io, rooms.get(socket.data.roomName));
            getRooms(io, rooms);
        });
    });
}