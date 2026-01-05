export function gameServices(io, rooms){
    io.on('connection', (socket) => {

        socket.on("disconnect", (reason) => {
            console.log(rooms);
        });
    })
}