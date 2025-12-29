export class Player {
    constructor(name) {
        this.name = name;
        this._hand = [];
    }

    get hand() {
        return this._hand;
    }
    
    set hand(cards) {
        this._hand = cards;
    }
}