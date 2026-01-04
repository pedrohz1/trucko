export class Room{ // Ricardo: vou usar no html, nao apague
    constructor(roomName, players, numMaxPlayers){
        this.roomName = roomName;
        this.players = [players];
        this.numPlayers = 1;
        this.numMaxPlayers = numMaxPlayers;
    }

    addPlayer(players) {
        if(this.numMaxPlayers == this.numPlayers) throw new Error("Capacidade máxima da sala atingida");
        this.players.push(players);
        this.numPlayers++;
    }
        
    /*
    removePlayer(players) {
        this.numPlayers -= 1;
    }
    */
}