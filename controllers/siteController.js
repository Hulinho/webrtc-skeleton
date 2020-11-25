exports.index_get = (req, res) => {
    res.render('index', { title: 'Videokukkancs', room_id: req.sessionID });
}

exports.room_get = (req, res) => {
    res.render('videochat', { title: 'Videochat', room: req.params.room });
}