export class Player { 
    
    constructor(name) {
        this.name = name;
        this.hand = [];
        this.id = null;
        this.team = null;
    }

    
    setId(id) {
        this.id = id;
    }
    
    setTeam(team) {
        this.team = team;
    }

    setHand(cards) {
        this.hand = cards;
    }

}