import { Deck } from "./Deck.js";

export class Round {
    constructor(dealerIndex) {
        this.deck = new Deck();

        this.playing = dealerIndex;
        this.playedCount = 0;

        this.winners = [];
        this.biggestCard = null;
        this.tieValue = 0;

        this.roundValue = 1;
        this.lastChallenge = 0;
        this.teamsChallenged = [];
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
        switch (this.roundValue) {
            case 1:
                this.roundValue = 3;
                break;
            case 3:
                this.roundValue = 6;
                break;
            case 6:
                this.roundValue = 9;
                break;
            case 9:
                this.roundValue = 12;
                break;
            default:
                break;
        }
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