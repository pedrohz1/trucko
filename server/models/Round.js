import { Deck } from "./Deck.js";

export class Round {
    constructor() {
        this.roundValue = 1;
        this.deck = new Deck();
        this.biggestCard = null;
        this.playing = 1;
        this.winners = [];
        this.playedCount = 0;
    }

    cardPlayed(card, player) {
        this.setBiggestCard(card, player);

        this.playedCount++;
        if(this.playedCount === 4) {
            return this.nextTurn(this.biggestCard.player.team);
        }

        this.playing = (this.playing % 4) + 1;       
    }

    increaseRoundValue() {
        if (this.roundValue == 9) this.roundValue = 12;
        if (this.roundValue == 6) this.roundValue = 9;
        if (this.roundValue == 3) this.roundValue = 6;
        if (this.roundValue == 1) this.roundValue = 3;
    }

    setBiggestCard(card, player) {
        
        if (this.biggestCard != null) {
            if(Deck.cardOrder[card.code] === Deck.cardOrder[this.biggestCard.card]) {
                this.biggestCard = null;
            }

            if (Deck.cardOrder[card.code] > Deck.cardOrder[this.biggestCard.card]) {
                this.biggestCard = {
                    player: player,
                    card: card.code
                };
            }
        }

        if (this.biggestCard === null) {
            this.biggestCard = {
                player: player,
                card: card.code
            }
        }
    }

    nextTurn(roundWinner) {
        if(this.winners.includes(roundWinner)) {
            return {
                end: true,
                winnerTeam: roundWinner
            };
        }
        
        this.winners.push(roundWinner);

        if(this.biggestCard != null) {
            this.playing = this.biggestCard.player;
        }
        else {
            this.playing = (this.playing % 4) + 1; 
        }

        this.biggestCard = null;

        return {
            end: false
        };
    }
}