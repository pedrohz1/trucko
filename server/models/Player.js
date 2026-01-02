export class Player { 
    
    #hand = [];

    constructor(name) {
        this.name = name;
    }

    drawHand(cards) {
        this.#hand = cards;
    }

}