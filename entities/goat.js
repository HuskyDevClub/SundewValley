class Goat extends Animal {
    constructor(variance, x, y, mapRef) {
        super("goat", variance, x, y, mapRef)
        this.setSize(Level.getTileSize() * 0.75, Level.getTileSize() * 0.75)
    }
}