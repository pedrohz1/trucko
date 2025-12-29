const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    players: {
        type: Number,
        default: 1,
        min: 1,
        max: 2
    },
})

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;