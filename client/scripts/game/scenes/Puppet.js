class Puppet extends Phaser.GameObjects.Sprite{
    constructor(scene, posX, posY, img, player){
        super(scene, posX, posY, img);
        this.player = player;


        scene.add.existing(this);
        // scene.puppets.add(this);


    }
}