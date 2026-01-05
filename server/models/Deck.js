import axios from "axios";
import { resolveInclude } from "ejs";

export class Deck {

    static cardOrder = {
        "4C": 15,
        "7H": 14,
        "AS": 13,
        "7D": 12,
        "3C": 11,
        "3H": 11,
        "3S": 11,
        "3D": 11,
        "2C": 10,
        "2H": 10,
        "2S": 10,
        "2D": 10,
        "AC": 9,
        "AH": 9,
        "AD": 9,
        "KC": 8,
        "KH": 8,
        "KS": 8,
        "KD": 8,
        "JC": 7,
        "JH": 7,
        "JS": 7,
        "JD": 7,
        "QC": 6,
        "QH": 6,
        "QS": 6,
        "QD": 6,
        "7C": 5,
        "7S": 5,
        "6C": 4,
        "6H": 4,
        "6S": 4,
        "6D": 4,
        "5C": 3,
        "5H": 3,
        "5S": 3,
        "5D": 3,
        "4H": 2,
        "4S": 2,
        "4D": 2,
    };

    constructor() {
        this.id = null;
        this.remaining = 0;
    }


    async startDeck() {
        const response = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?cards=4C,7D,AS,7H,3C,3D,3S,3H,2C,2D,2S,2H,AC,AD,AH,KC,KD,KS,KH,JC,JD,JS,JH,QC,QD,QS,QH,7C,7S,6C,6D,6S,6H,5C,5D,5S,5H,4D,4S,4H");

        console.log(response.data);
        if (!response.data.success) {
            throw new Error("Falha na API ao gerar o deck");
        }

        this.id = response.data.deck_id;
        this.remaining = response.data.remaining;
    }

    async drawHand(count) {
        const response = await axios.get(`https://deckofcardsapi.com/api/deck/${this.id}/draw/?count=${count}`);
        if (!response.data.success) throw new Error("Falha na API ao comprar a mão");

        return response.data.cards;
    }
}