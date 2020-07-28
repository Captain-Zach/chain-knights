
// declare globals
let ws = null;
let game_state = {
    player: 1,
    inLobby: true
};

class Lobby extends Phaser.Scene {
    constructor() {
        super("Lobby")
    }

    create(){
        // function start() {
            
        // }
        game_state = {
            player : 0,
            status_1: "disconnected",
            status_2: "disconnected",
            ready: false
        }
        this.header = this.add.text(0,70, "Lobby: Free for All",{font: "25px Impact", fill: "yellow"})
        this.player1_status = this.add.text(80,150, "Player 1 : " + game_state.status_1,{font: "25px Impact", fill: "yellow"})
        this.player2_status = this.add.text(80,200, "Player 2: " + game_state.status_2,{font: "25px Impact", fill: "yellow"})
        this.startDisabled = this.add.image(500, 550, "start_off")
        this.readyButton = this.add.image(650, 550, "ready_button").setInteractive();
        this.readyButton.on("pointerdown", () => {
            this.readyUp();
            game_state.ready = true;
            this.readyButton.destroy();
        })
        this.header.x = 400 - (this.header.displayWidth/2);
        // this.header.text = "Test"
        this.connectToServer();
        startIceListener(ws);
    }

    connectToServer() {
        ws = new WebSocket("ws://localhost:8080");
        console.log("WTH")
        startRTCListener(ws);
        ws.onmessage = message => {
            // console.log(message);
            message = JSON.parse(message.data)
            // ws.send(JSON.stringify({header: "test"}));
            this.messageHandler(message);
        }
    }
    // Outbound
    readyUp(){
        let data = JSON.stringify({
            header: "ready",
            player: game_state.player,
        })
        this.notReadyButton = this.add.image(650, 550, "not_ready").setInteractive();
        this.notReadyButton.on("pointerdown", () => {
            this.unreadyUp();
            game_state.ready = false;
            this.notReadyButton.destroy();
        })
        ws.send(data);
    }

    unreadyUp(){
        let data = JSON.stringify({
            header: "unready",
            player: game_state.player,
        })
        this.readyButton = this.add.image(650, 550, "ready_button").setInteractive();
        this.readyButton.on("pointerdown", () => {
            this.readyUp();
            game_state.ready = true;
            this.readyButton.destroy();
        })
        ws.send(data);
    }
    // Inbound
    messageHandler(message){
        switch(message.header){
            case "connected": this.onConnect(message); break;
            case "UpdateLobby": this.onUpdate(message); break;
            case "startAll": this.onLaunch(); break;
        }
    }
    
    onConnect(message){
        console.log("Connect happened");
        console.log("we are player", message.player);
        game_state.player = message.player;
        
    }

    onUpdate(data){
        console.log("Updating all");
        game_state.status_1 = data.status_1;
        game_state.status_2 = data.status_2;
        this.player1_status.text = "Player 1 :"+ data.status_1;
        this.player2_status.text = "Player 2:" + data.status_2;
        if(this.readyCheck()){
            this.startReady = this.add.image(this.startDisabled.x, this.startDisabled.y, "start_on").setInteractive();
            this.startReady.on("pointerdown", () => {
                console.log("Hello world");
                this.sendStart();
            })
            
        }else{
            if(this.startReady){
                this.startReady.destroy();
            }
        }
    }

    sendStart(){
        let data = JSON.stringify({
            header: "start"
        })
        ws.send(data)
    }

    readyCheck(){
        const {status_1, status_2} = game_state
        if(status_1 != "ready") return false;
        if(status_2 != "ready") return false;
        // if(status_1 != "ready") return false;
        // if(status_1 != "ready") return false;
        return true;
    }

    onLaunch(){
        this.scene.start("FFA");
        // this.destroy();
    }

    update() {
        
    }
    
}
// Here's where things start getting HairyRTC
// First, I'm going to make an event listener that is for configuring these bad boys
// in particular.
function startRTCListener(ws){
    recieveCall(ws);
    ws.addEventListener("message", data => {
        data = JSON.parse(data.data);
        if(data.init){
            console.log("Init fired");
            makeCall(ws);
        }
    })
}
// Sends 
// const configuration = {offerToReceiveAudio: true, offerToReceiveVideo: false},{iceServers: [{urls: 'stun:stunprotocol.org'},]};
const peerConnection = new RTCPeerConnection({
    iceServers:[{urls: 'stun:stun.l.google.com:19302'}]
});
async function makeCall(ws){
    ws.addEventListener("message", async data => {
        data = JSON.parse(data.data);
        if(data.answer){
            console.log("We got an answer")
            const remoteDesc = new RTCSessionDescription(data.answer);
            await peerConnection.setRemoteDescription(remoteDesc);
            console.log(peerConnection.remoteDescription);
            // And fire up the connection for Ice stuff I guess?
            // startIceListener();
        }
    });
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log(peerConnection.localDescription);
    ws.send(JSON.stringify({offer: offer}));
}

// Receives an offer and sends an answer
async function recieveCall(ws){
    // const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
    // const peerConnection = new RTCPeerConnection(configuration);
    ws.addEventListener("message", async data => {
        data = JSON.parse(data.data);
        console.log(data);
        if(data.offer){
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            ws.send(JSON.stringify({answer: answer}));
            console.log("I got an offer");
            console.log(peerConnection.localDescription);
            console.log(peerConnection.remoteDescription);
        }
    });
}

// Listen for local ICE candidates on the local RTCPeerConnection
peerConnection.addEventListener('icecandidate', event => {
    if (event.candidate) {
        ws.send(JSON.stringify({'newCandidate': event.candidate}));
    }
});

// Listen for remote ICE candidates and add them to the local RTCPeerConnection
function startIceListener(ws){
    console.log("iceListener")
    ws.addEventListener('message', async message => {
        message = JSON.parse(message.data);
        if (message.iceCandidate) {
            console.log("we're hoping to get something");
            try {
                await peerConnection.addIceCandidate(message.iceCandidate);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
    });
    peerConnection.addEventListener("iceconnectionstatechange", event=> {
        if(peerConnection.iceConnectionState === 'checking'){
            console.log("checking for ice candidates");
        }
        if(peerConnection.iceConnectionState === "completed"){
            console.log("Done looking");
        }
    })
}

peerConnection.addEventListener("connectionstatechange", event => {
    if(peerConnection.connectionState === 'connected'){
        console.log("peers connected, god save us all.");
    }
    if(peerConnection.connectionState === "disconnected"){
        console.log("Uh oh. Connection brokie.");
    }
    if(peerConnection.connectionState === "closed"){
        console.log("I'm not sure what this even means! It's closed!?");
    }
})

peerConnection.onicecandidate = event => {
    console.log("Something something death star");
}

// let localAudio = document.querySelector('#localAudio');
document.onload = function (){
    let remoteAudio = document.querySelector('#remoteAudio');
}


navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
}).then(stream => {
    // localVideo.srcObject = stream
    localStream = stream;
    // localAudio.src = localStream;
    
    
    for (let track of localStream.getTracks()) {
        
        peerConnection.addTrack(track, localStream)
    }
})
peerConnection.ontrack= track => {
    gotRemoteStream(track);
}
// peerConnection.addTrack(null,null);
function gotRemoteStream(e){
    if (remoteAudio.srcObject !== e.streams[0]) {
        remoteAudio.srcObject = e.streams[0];
        console.log('Received remote stream');
      }
}