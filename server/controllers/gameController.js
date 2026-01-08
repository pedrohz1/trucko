async function updateHands(room, game, io) {
    const sockets = await io.in(room).fetchSockets();

    sockets.forEach((socket) => {
        const player = game.getPlayer(socket.id);


        const playerCards = player.hand.map((card) => {
            return card.image;
        })

        socket.emit("updateHands", playerCards);
    });
}

export async function startRound(socket, io, rooms) {
    try {
        if (socket.data.host) {
            const roomName = socket.data.roomName;
            const game = rooms.get(roomName);

            if (game) {
                await game.startRound();

                await updateHands(roomName, game, io);
            }
        }
    } catch (error) {
        console.error("Erro ao iniciar rodada:", error);
    }
}

export function gameController(io, rooms) {
    io.on("connection", (socket) => {

        socket.on("playCard", (card) => {
            const room = socket.data.roomName;
            const game = rooms.get(room);

            if (!game) return socket.emit("playCard", false, "Jogo não existe!");

            const player = game.getPlayer(socket.id);

            if (!player) return socket.emit("playCard", false, "Player não encontrado!");

            const response = game.playCard(player, player.hand[card]);

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