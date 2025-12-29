export class Room{ // Ricardo: vou usar no html, nao apague
    constructor(roomName, players){
        this.roomName = roomName;
        this.players = [players];
        this.numPlayers = 1;
    }

    /*
    function addPlayer(players) {
        this.numPlayers += 1;
    }

    function removePlayer(players) {
        this.numPlayers -= 1;
    }
    */
}