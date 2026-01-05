import { Round } from "./Round.js";
import { STATES, RESPONSES, GameResponse } from "../constants/gameConstants.js";

export class Game {
    constructor(roomName, player, numMaxPlayers) {
        this.roomName = roomName;

        player.setID(1);
        player.setTeam();

        this.players = new Map();
        this.players.set(1, player);
        this.numPlayers = 1;
        this.numMaxPlayers = numMaxPlayers;

        this.state = STATES.LOBBY;
        this.round = null;

        this.scoreTeam1 = 0;
        this.scoreTeam2 = 0;
    }

    addPlayer(player) {
        if (this.numMaxPlayers == this.numPlayers) throw new Error("Capacidade máxima da sala atingida");
        if (this.players.has(player)) throw new Error("Usuário já existente na sala");

        this.numPlayers++;
        this.players.set(this.numPlayers, player);

        player.setID(this.numPlayers);
        player.setTeam();
    }

    removePlayer(playerId) {
        this.players.delete(playerId);
        this.numPlayers--;
    }

    changeTeam(currentID, newID) {
        if (currentID > 4 || currentID < 1) throw new Error("ID atual errado");
        if (newID > 4 || newID < 1) throw new Error("ID novo errado");
        const player1 = this.players.get(currentID);
        const player2 = this.players.get(newID);

        this.players.delete(currentID);
        this.players.delete(newID);

        this.players.set(newID, player1);
        this.players.set(currentID, player2);
    }

    async startRound() {
        this.state = STATES.PLAYING;
        this.round = new Round();
        await this.round.deck.startDeck();

        await Promise.all(Array.from(this.players.values()).map(async (player) => {
            const cards = await this.round.deck.drawHand(3);
            player.setHand(cards);
        }));
    }

    playCard(player, card) {
        if (this.state === STATES.PLAYING && this.round.playing === player.id) {
            const result = this.round.cardPlayed(player, card, this.numMaxPlayers);
            if (result.end) {
                this.addPoints(result.winnerTeam);
                if (this.state !== STATES.GAME_OVER) this.startRound();
                return GameResponse.success(this.state, { winner: result.winnerTeam });
            }

            return GameResponse.success(this.state);
        }

        return GameResponse.error(this.state, "Você não pode jogar agora!");
    }

    challenge(player) {
        if (this.state === STATES.PLAYING && this.round.playing === player.id) {
            const result = this.round.challenge(player);
            if (result.success) {
                this.state = STATES.WAITING_FOR_TRUCO;
                return GameResponse.success(this.state);
            }
            return GameResponse.error(this.state, result.reason);
        }

        return GameResponse.error(this.state, "Você não pode trucar agora!");
    }

    challengeResponse(player, response) {
        if (this.state === STATES.WAITING_FOR_TRUCO && this.round.lastChallenge !== player.team) {

            if (response === RESPONSES.INCREASE) {
                this.round.lastChallenge = player.team;
                this.round.increaseRoundValue();
                return GameResponse.success(this.state);
            }

            if (response === RESPONSES.ACCEPT) {
                this.state = STATES.PLAYING;
                return GameResponse.success(this.state);
            }

            if (response === RESPONSES.FOLD) {
                // Se o time corre, o time adversário ganha o valor ATUAL do round (antes do aumento)
                const winnerTeam = player.team === 1 ? 2 : 1;
                this.addPoints(winnerTeam);
                if (this.state !== STATES.GAME_OVER) this.startRound();
                return GameResponse.success(this.state, { winner: winnerTeam });
            }
        }

        return GameResponse.error(this.state, "Resposta de desafio inválida.");
    }

    addPoints(team) {
        if (team === 0) return;
        if (team === 1) this.scoreTeam1 += this.round.roundValue;
        if (team === 2) this.scoreTeam2 += this.round.roundValue;

        if (this.scoreTeam1 >= 12 || this.scoreTeam2 >= 12) this.state = STATES.GAME_OVER;
    }

    challengeResponse(player, response) {
        if (this.state === STATES.WAITING_FOR_TRUCO && this.round.lastChallenge != player.team) {
            if (response == RESPONSES.INCREASE) {
                this.round.lastChallenge = player.team;
                this.round.increaseRoundValue();
                return {
                    success: true,
                    state: this.state
                }
            }
        }
    }

    addPoints(team) {
        if (team == 0) return;
        if (team == 1) this.scoreTeam1 += this.round.roundValue;
        if (team == 2) this.scoreTeam2 += this.round.roundValue;

        if (this.scoreTeam1 >= 12 || this.scoreTeam2 >= 12) this.state = STATES.GAME_OVER;
    }
}