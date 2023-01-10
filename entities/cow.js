class Cow extends Animal {
    constructor(variance, x, y) {
        super("cow", variance, x, y)
        this.setSize(Tile.getTileSize() * 0.75, Tile.getTileSize() * 0.75)
    }
}