import { Round } from "./Round.js";
import { STATES, RESPONSES, GameResponse } from "../constants/gameConstants.js";

export class Game {
    constructor(roomName, player, numMaxPlayers) {
        this.roomName = roomName;

        player.setID(1);
        player.setTeam();

        this.players = new Map(); // ID => Player
        this.playersWithoutTeam = new Map(); // playerName => Player
        if (numMaxPlayers == 2) {
            this.players.set(1, player);
        } else {
            this.playersWithoutTeam.set(player.name, player);
        }
        this.numPlayers = 1;
        this.numMaxPlayers = numMaxPlayers;

        this.state = STATES.LOBBY;
        this.round = null;
        this.dealerIndex = 1;

        this.scoreTeam1 = 0;
        this.scoreTeam2 = 0;
    }

    addPlayer(player) {
        if (this.numMaxPlayers <= this.numPlayers) throw new Error("Capacidade máxima da sala atingida");
        if (this.players.has(player)) throw new Error("Usuário já existente na sala");

        this.numPlayers++;

        if (this.numMaxPlayers == 2) {
            this.players.set(this.numPlayers, player);

            player.setID(this.numPlayers);
            player.setTeam();

        } else {
            this.playersWithoutTeam.set(player.name, player);
        }
    }

    removePlayer(playerName, playerID) {
        if (this.playersWithoutTeam.has(playerName)) {
            this.playersWithoutTeam.delete(playerName);
            this.numPlayers--;

        } else if (this.players.has(playerID)) {
            exit.players.delete(playerID);
            this.numPlayers--;
        } else {
            return {
                success: false,
                message: "Player não encontrado"
            };
        }
        return true;
    }

    getPlayer(socketID) {
        for (let player of this.players.values()) {
            if (player.socketID === socketID) {
                return player;
            }
        }
    }

    joinTeam(playerName, ID) {
        if (!this.playersWithoutTeam.has(playerName)) throw new Error("Usuario já tem um time");

        let player = this.playersWithoutTeam.get(playerName);
        if (this.players.has(ID)) throw new Error("Posição já ocupada");

        this.players.set(ID, this.playersWithoutTeam.get(player.name));
        this.playersWithoutTeam.delete(playerName);

        player.setID(ID);
        player.setTeam();
    }

    exitTeam(player) {
        if (this.playersWithoutTeam.has(player.name)) throw new Error("Usuário sem time");

        this.playersWithoutTeam.set(player.name, player);
        this.players.delete(player.id);

        player.setID(null);
        player.setTeam();
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

        if(player1 != undefined){
            player1.setID(newID);
            player1.setTeam();
        }
        if(player2 != undefined){
            player2.setID(currentID);
            player2.setTeam();
        }
        
        
    }

    async startRound() {
        this.state = STATES.PLAYING;
        this.round = new Round(this.dealerIndex);
        await this.round.deck.startDeck();

        for (const player of this.players.values()) {
            const cards = await this.round.deck.drawHand(3);
            player.setHand(cards);
        }
    }

    playCard(player, card) {
        if (this.state === STATES.PLAYING && this.round.playing === player.id) {

            player.removeCard(card);

            const result = this.round.cardPlayed(player, card, this.numMaxPlayers);
            if (result.end) {
                this.addPoints(result.winnerTeam);
                if (this.state !== STATES.GAME_OVER) {
                    this.startRound();
                    return GameResponse.success(this.state, { roundWinner: result.winnerTeam, score1: this.scoreTeam1, score2: this.scoreTeam2, nextPlayer: this.round.playing });
                }
                if (this.state === STATES.GAME_OVER) {
                    return GameResponse.success(this.state, { gameWinner: result.winnerTeam });
                }
            }

            if (this.round.biggestCard === null) {
                return GameResponse.success(this.state, { lastPlayedCard: this.round.lastPlayedCard, biggestCard: this.round.biggestCard, nextPlayer: this.round.playing });
            }

            return GameResponse.success(this.state, { lastPlayedCard: this.round.lastPlayedCard, biggestCard: this.round.biggestCard.card, nextPlayer: this.round.playing });
        }

        return GameResponse.error(this.state, "Você não pode jogar agora!");
    }


    challenge(player) {
        if (this.state === STATES.PLAYING && this.round.playing === player.id) {
            const result = this.round.challenge(player);
            if (result.success) {
                this.state = STATES.WAITING_FOR_TRUCO;
                return GameResponse.success(this.state, result.roundValue);
            }
            return GameResponse.error(this.state, result.message);
        }

        return GameResponse.error(this.state, "Você não pode trucar agora!");
    }

    challengeResponse(player, option) {
        if (this.state === STATES.WAITING_FOR_TRUCO && this.round.lastChallenge !== player.team) {

            if (option === RESPONSES.INCREASE) {
                this.round.lastChallenge = player.team;
                this.round.increaseRoundValue();
                return GameResponse.success(this.state);
            }

            if (option === RESPONSES.ACCEPT) {
                this.round.increaseRoundValue();
                this.state = STATES.PLAYING;
                return GameResponse.success(this.state);
            }

            if (option === RESPONSES.FOLD) {
                const winnerTeam = player.team === 1 ? 2 : 1;
                this.addPoints(winnerTeam);
                if (this.state !== STATES.GAME_OVER) this.startRound();
                return GameResponse.success(this.state, { roundWinner: winnerTeam });
            }
        }

        return GameResponse.error(this.state, "Resposta de desafio inválida.");
    }

    addPoints(team) {
        this.dealerIndex = (this.dealerIndex % this.numMaxPlayers) + 1;
        if (team == 0) return;
        if (team == 1) this.scoreTeam1 += this.round.roundValue;
        if (team == 2) this.scoreTeam2 += this.round.roundValue;

        if (this.scoreTeam1 >= 12 || this.scoreTeam2 >= 12) this.state = STATES.GAME_OVER;
    }
}