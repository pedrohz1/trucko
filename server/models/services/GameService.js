export class GameService {

    #deckId = null;
    #turn = 0;
    #biggestCard = null;
    #roundValue = 1;

    constructor(playerRepository, deckRepository) {
        this.playerRepo = playerRepository;
        this.deckRepo = deckRepository;
    }

    async startHands() {
        this.#deckId = await this.deckRepo.startDeck();

        for (const player in this.playerRepo.players) {
            const cards = await this.deckRepo.drawHand(this.#deckId, 3);
            player.drawHand(cards);
        }
    }

    playCard(player, card) {
        if (this.playerRepo.getPlayerId(player) != this.#turn) {
            throw new Error("Ainda não é sua vez de jogar!")
        }

        if (this.#biggestCard != null) {
            if (GameService.cardOrder[card.code] > GameService.cardOrder[this.#biggestCard.card]) {
                this.#biggestCard = {
                    "player": player,
                    "card": card.code
                };
            }
        }

        if (this.#biggestCard === null) {
            this.#biggestCard = {
                    "player": player,
                    "card": card.code
                };
        }

        this.#turn = (this.#turn + 1) % this.playerRepo.players.length;
        if(this.#turn === 1) {
            this.endRound();
            return {
                hasFinished: true,
                biggestCard: this.#biggestCard
            }
        }

        return {
            hasFinished: false,
            biggestCard: this.#biggestCard
        }
    }
    
    increaseValue(value) {
        this.#roundValue += value;
    }

    endRound() {
        this.#biggestCard.player.team.addScore(this.#roundValue);
        this.#biggestCard = null;

        this.#roundValue = 1;
    }
}