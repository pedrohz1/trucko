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
    const numPlayers = Number(document.getElementById("numPlayer").value);

    if (!roomName) {
        alert("Digite o nome da sala para continuar");
        return;
    }
    if (!playerName) {
        alert("Digite o nome do jogador para continuar");
        return;
    }
    socket.emit("roomsList");   
    socket.emit("createRoom", roomName, playerName, numPlayers);
}

    socket.on("createRoom", (success, message) => {
        if (!success) {
            alert(message);
            return;
        }

        showScreen("lobby")
        alert("Sala criada com sucesso, esperando players...");
    });


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
}

    socket.on("joinRoom", (success, message) => {
        if (!success) {
            alert(message);
            return;
        }

        showScreen("lobby");
    });

function sairSala() {
    socket.emit("exitRoom");
}

    socket.on("exitRoom", (success, message) => {
        if (!success) {
            alert(message);
            return;
        }

        showScreen("home");
    });

//---FUNC TIME---//

function entrarTime(ID) {
    socket.emit("joinTeam", ID);
}

    socket.on("joinTeam", (success, message) => {
        if (!success) {
            alert(message);
            return;
        }
    });

function sairTime() {
    
}

function carregarMain() {
    socket.emit("roomList");
}


//---RENDER FUNCTIONS---//
socket.on("roomList", (rooms) => {
    const roomTable = document.querySelector("#roomsList tbody");
    let text = ``;

    rooms.forEach(room => {
        if (room.numPlayers != room.numMaxPlayers){
            text += `<tr>
                    <th>${room.roomName}</th>
                    <th>${room.numPlayers}/${room.numMaxPlayers}</th>
                    <th><input type="button" value="Entrar Sala" onclick="entrarSala('${room.roomName}')"></th>
                    </tr>`;
        }
    });
    roomTable.innerHTML = text;
});

socket.on("teamList", (roomName, numMaxPlayers, BplayersWithoutTeam, Bplayers) => {
    const playersTable = document.querySelector("#playersList tbody");
    const teamButtons = document.querySelector("#teamsButtons");
    document.getElementById("lobbyTitle").innerHTML = roomName;

    const players = new Map(Bplayers);
    const playersWithoutTeam = new Map(BplayersWithoutTeam);
    
    let textTable = ``;
    let textButtons = ``;

    switch (Number(numMaxPlayers)) {
        case 2:
            players.forEach((player, id) => {
                textTable += `<tr><td>${id}</td><td>${player.name}</td></tr>`;
            });
            break;
        
        case 4:
            playersWithoutTeam.forEach((playerName, player) => {
                textTable += `<tr><td>${player.name}</td></tr>`
            });
            textButtons += !players.has(1) ? `<input type="button" class="buttonTeam1" value="Entrar time 1" onclick="entrarTime(1)">` : `<div class="nameTeam1">${players.get(1).name}</div>`;
            textButtons += !players.has(2) ? `<input type="button" class="buttonTeam2" value="Entrar time 2" onclick="entrarTime(2)">` : `<div class="nameTeam2">${players.get(2).name}</div>`;
            textButtons += !players.has(3) ? `<input type="button" class="buttonTeam1" value="Entrar time 1" onclick="entrarTime(3)">` : `<div class="nameTeam1">${players.get(3).name}</div>`;
            textButtons += !players.has(4) ? `<input type="button" class="buttonTeam2" value="Entrar time 2" onclick="entrarTime(4)">` : `<div class="nameTeam2">${players.get(4).name}</div>`;
            textButtons += `<input type="button" value="Sair do time" onclick="sairTime()">`
            break;

        default:
        break;
    }

    playersTable.innerHTML = textTable;
    teamButtons.innerHTML = textButtons;
});



function iniciarJogo() {
    socket.emit("startGame");
}

    socket.on("startGame", (success, message) => {
        if (!success) {
            alert(message);
            return;
        }
    })

socket.on("startGame", (success) => {
    if (success) {
        showScreen("game");
    }
});