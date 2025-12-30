import axios from "axios";

export class DeckRepository {

    async startDeck() {
        const deck = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?cards=4C,7D,AS,7H,3C,3D,3S,3H,2C,2D,2S,2H,AC,AD,AH,KC,KD,KS,KH,JC,JD,JS,JH,QC,QD,QS,QH,7C,7S,6C,6D,6S,6H,5C,5D,5S,5H,4D,4S,4H");
        
        if(!deck.success) {
            throw new Error("Falha na API ao gerar o deck");
        }

        return deck.deck_id;
    }

    async drawHand(deckId, count) {
        const cards = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
        return cards;
    }
}