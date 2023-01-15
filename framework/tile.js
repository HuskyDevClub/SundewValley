class Tile {

    static tileAssetsManager = new TileAssetsManager()

    constructor(image) {
        this.image = image
    }

    static getTileSize() {
        return Math.round(gameEngine.ctx.canvas.width / 20)
    }

    draw(ctx, x, y) {
        let block_size = Tile.getTileSize()
        Tile.tileAssetsManager.drawSprite(ctx, null, this.image, x * block_size, y * block_size, block_size, block_size)
    }
}