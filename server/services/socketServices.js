const axios = require('axios');
const io = require('socket.io')();
const Rooms = require('../models/Room');

exports.createRoom = async (roomName) => {
    Rooms.create({ name: roomName });
    socket.join(roomName);
}

exports.deleteRoom = async (roomName) => {
    if(Rooms.findOne({ name: roomName }) == null) return;    

    Rooms.deleteOne({ name: roomName });
    io.socketsLeave(roomName);
}

exports.joinRoom = async (roomName) => {
    if(Rooms.findOne({ name: roomName }) == null) throw new Error('Sala não existe');
    
    Rooms.findOneAndUpdate({ name: roomName }, {players: Rooms.players + 1});
    socket.join(roomName);
}

exports.disconnect = async (room) => {
    const quantity = room.size || 0;
    if(quantity === 0) this.deleteRoom(roomName);
}