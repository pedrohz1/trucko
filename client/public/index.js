const socket = io();

const homeScreen = document.getElementsByClassName("home");
const lobbyScreen = document.getElementsByClassName("lobby");
const gameScreen = document.getElementsByClassName("game");

socket.emit("roomsList");

function criarSala() {

    const roomName = document.getElementById("roomName").value;
    const playerName = document.getElementById("playerName").value;

    if (!roomName) {
        alert("Digite o nome da sala para continuar");
        return;
    }
    if (!playerName) {
        alert("Digite o nome do jogador para continuar");
        return;
    }

    socket.emit("createRoom", roomName, playerName);

    socket.on("createRoom", (success, message) => {
        if (!success) {
            alert(message);
            return;
        }
        alert("Sala criada com sucesso, esperando players...");
    });

    socket.emit("roomsList");
}

function entrarSala(roomName) {
    const playerName = document.getElementById("playerName").value;

    if (!roomName) {
        alert("Digite o nome da sala para continuar");
        return;
    }
    if (!playerName) {
        alert("Digite o nome do jogador para continuar");
        return;
    }

    socket.emit("joinRoom", roomName, playerName);
    console.log("isso");

    socket.on("joinRoom", (success, message) => {
        if (!success) {
            alert(message);
            return;
        }
        alert("Esperando criador da sala iniciar o jogo");
    });
}

function sairSala() {
    socket.emit("exitRoom");
}



function carregarMain() {
    socket.emit("roomList");
}

socket.on("roomList", (rooms) => {
    const roomTable = document.querySelector("#roomsList tbody");
    let text = ``;

    rooms.forEach(room => {
        text += `<tr>
                    <th>${room.roomName}</th>
                    <th>${room.numPlayers}/${room.numMaxPlayers}</th>
                    <th><input type="button" value="Entrar Sala" onclick="entrarSala(${room.roomName})"></th>
                </tr>`;
    });
    roomTable.innerHTML = text;
});

function iniciarJogo() {
    socket.emit("startGame");
}