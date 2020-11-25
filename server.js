const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];
const app = require('./app');
const port = config.node_server_port;
const http_protocol = config.node_server_http_protocol === "https" ? require('https') : require('http');
let server = http_protocol.createServer(app);
if(config.node_server_http_protocol === "https") {
    const fs = require('fs');
    const privateKey = fs.readFileSync(config.private_key, 'utf8');
    const certificate = fs.readFileSync(config.certificate, 'utf8');
    const credentials = {key: privateKey, cert: certificate};
    server = require('https').createServer(credentials, app);
}
const io = require('socket.io')(server);
require('./socket')(io);

server.listen(port, () => {
    console.log('Example app listening on port ' + config.node_server_port);
})