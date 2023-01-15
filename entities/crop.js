class Crop extends Entity {
    #stage
    #timePlanted
    #growPeriods

    constructor(type, x, y) {
        super("crops", type, null, x, y);
        this.#stage = 0
        this.#timePlanted = DateTimeSystem.now()
        this.#growPeriods = [1, 1, 1, 1]
    }

    update() {
        let timeUntilNextStage = this.getTimeUntilNextStageInMs()
        while (timeUntilNextStage <= 0) {
            this.#stage++;
            this.#timePlanted.setTime(DateTimeSystem.getDateObject().getTime() - timeUntilNextStage)
            timeUntilNextStage = this.getTimeUntilNextStageInMs()
        }
    }

    getStage() {
        return this.#stage
    }

    getTimeUntilNextStageInMs() {
        return this.#stage < this.#growPeriods.length ? this.#growPeriods[this.#stage] * 3600000 - DateTimeSystem.getDifferenceInMs(this.#timePlanted) : Infinity
    }

    draw(ctx) {
        ctx.drawImage(
            this.getSpriteSheet(),
            this.#stage * this.getTileWidth(), 0, this.getWidth(), this.getHeight(),
            this.getPixelX(), this.getPixelY(), this.getWidth(), this.getHeight()
        );
    };
}