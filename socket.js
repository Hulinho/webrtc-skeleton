module.exports = (io) => {
    let count_users = [];
    let myroom = false;
    let tmu = false;

    io.on('connection', (socket) => {
        socket.on('room', (msg) => {
            myroom = msg.room;
            count_users.push(myroom);
            let i = 0;
            count_users.forEach((v) => {
                if(v === myroom) {
                    i++
                }
            });

            if(i <= 2) {
                tmu = false;
                socket.join(myroom);
            } else {
                tmu = true;
                socket.emit('message', {'too_many_users': true});
            }
        });

        socket.on('disconnect', () => {
            count_users.shift();
        });

        socket.on('video-chat-room', (msg) => {
            if(tmu === false) {
                socket.to(myroom).emit('message', msg);
            }
        });
    });

}