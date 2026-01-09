const cards = document.getElementsByClassName("card");

function playCard(number) {
    socket.emit("playCard", number);
}

function challenge() {
    socket.emit("challenge");
}

function challengeResponse(option) {
    switch (option) {
        case "accept":
            socket.emit("challengeResponse", 'ACCEPT');
        case "increase":
            socket.emit("challengeResponse", 'INCREASE');
        case "fold":
            socket.emit("challengeResponse", 'FOLD');
    }
}

socket.on("updateGame", (playerCards, nextPlayer) => {
    for (let i = 0; i < cards.length; i++) {
        if (playerCards[i]) {
            cards[i].src = playerCards[i];
            cards[i].style.display = "block";
        } else {
            cards[i].style.display = "none";
        }
    }

    const next = document.getElementById("next-player");
    next.innerText = `É a vez de ${nextPlayer}`;
})

socket.on("playCard", (success, message, lastPlayedCard, biggestCard) => {
    if (!success) {
        alert(message);
    }

    if (success) {
        if (lastPlayedCard) {
            const lpCardImg = document.getElementById("last-card");
            lpCardImg.src = lastPlayedCard.image;
        }

        if (biggestCard !== null) {
            const bgCardImg = document.getElementById("biggest-card");
            bgCardImg.src = biggestCard.image;
        }
    }
})

socket.on("challenge", (success, message) => {
    if (!success) {
        alert(message);
    }
})

socket.on("challengeReceive", (roundValue) => {

    document.getElementById("challenge-buttons").innerHTML = `
    <input type="button" value="Aceitar" onclick="challengeResponse('accept')">
    <input type="button" value="Aumentar" onclick="challengeResponse('increase')">
    <input type="button" value="Correr" onclick="challengeResponse('fold')">
    `

    document.getElementById("round-value").innerText = `O round está valendo ${roundValue}`;
})

socket.on("startRound", (success, message) => {
    if (!success) {
        alert(message);
    }
})

socket.on("endRound", (winner, score1, score2) => {

    if (winner === 0) {
        alert("Empate na rodada!");
        socket.emit("startRound");
        return;
    }

    alert(`O time ${winner} venceu a rodada!`);

    const score = document.getElementById("score");
    score.innerText = `Time 1: ${score1} | Time 2: ${score2}`;

    socket.emit("startRound");
})


socket.on("endGame", (winner) => {
    alert(`O time ${winner} venceu!`);
    gameScreen.display = "none";
    homeScreen.display = "block";
})