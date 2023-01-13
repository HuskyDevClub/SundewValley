class Crop extends Entity {
    #stage
    #countDown

    constructor(type, x, y) {
        super("crops", type, null, x, y);
        this.#stage = 1
        this.#countDown = 500
    }

    update() {
        if (this.#countDown > 0) {
            this.#countDown -= 1
        } else if (this.#countDown === 0) {
            this.#stage += 1
            this.#countDown = this.#stage < this.getJson()["tilecount"] ? 500 : -1
        }
    }

    getStage() {
        return this.#stage
    }

    getTimeUntilNextStage() {
        return this.#countDown
    }

    draw(ctx) {
        ctx.drawImage(
            this.getSpriteSheet(),
            (this.#stage - 1) * this.getTileWidth(), 0, this.getWidth(), this.getHeight(),
            this.getPixelX(), this.getPixelY(), this.getWidth(), this.getHeight()
        );
    };
}