class Chicken extends Animal {
    constructor(variance, x, y) {
        super("chicken", variance, x, y)
        this.setSize(Tile.getTileSize() * 0.5, Tile.getTileSize() * 0.5)
    }
}
