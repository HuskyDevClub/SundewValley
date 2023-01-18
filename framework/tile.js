class Tile {

    static tileAssetsManager = new TileAssetsManager()

    #layers = []

    constructor(image) {
        this.image = image
    }

    static getTileSize() {
        return Math.round(GAME_ENGINE.ctx.canvas.width / 20)
    }

    addLayers(value) {
        this.#layers.push(value)
    }

    containLayer(value) {
        return value in this.#layers
    }

    draw(ctx, x, y) {
        let block_size = Tile.getTileSize()
        Tile.tileAssetsManager.drawSprite(ctx, null, this.image, x * block_size, y * block_size, block_size, block_size)
    }
}