const socket = io();

const homeScreen = document.getElementsByClassName("home")[0];
const lobbyScreen = document.getElementsByClassName("lobby")[0];
const gameScreen = document.getElementsByClassName("game")[0];

function showScreen(screen) {
    switch (screen) {
        case "home":
            homeScreen.style.display = "block";
            lobbyScreen.style.display = "none";
            gameScreen.style.display = "none";
            break;
        case "lobby":
            homeScreen.style.display = "none";
            lobbyScreen.style.display = "block";
            gameScreen.style.display = "none";
            break;
        case "game":
            homeScreen.style.display = "none";
            lobbyScreen.style.display = "none";
            gameScreen.style.display = "block";
            break;
        default:
            alert("Erro ao carregar sala")
            break;
    }
}

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

        showScreen("lobby")
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
    console.log(roomName);

    socket.on("joinRoom", (success, message) => {
        if (!success) {
            alert(message);
            return;
        }

        showScreen("lobby");
    });
}

function sairSala() {
    socket.emit("exitRoom");

    socket.on("exitRoom", (success, message) => {
        if (!success) {
            alert(message);
            return;
        }

        showScreen("home");
    });
}

//---FUNC TIME---//

function entrarTime(ID) {
    socket.emit("joinTeam", ID);

    socket.on("joinTeam", (success, message) => {
        if (!success) {
            alert(message);
            return;
        }
    });
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
                    <th><input type="button" value="Entrar Sala" onclick="entrarSala('${room.roomName}')"></th>
                </tr>`;
    });
    roomTable.innerHTML = text;
});

function iniciarJogo() {
    socket.emit("startGame");

    socket.on("startGame", (success, message) => {
        if (!success) {
            alert(message);
            return;
        }
    })
};

socket.on("startGame", (success) => {
    if (success) {
        showScreen("game");
    }
});