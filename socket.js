module.exports = (io) => {
    let count_users = [];
    let myroom = null;

    io.on('connection', (socket) => {
        // console.log('a user connected');

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
                socket.join(myroom);
            } else {
                socket.emit('message', {'too_many_users': true});
            }
        });

        socket.on('disconnect', () => {
            count_users.shift();
        });

        socket.on('video-chat-room', (msg) => {
            socket.to(myroom).emit('message', msg);
        });

    });

}