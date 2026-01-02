export class PlayerRepository {
    constructor() {
        this.players = [];
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(name) {
        const index = this.players.indexOf(name);
        if(index > -1) {
            this.players.splice(index);
        }
    }

    getPlayer(name) {
        return this.players.find((player) => player.name == name);
    }

    getPlayerId(player) {
        return this.players.indexOf(player.name);
    }
}