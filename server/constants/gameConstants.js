export const STATES = {
    LOBBY: 'LOBBY',
    PLAYING: 'PLAYING',
    WAITING_FOR_TRUCO: 'WAITING_FOR_TRUCO',
    GAME_OVER: 'GAME_OVER'
}

export const RESPONSES = {
    INCREASE: 'INCREASE',
    ACCEPT: 'ACCEPT',
    RUN: 'RUN'
}

export class GameResponse {
    static success(state, data = null) {
        return {
            success: true,
            state: state,
            message: null,
            data: data
        };
    }

    static error(state, message) {
        return {
            success: false,
            state: state,
            message: message,
            data: null
        };
    }
}