class GameObject2d {
    #x = 0
    #y = 0
    #w = 0
    #h = 0

    constructor(x, y, width, height) {
        this.#x = x
        this.#y = y
        this.#w = width
        this.#h = height
    }

    getPixelX() {
        return this.#x
    }

    getPixelY() {
        return this.#y
    }

    setPixelX(x) {
        this.#x = x
    }

    setPixelY(y) {
        this.#y = y
    }

    getPixelRight() {
        return this.#x + this.#w
    }

    getPixelBottom() {
        return this.#y + this.#h
    }

    setPixelRight(right) {
        this.#x = right - this.#w
    }

    setPixelBottom(bottom) {
        this.#y = bottom - this.#h
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

    draw(ctx) {
        this.display(ctx, 0, 0)
    }

    display(ctx, offsetX, offsetY) {
        throw new Error('You have to implement the method display!');
    };
}