// const { LEFT } = require("phaser");

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

// let turned_tiles = []

// let ws = null;

class FFA extends Phaser.Scene {
    constructor() {
        super("FFA")
    }

    preload() {
        
        
    }

    roll_map() {
        for(let y = 0; y < gameBoard.length; y++){
            for(let x = 0; x < gameBoard[y].length; x++){
                if(gameBoard[y][x] == 0){
                    // this.add.image()
                    this.tile = this.physics.add.image(x * 32, y * 32, "stone_tile");
                    this.tile.setOrigin(0,0);
                }else{
                    this.tile = this.add.image(x * 32, y * 32, "grass_tile");
                    this.tile.setOrigin(0,0);
                }
            }
        }
    }

    create_player() {
        this.puppetList = [];
        if(game_state.player == 1){
            this.player = this.physics.add.sprite(64, 64, "edge_down")
            // this.player.setOrigin(0);
            this.controller = this.input.keyboard.createCursorKeys();
            this.player.setCollideWorldBounds(true);
            this.player.direction = "right";
            // Create Puppets for other players
            this.puppet1 = new Puppet(this, -64, -64, "edge_down", 2);
            this.puppet2 = new Puppet(this, 800 - 64, 64, "bev_down", 2);
            this.puppetList.push(this.puppet1);
            this.puppetList.push(this.puppet2);
        }else if(game_state.player == 2){
            this.player = this.physics.add.sprite(800 - 64, 64, "bev")
            // this.player.setOrigin(0);
            this.controller = this.input.keyboard.createCursorKeys();
            this.player.setCollideWorldBounds(true);
            this.player.direction = "right";
            this.puppet1 = new Puppet(this, 64, 64, "edge_down", 2);
            this.puppet2 = new Puppet(this, -100, -100, "bev_down", 2);
            this.puppetList.push(this.puppet1);
            this.puppetList.push(this.puppet2);
            // this.puppet1 = new Puppet(this, 64, 64, "edge_down", 2);
            // this.puppet1 = new Puppet(this, 64, 64, "edge_down", 2);
        }
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.remove = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }
    create() {
        // if(game_state.inLobby == false){
        this.turned_tiles = [];
            ws.addEventListener("message", data => {
                
                data = JSON.parse(data.data);
                // console.log(data);
                if(data.header == "char_state"){ // CHARSTATEUPDATE()
                    for(let i = 0; i < data.players.length; i++){
                        // console.log("Hello test");
                        if(game_state.player != data.players[i].player){
                            let target_puppet = this.puppetList[i];
                            let target_player = data.players[i];
                            target_puppet.x = target_player.posX
                            target_puppet.y = target_player.posY
                            // console.log(target_player);
                        }
                    }
                }else if(data.header == "block_down"){ // ONBLOCKDOWN()
                    console.log("Block placement");
                    this.mapState(data.yCoord, data.xCoord);
                }else if(data.header == "block_up"){
                    this.mapStateX(data.yCoord, data.xCoord);
                }
            })
        // }
        this.roll_map();
        this.create_player();
    }

    update() {
        // this.mapState();
        this.movePlayerManager();
        this.handle_block();
        // console.log(this.player.direction)
        this.updateChar();
    }

    updateChar(){
        let data = JSON.stringify({
            header: "updateChar",
            posX: this.player.x,
            posY: this.player.y,
            animState: "None",
            player: game_state.player
        })
        ws.send(data);
    }

    mapState(y, x) {
        // this.tile = this.physics.add.sprite(32*x, 32*y, "stone_tile");
        let tile = {
            tile: this.physics.add.sprite(32*x, 32*y, "stone_tile"),
            xCoord: x,
            yCoord: y
        }
        this.turned_tiles.push(tile);
    }
    mapStateX(y, x){
        // console.log("I'm trying to break something here!");
        for(let i = 0; i < this.turned_tiles.length; i++){
            if(this.turned_tiles[i].xCoord == x && this.turned_tiles[i].yCoord == y){
                this.turned_tiles[i].tile.destroy();
                // console.log("and apparently it's working!?");
            }
        }
    }

    drop_block(x, y) {
        ws.send(JSON.stringify({
            header: "drop_block",
            xCoord: x,
            yCoord: y,
            player: game_state.player
        }))
    }

    pull_block(x, y){
        ws.send(JSON.stringify({
            header: "pull_block",
            xCoord: x,
            yCoord: y,
            player: game_state.player
        }))
    }

