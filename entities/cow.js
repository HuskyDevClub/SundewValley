class Cow extends Animal {
    constructor(variance, x, y, mapRef) {
        super("cow", variance, x, y, mapRef)
        this.setSize(Level.getTileSize() * 0.75, Level.getTileSize() * 0.75)
    }
}