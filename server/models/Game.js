import { Round } from "./Round.js";

const STATES = {
    LOBBY: 'LOBBY',
    PLAYING: 'PLAYING',
    WAITING_FOR_TRUCO: 'WAITING_FOR_TRUCO',
    GAME_OVER: 'GAME_OVER'
}

export class Game {
    constructor(roomName, player, numMaxPlayers) {
        this.roomName = roomName;

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

        player.setId(this.numPlayers);
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

    //---

    startRound() {
        this.state = STATES.PLAYING;
        this.round = new Round();
    }

    playCard(player, card) {
        if (this.state === STATES.PLAYING && this.round.playing === player.id) {
            const result = this.round.cardPlayed(player, card);
            if (result.end) {
                this.addPoints(result.winnerTeam);
                if (this.state != STATES.GAME_OVER) this.startRound();
            }

            return this.state;
        }

        throw new Error("Você não pode jogar agora!");
    }

    addPoints(team) {
        if (team == 1) this.scoreTeam1 += this.round.roundValue;
        if (team == 2) this.scoreTeam2 += this.round.roundValue;

        if (this.scoreTeam1 >= 12 || this.scoreTeam2 >= 12) this.state = STATES.GAME_OVER;
    }
}