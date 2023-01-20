class Pig extends Animal {
    constructor(variance, x, y) {
        super("pig", variance, x, y)
        this.setSize(Level.getTileSize() * 0.75, Level.getTileSize() * 0.75)
    }
}