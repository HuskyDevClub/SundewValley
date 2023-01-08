class Tile {

    static tileAssetsManager = new TileAssetsManager()

    constructor(image) {
        this.image = image
    }

    static queueNecessaryAssets(_assetManager, _jsonManager) {
        _assetManager.queueDownload("./images/tilemaps/spring.png")
        _assetManager.queueDownload("./images/tilemaps/summer.png")
        _assetManager.queueDownload("./images/tilemaps/autumn.png")
        _assetManager.queueDownload("./images/tilemaps/winter.png")
        _jsonManager.queueDownload("./images/tilemaps/tilemaps.json")
    }

    static getTileSize() {
        return Math.round(gameEngine.ctx.canvas.width / 20)
    }

    draw(ctx, x, y, season) {
        if (Tile.tileAssetsManager.isEmpty()) {
            Tile.tileAssetsManager.setSprite("spring", ASSET_MANAGER.getAsset("./images/tilemaps/spring.png"), JSON_MANAGER.getJson("./images/tilemaps/tilemaps.json"))
            Tile.tileAssetsManager.setSprite("summer", ASSET_MANAGER.getAsset("./images/tilemaps/summer.png"), JSON_MANAGER.getJson("./images/tilemaps/tilemaps.json"))
            Tile.tileAssetsManager.setSprite("autumn", ASSET_MANAGER.getAsset("./images/tilemaps/autumn.png"), JSON_MANAGER.getJson("./images/tilemaps/tilemaps.json"))
            Tile.tileAssetsManager.setSprite("winter", ASSET_MANAGER.getAsset("./images/tilemaps/winter.png"), JSON_MANAGER.getJson("./images/tilemaps/tilemaps.json"))
        }
        let block_size = Tile.getTileSize()
        Tile.tileAssetsManager.drawSprite(ctx, season, this.image, x * block_size, y * block_size, block_size, block_size)
    }
}