export class Player { 
    
    constructor(name, socketID, host) {
        this.name = name;
        this.hand = [];
        this.id = null;
        this.team = null;
        this.socketID = socketID;
        this.host = host;
    }

    
    setID(id) {
        this.id = id;
    }
    
    setTeam() {
        if(this.id == null) {
            this.team = null;
            return;
        }
        if(this.id % 2 != 0) {
            this.team = 1;
            return;
        }

        this.team = 2;
    }

    setHand(cards) {
        this.hand = cards;
    }

}