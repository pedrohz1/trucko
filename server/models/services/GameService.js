export class GameService {

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

    #deckId = null;
    #turn = 0;
    #biggestCard = null;

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

    async playCard(player, card) {
        if (this.playerRepo.getPlayerId(player) != this.#turn) {
            throw new Error("Ainda não é sua vez de jogar!")
        }

        if (this.#biggestCard != null) {
            if (GameService.cardOrder[card.code] > GameService.cardOrder[this.#biggestCard]) {
                this.#biggestCard = card.code;
            }
        }

        if (this.#biggestCard == null) {
            this.#biggestCard = card.code;
        }

        this.#turn = (this.#turn + 1) % this.playerRepo.players.lenght;
    }
}