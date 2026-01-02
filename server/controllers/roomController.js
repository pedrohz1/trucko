const { Player } = require('../models/Player');
const PlayerRepository = require('../models/repo/PlayerRepository');

exports.joinRoom = (req, res) => {
    const Player = new Player(req.body.playerName);

    PlayerRepository.addPlayer(Player);
}

exports.leaveRoom = (req, res) => {
    PlayerRepository.removePlayer(req.body.playerName);
}