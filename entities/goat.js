class Goat extends Animal {
    constructor(variance, x, y) {
        super("goat", variance, x, y)
        this.setSize(Tile.getTileSize() * 0.75, Tile.getTileSize() * 0.75)
    }
}