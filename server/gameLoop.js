const WebSocket = require('ws');

let connections = [];

let gameBoard = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

let lobbyState = {
    player1: undefined,
    player2: undefined,
    player3: undefined,
    player4: undefined,
    p1Ready: "disconnected",
    p2Ready: "disconnected",
    p3Ready: "disconnected",
    p4Ready: "disconnected",
}

let players = []

const wss = new WebSocket.Server({noServer:true});

process.on('message', (request, socket) => {
    wss.handleUpgrade(request, socket, [], ws => {
        // ws.send("release the penguins");
        connections.push(ws);
        
        //set player identifiers, set initial connection notifications
        switch(connections.length){
            case 1: lobbyState.player1 = ws; lobbyState.p1Ready = "connected"; break;
            case 2: lobbyState.player2 = ws; lobbyState.p2Ready = "connected"; break;
            case 3: lobbyState.player3 = ws; lobbyState.p3Ready = "connected"; break;
            case 4: lobbyState.player4 = ws; lobbyState.p4Ready = "connected"; break;
        }
        if(connections.length > 1){
            lobbyState.player1.send(JSON.stringify({init: "init"}))
        }
        data = JSON.stringify({
            header: "connected",
            player: connections.length,
        });
        players.push({
            posX: 0,
            posY: 0,
            animState: "None",
            player: connections.length
        })
        ws.send(data);
        updateLobby();
        ws.on("message", data => {
            messageHandler(JSON.parse(data), ws);
        })
    })
})
// KEEP SOCKET FUNCTIONS HERE
function messageHandler(data, ws){
    //LOBBY EVENTS
    if(data.header == "ready"){ // ONREADY()
        // Update player readiness, then updateLobby();
        switch(data.player){
            case 1: lobbyState.p1Ready = "ready"; break;
            case 2: lobbyState.p2Ready = "ready"; break;
            case 3: lobbyState.p3Ready = "ready"; break;
            case 4: lobbyState.p4Ready = "ready"; break;
        }
        updateLobby();
    }else if(data.header == "unready"){ // ONUNREADY()
        // Update player readiness, then updateLobby();
        switch(data.player){
            case 1: lobbyState.p1Ready = "connected"; break;
            case 2: lobbyState.p2Ready = "connected"; break;
            case 3: lobbyState.p3Ready = "connected"; break;
            case 4: lobbyState.p4Ready = "connected"; break;
        }
        updateLobby();
    }else if(data.header == "start"){ // ONSTART()
        // Check readiness status of all players, then either launch, or don't.
        // Future note, send off double checks to all connected before launch.
        // If not all players are still connected, put this process back in the queue.
        // console.log("Help, I'm stuck!");
        if(checkStates()){
            //If all players are ready, fire off start event
            launch();
        }
    }
    // GAMEPLAY EVENTS
    if(data.header == "updateChar"){ // ONCHARUPDATE()
        // // console.log("Updating a char");
        let player = {
            posX: data.posX,
            posY: data.posY,
            animState: data.animState,
            player: data.player
        }
        // // console.log(player);
        // console.log(players);
        players[player.player-1] = player;
    }else if(data.header == "drop_block"){
        if(gameBoard[data.yCoord][data.xCoord] == 1){
            gameBoard[data.yCoord][data.xCoord] = 0;
            block_down(data.xCoord, data.yCoord);
        }
    }else if(data.header == "pull_block"){
        if(gameBoard[data.yCoord][data.xCoord] == 0){
            gameBoard[data.yCoord][data.xCoord] = 1;
            block_up(data.xCoord, data.yCoord);
        }
    }
    if(data.offer){ // Offer is made
        console.log("offer made");
        console.log(data);
        lobbyState.player2.send(JSON.stringify({offer: data.offer}));
    }if(data.answer){ // An answer is returned
        console.log("You've got your answer");
        lobbyState.player1.send(JSON.stringify({answer: data.answer}));
    }if(data.newCandidate){
        console.log("found new candidate");
        if(ws == lobbyState.player1) lobbyState.player2.send(JSON.stringify({iceCandidate:data.newCandidate}));
        if(ws == lobbyState.player2) lobbyState.player1.send(JSON.stringify({iceCandidate:data.newCandidate}));
    }
}
// HELPER
function checkStates(){
    const {p1Ready, p2Ready} = lobbyState;
        if(p1Ready != "ready") return false;
        if(p2Ready != "ready") return false;
        // if(p1Ready != "ready") return false;
        // if(p1Ready != "ready") return false;
        return true;

}
// lobby functions
function updateLobby(){
    for(let i = 0; i < connections.length; i++){
        connections[i].send(JSON.stringify({
            header: "UpdateLobby",
            status_1: lobbyState.p1Ready,
            status_2: lobbyState.p2Ready,
        }));
    }
}

function launch(){
    for(let i = 0; i < connections.length; i++){
        // // console.log("Is this our break point?");
        connections[i].send(JSON.stringify({
            header: "startAll"
        }));
    }
    setInterval(() => {
        char_state();
    }, 33);
}
// Gameplay functions

function char_state(){
    for(let i = 0; i < connections.length; i++){
        connections[i].send(JSON.stringify({
            header: "char_state",
            players: players
        }));
    }
}

function block_down(x, y){
    for(let i = 0; i < connections.length; i++){
        connections[i].send(JSON.stringify({
            header: "block_down",
            xCoord: x,
            yCoord: y,

        }));
    }
}

function block_up(x, y){
    for(let i = 0; i < connections.length; i++){
        connections[i].send(JSON.stringify({
            header: "block_up",
            xCoord: x,
            yCoord: y,

        }));
    }
}