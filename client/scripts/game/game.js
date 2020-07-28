const gameSettings = {
    playerSpeed: 200,
}
window.onload = function() {
    const config = {
        width: 800,
        height: 640,
        backgroundColor: 0x000000,
        scene: [bootLoader, Menu, Lobby, FFA, GameOver],
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                debug: true
            }
        }
    }
    let game = new Phaser.Game(config);
}