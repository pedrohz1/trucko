const socket = io();

socket.emit("roomsList");

function criarSala(){
    
    const roomName = document.getElementById("roomName").value;
    const playerName = document.getElementById("playerName").value;
    
    if(!roomName){
        alert("Digite o nome da sala para continuar");
        return;
    }
    if(!playerName){
        alert("Digite o nome do jogador para continuar");
        return;
    }
    
    window.location.href = 'lobby';

    socket.emit("createRoom", roomName, playerName);

    socket.on("createRoom", (success) => {
        if(!success){
            alert("Nome da sala já existente");
            return;
        }
        alert("Sala criada com sucesso, esperando players...");
    });

    socket.emit("roomsList");
}

function entrarSala(){
    const roomName = document.getElementById("roomName").value;
    const playerName = document.getElementById("playerName").value;

    if(!roomName){
        alert("Digite o nome da sala para continuar");
        return;
    }
    if(!playerName){
        alert("Digite o nome do jogador para continuar");
        return;
    }

    socket.emit("joinRoom", roomName, playerName);
    console.log("isso");

    socket.on("joinRoom", (success) => {
        if(!success){
            alert("Sala não encontrada");
            return;
        }
        alert("Esperando criador da sala iniciar o jogo");
    });
}

function carregarLobby(){

}

function sairSala() {
    window.location.href = '';
}



function carregarMain(){
    socket.emit("roomList");
}

socket.on("roomList", (rooms) => {
    const roomTable = document.querySelector("#roomsList tbody");
    let text = ``;

    rooms.forEach(room => {
        text += `<tr>
                    <th>${room.roomName}</th>
                    <th>${room.numPlayers}/${room.numMaxPlayers}</th>
                </tr>`;
    });
    roomTable.innerHTML = text;
});

function iniciarJogo(){
    socket.emit("startGame");
}