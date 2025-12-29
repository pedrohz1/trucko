import axios from "axios";

export class PlayerRepository {
    constructor() {
        this.players = [];
    }

    async drawHand(player, deckId) {
        cards = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`);
        player.hand = cards;
    }
}