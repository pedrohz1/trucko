import { Deck } from "./Deck.js";

export class Round {
    constructor() {
        this.roundValue = 1;
        this.deck = new Deck();
        this.biggestCard = null;
        this.playing = 1;
        this.winners = [];
        this.playedCount = 0;
        this.teamsChallenged = [];
        this.lastChallenge = 0;
        this.tieValue = null;
    }

    cardPlayed(player, card, maxPlayers) {
        this.playedCount++;
        this.setBiggestCard(player, card);

        if (this.playedCount === maxPlayers) {
            return this.nextTurn();
        }

        this.playing = (this.playing % maxPlayers) + 1;
        return {
            end: false
        };
    }

    challenge(player) {
        if (this.teamsChallenged.includes(player.team)) {
            return {
                success: false,
                reason: "Seu time já trucou!"
            }
        }

        this.increaseRoundValue();
        this.teamsChallenged.push(player.team);
        this.lastChallenge = player.team;
        return {
            success: true,
            reason: null
        }
    }

    increaseRoundValue() {
        if (this.roundValue == 9) this.roundValue = 12;
        if (this.roundValue == 6) this.roundValue = 9;
        if (this.roundValue == 3) this.roundValue = 6;
        if (this.roundValue == 1) this.roundValue = 3;
    }

    setBiggestCard(player, card) {
        const cardPower = Deck.cardOrder[card.code];

        if (this.playedCount === 0) {
            this.biggestCard = { player, card: card.code };
            this.tieValue = 0;
            return;
        }

        if (this.biggestCard === null) {
            if (cardPower > this.tieValue) {
                this.biggestCard = { player, card: card.code };
                this.tieValue = 0;
            }
            return;
        }

        const currentPower = Deck.cardOrder[this.biggestCard.card];

        if (cardPower === currentPower) {
            this.tieValue = currentPower;
            this.biggestCard = null;
        } else if (cardPower > currentPower) {
            this.biggestCard = { player, card: card.code };
            this.tieValue = 0;
        }
    }

    nextTurn() {
        this.playedCount = 0

        if (this.biggestCard === null) {
            if (this.winners.length > 0 && this.winners[0] != 0) {
                return {
                    end: true,
                    winnerTeam: this.winners[0]
                }
            }

            this.winners.push(0);
            this.playing = (this.playing % 4) + 1;

            return {
                end: false
            }
        }


        if (this.winners.includes(this.biggestCard.player.team) || this.winners[0] === 0) {
            return {
                end: true,
                winnerTeam: this.biggestCard.player.team
            };
        }

        this.winners.push(this.biggestCard.player.team);

        if (this.biggestCard != null) {
            this.playing = this.biggestCard.player.id;
        }

        this.biggestCard = null;

        return {
            end: false
        };
    }
}