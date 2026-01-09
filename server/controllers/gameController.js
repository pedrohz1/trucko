async function updateGame(room, game, io, nextPlayer) {
    const sockets = await io.in(room).fetchSockets();

    sockets.forEach((socket) => {
        const player = game.getPlayer(socket.id);


        const playerCards = player.hand.map((card) => {
            return card.image;
        })

        socket.emit("updateGame", playerCards, nextPlayer);
    });
}

export async function startRound(socket, io, rooms) {
    try {
        if (socket.data.host) {
            const roomName = socket.data.roomName;
            const game = rooms.get(roomName);

            if (game) {
                await game.startRound();

                await updateGame(roomName, game, io);
            }
        }
    } catch (error) {
        socket.emit("startRound", false, error);
    }
}

export function gameController(io, rooms) {
    io.on("connection", (socket) => {

        socket.on("playCard", async (card) => {
            const room = socket.data.roomName;
            const game = rooms.get(room);

            if (!game) return socket.emit("playCard", false, "Jogo não existe!");

            const player = game.getPlayer(socket.id);

            if (!player) return socket.emit("playCard", false, "Player não encontrado!");

            const response = game.playCard(player, player.hand[card]);

            if (!response.success) return socket.emit("playCard", false, response.message);

            if (response.data) {
                if (response.data.roundWinner) {
                    io.to(room).emit("endRound", response.data.roundWinner, response.data.score1, response.data.score2);
                    return;
                }
                if (response.data.gameWinner) {
                    io.to(room).emit("endGame", response.data.gameWinner);
                    io.socketsLeave(room);
                    return;
                }

                io.to(room).emit("playCard", true, "", response.data.lastPlayedCard, response.data.biggestCard);

                const nextPlayer = game.players.get(response.data.nextPlayer).name;
                await updateGame(room, game, io, nextPlayer);
            }
        })

        socket.on("startRound", async () => {
            await startRound(socket, io, rooms);
        })


        socket.on("challenge", async () => {
            const room = socket.data.roomName;
            const game = rooms.get(room);
            const player = game.getPlayer(socket.id);

            const response = game.challenge(player);

            if (!response.success) return socket.emit("challenge", false, response.message);

            const sockets = await io.in(room).fetchSockets();

            sockets.forEach((socket) => {
                console.log(socket.data.id);
                if(socket.data.id === (player.id % game.numMaxPlayers) + 1) {
                    socket.emit("challengeReceive");
                }
            });
        })

        socket.on("challengeResponse", (option) => {
            const room = socket.data.roomName;
            const game = rooms.get(room);
            const player = game.getPlayer(socket.id);

            const response = game.challengeResponse(player, option);

            if(response.data.roundWinner) {
                io.to(room).emit("endRound", response.data.roundWinner);
                return;
            }
        })
    })
}
