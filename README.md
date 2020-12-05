# Webrtc-skeleton
Web based video chat software skeleton, written in node.js

## Requirements

- Node.js

## Installation

- Go to the root directory of the project
- Run the "npm install" command
- Rename the config_sample.json to config.json
- Add your setting to the config.json file
- Run the "node server.js" command, or use PM2

## About config.json

#### If you run the program behind Apache2 or NGINX reverse-proxy

- Set the "node_server_http_protocol" to "http"
- You have to configure Apache2 or NGINX "https" server
- You have to configure Apache2 or NGINX reverse-proxy

#### If you run the program without reverse-proxy

- Set the "node_server_http_protocol" to "https"
- Set the "node_server_port" to "443"
- You have to set your full path of your SSL private key and certificate
- You need root privileges to start the program(e.g. sudo node server.js)

## Usage

Click "to room" on the main page, then send the url to your videochat partner!