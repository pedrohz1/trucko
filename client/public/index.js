const socket = io();

function criarSala(){
    const roomName = document.getElementById("roomName").value;
    const playerName = document.getElementById("playerName").value;

    if(!roomName){
        alert("Nome da sala vazio");
        return;
    }
    if(!playerName){
        alert("Nome do Jogador vazio");
        return;
    }

    socket.emit("createRoom", roomName, playerName);

    socket.on("createRoom", (success) => {
        if(!success){
            console.log("Erro ao criar sala / nome já existente");
            return;
        }
        console.log("Sala criada com sucesso");
    });
}