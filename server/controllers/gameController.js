import { forEachChild, isSourceFile, validateLocaleAndSetLanguage } from "typescript";

export function gameController(io, rooms) {
    io.on("connection", (socket) => {

        socket.on("playCard", (card) => {
            const room = socket.data.roomName;
            const game = rooms.get(room);

            if (!game) return socket.emit("playCard", false, "Jogo não existe!");

            const player = game.getPlayer(socket.id);

            if (!player) return socket.emit("playCard", false, "Player não encontrado!");

            const response = game.playCard(player, card);

            if (!response.success) return socket.emit("playCard", false, response.message);

            if (response.data) {
                if (response.data.winner) {
                    io.to(room).emit("endGame", response.data.winner.winnerTeam);
                    io.socketsLeave(room);
                    return;
                }
                socket.emit("playCard", true, "", response.data.lastPlayedCard, response.data.biggestCard);
            }
        })
    })
}