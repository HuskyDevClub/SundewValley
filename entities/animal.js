class Animal extends Creature {

    #current_action_count_down

    constructor(type, subType, x, y, mapRef) {
        super("animals", type, subType, x, y, mapRef);
        this.#current_action_count_down = 0
    }

    update() {
        if (this.#current_action_count_down > 0) {
            this.#current_action_count_down -= 1
        } else {
            this.setCurrentMovingSpeedX(0)
            this.setCurrentMovingSpeedY(0)
            switch (getRandomIntInclusive(0, 4)) {
                case 0:
                    this.setCurrentAction("idle")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
                // up
                case 1:
                    this.setCurrentMovingSpeedY(-this.getMovingSpeedY())
                    this.setCurrentAction("move")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
                // down
                case 2:
                    this.setCurrentMovingSpeedY(this.getMovingSpeedY())
                    this.setCurrentAction("move")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
                // left
                case 3:
                    this.setCurrentMovingSpeedX(-this.getMovingSpeedX())
                    this.setDirectionFacing("l")
                    this.setCurrentAction("move")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
                // right
                case 4:
                    this.setCurrentMovingSpeedX(this.getMovingSpeedX())
                    this.setDirectionFacing("r")
                    this.setCurrentAction("move")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
            }
        }
        super.update()
    };

    display(ctx, offsetX, offsetY) {
        this.setPixelX(Math.min(Math.max(this.getPixelX(), 0), ctx.canvas.clientWidth))
        this.setPixelY(Math.min(Math.max(this.getPixelY(), 0), ctx.canvas.clientHeight))
        super.display(ctx, offsetX, offsetY)
    };
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}