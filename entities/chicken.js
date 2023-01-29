class Chicken extends Animal {
    constructor(variance, x, y, mapRef) {
        super("chicken", variance, x, y, mapRef)
        this.setSize(this.getMapReference().getTileSize() * 0.5, this.getMapReference().getTileSize() * 0.5)
    }
}
