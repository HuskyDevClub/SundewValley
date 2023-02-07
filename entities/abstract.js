class Abstract2dGameObject {
    #x = 0
    #y = 0

    constructor(x, y) {
        this.#x = x
        this.#y = y
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
        return this.#x + this.getWidth()
    }

    getPixelBottom() {
        return this.#y + this.getHeight()
    }

    setPixelRight(right) {
        this.#x = right - this.getWidth()
    }

    setPixelBottom(bottom) {
        this.#y = bottom - this.getHeight()
    }

    getWidth() {
        return 0
    }

    getHeight() {
        return 0
    }

    // if the mouse is hovering this item
    isHovering() {
        return this.getPixelX() < Controller.mouse.x && Controller.mouse.x < this.getPixelRight() && this.getPixelY() < Controller.mouse.y && Controller.mouse.y < this.getPixelRight()
    }

    draw(ctx) {
        this.display(ctx, 0, 0)
    }

    display(ctx, offsetX, offsetY) {
        throw new Error('You have to implement the method display!');
    };
}