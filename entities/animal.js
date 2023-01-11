class Animal extends Creature {

    #current_moving_speed_x
    #current_moving_speed_y
    #current_action_count_down

    constructor(type, subType, x, y) {
        super("animals", type, subType, x, y);
        this.#current_moving_speed_x = 0
        this.#current_moving_speed_y = 0
        this.#current_action_count_down = 0
    }

    update() {
        if (this.#current_action_count_down > 0) {
            this.#current_action_count_down -= 1
            this.setPixelX(this.getPixelX() + this.#current_moving_speed_x)
            this.setPixelY(this.getPixelY() + this.#current_moving_speed_y)
        } else {
            this.#current_moving_speed_x = 0
            this.#current_moving_speed_y = 0
            switch (getRandomIntInclusive(0, 4)) {
                case 0:
                    this.setCurrentAction("idle")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
                // up
                case 1:
                    this.#current_moving_speed_y = -this.getMovingSpeed()
                    this.setCurrentAction("move")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
                // down
                case 2:
                    this.#current_moving_speed_y = this.getMovingSpeed()
                    this.setCurrentAction("move")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
                // left
                case 3:
                    this.#current_moving_speed_x = -this.getMovingSpeed()
                    this.setDirectionFacing("l")
                    this.setCurrentAction("move")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
                // right
                case 4:
                    this.#current_moving_speed_x = this.getMovingSpeed()
                    this.setDirectionFacing("r")
                    this.setCurrentAction("move")
                    this.#current_action_count_down = getRandomIntInclusive(50, 200)
                    break
            }
        }
    };

    draw(ctx) {
        this.setPixelX(Math.min(Math.max(this.getPixelX(), 0), ctx.canvas.clientWidth))
        this.setPixelY(Math.min(Math.max(this.getPixelY(), 0), ctx.canvas.clientHeight))
        super.draw(ctx)
    };
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}