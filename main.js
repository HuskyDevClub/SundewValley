const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./images/sprites/player.png");
ASSET_MANAGER.queueDownload("./images/sprites/chicken.png")

const JSON_MANAGER = new JsonManager();

JSON_MANAGER.queueDownload("./images/sprites/player.json");
JSON_MANAGER.queueDownload("./images/sprites/chicken.json");

JSON_MANAGER.downloadAll(() => {
    ASSET_MANAGER.downloadAll(() => {
        const canvas = document.getElementById("gameWorld");
        const ctx = canvas.getContext("2d");

        gameEngine.level.addEntity(new Player(10, 10));
        gameEngine.level.addEntity(new Chicken(50, 50));

        gameEngine.init(ctx);

        gameEngine.start();
    })
})
