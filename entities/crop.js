class Crop extends Entity {
    #stage
    #timePlanted
    #growPeriods
    #scale = 0.75

    constructor(type, x, y, mapRef) {
        super("crops", type, null, x, y, mapRef);
        this.#stage = 0
        this.#timePlanted = DateTimeSystem.now()
        this.#growPeriods = [1, 1, 1, 1]
        this.setSize(this.getMapReference().getTileSize() * this.#scale, this.getMapReference().getTileSize() * this.#scale)
    }

    update() {
        let timeUntilNextStage = this.getTimeUntilNextStageInMs()
        while (timeUntilNextStage <= 0) {
            this.#stage++;
            this.#timePlanted.setTime(DateTimeSystem.getDateObject().getTime() - timeUntilNextStage)
            timeUntilNextStage = this.getTimeUntilNextStageInMs()
        }
    }

    isMatured() {
        return this.#stage >= this.#growPeriods.length
    }

    getStage() {
        return this.#stage
    }

    getTimeUntilNextStageInMs() {
        return this.isMatured() ? Infinity : this.#growPeriods[this.#stage] * 3600000 - DateTimeSystem.getDifferenceInMs(this.#timePlanted)
    }

    getPixelX() {
        return super.getPixelX() + this.getWidth() - this.getTileWidth()
    }

    getPixelY() {
        return super.getPixelY() + this.getHeight() - this.getTileHeight()
    }

    display(ctx, offsetX, offsetY) {
        ctx.drawImage(
            this.getSpriteSheet(),
            this.#stage * this.getTileWidth(), 0, this.getTileWidth(), this.getTileHeight(),
            this.getPixelX() + offsetX, this.getPixelY() + offsetY, this.getWidth(), this.getHeight()
        );
    };
}