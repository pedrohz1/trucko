const io = require('socket.io');
const socketServices = require('../services/socketServices');

exports.createRoom = async (req, res, roomName) => {
    await socketServices.createRoom({ roomName });
    res.render('truco');
}

exports.joinRoom = async () => {
    await socketServices.joinRoom({ roomName });
    res.render('truco');
}

socket.on('disconnect', async () => {
    if(socket.rooms.length > 1) {        
        await socketServices.disconnect(socket.rooms[1]);
    }
})

exports.deleteRoom = async () => {
    await socketServices.deleteRoom({ roomName });
    res.render('index');
}