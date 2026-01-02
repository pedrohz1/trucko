export class Team {
    
    #roundScore = 0;
    #matchScore = 0;

    constructor(){
        this.players = [];
    }

    addPlayer(player) {
        this.players.push(player);
    }

    addRoundScore(score) {
        this.#roundScore += score;
    }

    addMatchScore(score) {
        this.#matchScore += score;
    }
}