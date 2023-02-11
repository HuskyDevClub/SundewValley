class TiledStaticImage extends AbstractTiledMap {
    constructor(_path) {
        super(_path);
    }

    setWidth(value) {
        this.setTileWidth(value / this.getColumn())
    }

    setHeight(value) {
        this.setTileHeight(value / this.getRow())
    }

    draw(ctx) {
        this.drawTiles(ctx)
    }
}