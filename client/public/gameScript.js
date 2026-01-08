function challenge() {
    socket.emit("challenge");
}


socket.on("playCard", (sucess, message, lastPlayedCard, biggestCard) => {
    if(!sucess) {
        alert(message);
    }
    
    if (sucess) {
        const lpCardImg = document.getElementById("last-card");
        const bgCardImg = document.getElementById("biggest-card");
        lpCardImg.src = lastPlayedCard.image;
        bgCardImg.src = biggestCard.image;
    }
})

socket.on("endGame", (winner) => {
    alert(`O time ${winner} venceu!`);
    gameScreen.display = "none";
    homeScreen.display = "block";
})