    handle_block() {
        if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
            const offset = 55;
            // console.log("spacebar down");
            if(this.player.direction == "left"){
                let pos_grabX = this.player.x - 32;
                let pos_grabY = this.player.y + 16;
                pos_grabX = Math.floor(pos_grabX/32);
                pos_grabY = Math.floor(pos_grabY/32);
                console.log("You're looking at", pos_grabX, pos_grabY);
                this.drop_block(pos_grabX,pos_grabY);
            }else if(this.player.direction == "right"){
                let pos_grabX = this.player.x + offset;
                let pos_grabY = this.player.y + 16;
                pos_grabX = Math.floor(pos_grabX/32);
                pos_grabY = Math.floor(pos_grabY/32);
                console.log("You're looking at", pos_grabX, pos_grabY)
                this.drop_block(pos_grabX,pos_grabY);
            }else if(this.player.direction == "up"){
                let pos_grabX = this.player.x + 16;
                let pos_grabY = this.player.y - 32;
                pos_grabX = Math.floor(pos_grabX/32);
                pos_grabY = Math.floor(pos_grabY/32);
                console.log("You're looking at", pos_grabX, pos_grabY);
                this.drop_block(pos_grabX,pos_grabY);
            }else if(this.player.direction == "down"){
                let pos_grabX = this.player.x + 16;
                let pos_grabY = this.player.y + offset;
                pos_grabX = Math.floor(pos_grabX/32);
                pos_grabY = Math.floor(pos_grabY/32);
                console.log("You're looking at", pos_grabX, pos_grabY)
                this.drop_block(pos_grabX,pos_grabY);
            }
        }
        if(Phaser.Input.Keyboard.JustDown(this.remove)){
            const offset = 55;
            // console.log("spacebar down");
            if(this.player.direction == "left"){
                let pos_grabX = this.player.x - 32;
                let pos_grabY = this.player.y + 16;
                pos_grabX = Math.floor(pos_grabX/32);
                pos_grabY = Math.floor(pos_grabY/32);
                console.log("You're looking at", pos_grabX, pos_grabY);
                this.pull_block(pos_grabX,pos_grabY);
            }else if(this.player.direction == "right"){
                let pos_grabX = this.player.x + offset;
                let pos_grabY = this.player.y + 16;
                pos_grabX = Math.floor(pos_grabX/32);
                pos_grabY = Math.floor(pos_grabY/32);
                console.log("You're looking at", pos_grabX, pos_grabY)
                this.pull_block(pos_grabX,pos_grabY);
            }else if(this.player.direction == "up"){
                let pos_grabX = this.player.x + 16;
                let pos_grabY = this.player.y - 32;
                pos_grabX = Math.floor(pos_grabX/32);
                pos_grabY = Math.floor(pos_grabY/32);
                console.log("You're looking at", pos_grabX, pos_grabY);
                this.pull_block(pos_grabX,pos_grabY);
            }else if(this.player.direction == "down"){
                let pos_grabX = this.player.x + 16;
                let pos_grabY = this.player.y + offset;
                pos_grabX = Math.floor(pos_grabX/32);
                pos_grabY = Math.floor(pos_grabY/32);
                console.log("You're looking at", pos_grabX, pos_grabY)
                this.pull_block(pos_grabX,pos_grabY);
            }
        }
    }

    movePlayerManager(){
        if(this.controller.left.isDown){
            this.player.setVelocityX(-gameSettings.playerSpeed);
        }else if(this.controller.right.isDown){
            this.player.setVelocityX(gameSettings.playerSpeed);
        }else{
            this.player.setVelocityX(0);
        }
        
        if(this.controller.up.isDown){
            this.player.setVelocityY(-gameSettings.playerSpeed);
        }else if(this.controller.down.isDown){
            this.player.setVelocityY(gameSettings.playerSpeed);
        }else{
            this.player.setVelocityY(0);
        }

        if(Phaser.Input.Keyboard.JustDown(this.controller.left)){
            this.player.direction = "left";
            console.log(this.player.direction);
        }
        
        if(Phaser.Input.Keyboard.JustDown(this.controller.right)){
            this.player.direction = "right";
            console.log(this.player.direction)
        }
        
        if(Phaser.Input.Keyboard.JustDown(this.controller.up)){
            this.player.direction = "up";
            console.log(this.player.direction)
        }
        
        if(Phaser.Input.Keyboard.JustDown(this.controller.down)){
            this.player.direction = "down";
            console.log(this.player.direction)
        }

    }
}