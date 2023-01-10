class Pig extends Animal {
    constructor(variance, x, y) {
        super("pig", variance, x, y)
        this.setSize(Tile.getTileSize() * 0.75, Tile.getTileSize() * 0.75)
    }
}