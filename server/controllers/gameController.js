const GameService = require("../models/services/GameService");
const PlayerRepository = require("../models/repo/PlayerRepository");
const { Game } = require('../models/Game');
const { Team } = require('../models/Team')


exports.createGame = (req, res) => {
    const team1 = new Team();
    const team2 = new Team();
    
    const newGame = new Game(team1, team2);
}

exports.joinTeam = (req, res) => {
    
}

exports.playCard = (req, res) => {
    const player = PlayerRepository.getPlayer(req.body.player);
    const card = req.body.card;

    try {
        const turnResult = GameService.playCard(player, card);

        return turnResult.playedCard;
    } catch (err) {
        alert(err);
    }
}