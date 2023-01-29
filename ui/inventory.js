class Inventory extends AbstractTiledMap {
    #myContainer
    #characterRef

    constructor(characterRef) {
        super("./ui/inventory.json");
        this.#characterRef = characterRef
        this.#myContainer = new GameObjectsMapContainer(characterRef.getInventory())
        this.isVisiable = true
        this.setTileSize(Math.floor(GAME_ENGINE.ctx.canvas.width / 50))
    }

    draw(ctx) {
        if (this.isVisiable) {
            this.setPixelRight(ctx.canvas.width)
            this.setPixelY(0)
            this.drawTiles(ctx, null, null, null, null, this.getPixelX(), this.getPixelY())
            ctx.font = `${this.getTileSize()}px serif`
            ctx.fillText(this.#characterRef.getMoney(), this.getPixelRight() - this.getTileSize() * 28, this.getPixelY() + this.getTileSize() * 2)
        }
    }
}