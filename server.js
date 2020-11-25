const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];
const app = require('./app');
const port = config.node_server_port;
const fs = require('fs');
const privateKey = fs.readFileSync(config.private_key, 'utf8');
const certificate = fs.readFileSync(config.certificate, 'utf8');
const credentials = {key: privateKey, cert: certificate};
const https = require('https').createServer(credentials, app);
const io = require('socket.io')(https);
require('./socket')(io);

https.listen(port, () => {
    console.log('Example app listening on port ' + config.node_server_port);
})