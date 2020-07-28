const cp = require('child_process');
const http = require("http");

let child = cp.fork('gameLoop.js');
const server = http.createServer();

let counter = 0;

server.on('upgrade', (request, socket) => {
    if(counter < 2){
        child.send({headers: request.headers, method: request.method}, socket);
        counter++;
    }else{
        counter=1;
        child = cp.fork('gameLoop.js');
        child.send({headers: request.headers, method: request.method}, socket);
    }

});

server.listen(8080);
