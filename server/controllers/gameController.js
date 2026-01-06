export function gameController(io, rooms) {
    io.on("connection", (socket) => {

        socket.on("playCard", (card) => {
            const room = socket.data.roomName;
            const game = rooms.get(room);

            if (!game) return socket.emit("actionError", "Jogo não existe!");

            const player = game.getPlayer(socket.id);

            if (!player) return socket.emit("actionError", "Player não encontrado!");

            const response = game.playCard(player, card);

            if (!response.success) return socket.emit("actionError", response.message);

            if (response.data) {
                if (response.data.winner) {
                    return io.to(room).emit("endGame", response.data.winner.winnerTeam);
                }
            }
        })
    })
}