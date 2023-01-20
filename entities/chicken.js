class Chicken extends Animal {
    constructor(variance, x, y) {
        super("chicken", variance, x, y)
        this.setSize(Level.getTileSize() * 0.5, Level.getTileSize() * 0.5)
    }
}
