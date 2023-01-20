class Cow extends Animal {
    constructor(variance, x, y) {
        super("cow", variance, x, y)
        this.setSize(Level.getTileSize() * 0.75, Level.getTileSize() * 0.75)
    }
}