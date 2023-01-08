const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./images/sprites/player.png");
ASSET_MANAGER.queueDownload("./images/sprites/chicken.png")

const JSON_MANAGER = new JsonManager();

JSON_MANAGER.queueDownload("./images/sprites/player.json");
JSON_MANAGER.queueDownload("./images/sprites/chicken.json");

Tile.queueNecessaryAssets(ASSET_MANAGER, JSON_MANAGER)

JSON_MANAGER.downloadAll(() => {
    ASSET_MANAGER.downloadAll(() => {
        const canvas = document.getElementById("gameWorld");
        const ctx = canvas.getContext("2d");

        gameEngine.init(ctx);

        gameEngine.start();
    })
})
