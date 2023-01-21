class Chicken extends Animal {
    constructor(variance, x, y, mapRef) {
        super("chicken", variance, x, y, mapRef)
        this.setSize(Level.getTileSize() * 0.5, Level.getTileSize() * 0.5)
    }
}
