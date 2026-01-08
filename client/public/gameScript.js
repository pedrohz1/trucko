const cards = document.getElementsByClassName("card");

function playCard(number) {
    socket.emit("playCard", number);
}

function challenge() {
    socket.emit("challenge");
}

socket.on("updateHands", (playerCards) => {
    for (let i = 0; i < cards.length; i++) {
        cards[i].src = playerCards[i];
    }
})

socket.on("playCard", (sucess, message, lastPlayedCard, biggestCard) => {
    if (!sucess) {
        alert(message);
    }

    if (sucess) {
        const lpCardImg = document.getElementById("last-card");
        lpCardImg.src = lastPlayedCard.image;
        if (biggestCard) {
            const bgCardImg = document.getElementById("biggest-card");
            bgCardImg.src = biggestCard.image;
        }

    }
})

socket.on("endRound", (winner, score1, score2) => {
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