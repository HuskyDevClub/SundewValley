class Cow extends Animal {
    constructor(variance, x, y, mapRef) {
        super("cow", variance, x, y, mapRef)
        this.setSize(this.getMapReference().getTileSize() * 0.75, this.getMapReference().getTileSize() * 0.75)
    }
}