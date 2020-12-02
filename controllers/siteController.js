const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

exports.index_get = (req, res) => {
    res.render('index', { title: 'Webrtc skeleton', room_id: req.sessionID });
}

exports.room_get = (req, res) => {
    res.render('videochat', { title: 'Webrtc videochat', room: req.params.room, ice_config: JSON.stringify(config.iceConfig) });
}