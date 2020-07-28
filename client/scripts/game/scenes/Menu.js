class Menu extends Phaser.Scene {
    constructor() {
        super("mainMenu")
    }

    preload(){

    }

    create() {
        this.add.text(100, 100, "Chain Knights: Alpha", {font: "25px Arial", fill: "yellow"})
        this.add.text(150, 150, "Go Online (1v1)", {font: "18px Arial", fill: "lightblue"})
        this.add.text(150, 200, "About", {font: "18px Arial", fill: "lightblue"})
        // this.pointer = this.add.image(120, 210, "pointer")
        this.pointer = this.add.image(120, 160, "pointer")
        // THIS IS FOR TESTING
        // setTimeout(() => {
        //     this.scene.start("FFA")
        // }, 3000)
        this.menu_state = {
            choice: 1,
        }
        this.inputMaker();
    }

    inputMaker() {
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.decide = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        if(this.menu_state.choice == 1){
            this.pointer.x = 120;
            this.pointer.y = 160;
        }else if(this.menu_state.choice == 2){
            this.pointer.x = 120;
            this.pointer.y = 210;
        }

        this.menuInputHandler();
    }

    menuInputHandler(){
        if(Phaser.Input.Keyboard.JustDown(this.downKey)){
            this.menu_state.choice++;
            if(this.menu_state.choice > 2){
                this.menu_state.choice = 1;
            }
        }
        if(Phaser.Input.Keyboard.JustDown(this.upKey)){
            this.menu_state.choice--;
            if(this.menu_state.choice < 1){
                this.menu_state.choice = 2;
            }
            
        }
        if(Phaser.Input.Keyboard.JustDown(this.decide)){
            switch(this.menu_state.choice){
                case 1: console.log("Go to lobby");
                    this.scene.start("Lobby");
                    break;
                case 2: console.log("Go to about");
                    break;
            }
        }
    }
}
