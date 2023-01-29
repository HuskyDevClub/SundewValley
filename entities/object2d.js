class GameObject2d extends Abstract2dGameObject {
    #w = 0
    #h = 0

    constructor(x, y, width, height) {
        super(x, y)
        this.#w = width
        this.#h = height
    }

    getWidth() {
        return this.#w
    }

    getHeight() {
        return this.#h
    }

    setWidth(width) {
        this.#w = parseInt(width)
    }

    setHeight(height) {
        this.#h = parseInt(height)
    }

    setSize(width, height) {
        this.setWidth(width)
        this.setHeight(height)
    }
}