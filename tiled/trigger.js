class Trigger extends GameObject2d {

    #blockX
    #blockY
    #blockWidth
    #blockHeight

    constructor(x, y, width, height, blockX, blockY, blockWidth, blockHeight) {
        super(x, y, width, height);
        this.#blockX = blockX
        this.#blockY = blockY
        this.#blockWidth = blockWidth
        this.#blockHeight = blockHeight
    }

    draw(ctx) {
        ctx.strokeRect(this.getPixelX(), this.getPixelY(), this.getWidth(), this.getHeight())
    }

    collideWith(o) {
        return this.#blockX <= o.getBlockX() && o.getBlockX() <= this.#blockX + this.#blockWidth && this.#blockY <= o.getBlockY() && o.getBlockY() <= this.#blockY + this.#blockHeight
    }
}