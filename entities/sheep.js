class Sheep extends Animal {
    constructor(variance, x, y) {
        super("sheep", variance, x, y)
        this.setSize(Level.getTileSize() * 0.75, Level.getTileSize() * 0.75)
    }
}