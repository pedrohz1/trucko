const axios = require('axios');
const io = require('socket.io')();

exports.createRoom = async (room) => {
    socket.join(room);
}

exports.deleteRoom = async (room) => {
    io.socketsLeave(room);
}

exports.joinRoom = async (room) => {
    if(room.size > 1) return new Error;
}

exports.disconnect = async (room) => {
    const quantity = room.size || 0;
    if(quantity === 0) this.deleteRoom(roomName);
}