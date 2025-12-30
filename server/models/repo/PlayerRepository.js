export class PlayerRepository {
    constructor() {
        this.players = [];
    }

    addPlayer(player) {
        this.players.push(player.name);
    }

    removePlayer(player) {
        const index = this.players.indexOf(player.name);
        if(index > -1) {
            this.players.splice(index);
        }
    }

    getPlayerId(player) {
        return this.players.indexOf(player.name);
    }
}