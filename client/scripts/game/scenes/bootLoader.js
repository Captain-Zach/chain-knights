let asset_string = "./../../../assets/";



class bootLoader extends Phaser.Scene {
    constructor() {
        super("bootLoader")
    }

    preload() {
        // UI
        this.load.image("pointer", asset_string+"UI/hand_cursor0000.png");
        this.load.image("ready_button", asset_string+"UI/ready_button.png");
        this.load.image("not_ready", asset_string+"UI/not_ready.png");
        this.load.image("start_on", asset_string+"UI/startEnabled.png");
        this.load.image("start_off", asset_string+"UI/startDisabled.png");
        //ground tiles
        this.load.image("grass_tile", asset_string + "map/tile113.png");
        this.load.image("stone_tile", asset_string + "map/tile125.png");
        //character tiles
        this.load.spritesheet("edge", asset_string + "characters/edgelord.png", {
            frameWidth: 32,
            frameHeight: 33
        });
        this.load.spritesheet("bev", asset_string + "characters/beveledLady.png", {
            frameWidth: 32,
            frameHeight:32
        });
        this.load.image("edge_down", asset_string + "characters/edge/tile000.png");
        this.load.image("bev_down", asset_string + "characters/bevelle/tile000.png")
    }

    create() {
        this.add.text(20,20, "Loading Game...");
        this.scene.start("mainMenu");
        // this.scene.start("Lobby");
        // this.scene.start("FFA");
    }
}