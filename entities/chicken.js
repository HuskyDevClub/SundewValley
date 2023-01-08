class Chicken extends Entity {
    constructor(x, y) {
        super("chicken", x, y)
        this.__moving_speed_x = 0
        this.__moving_speed_y = 0
        this.__action_count_down = 0
        this.setScale(5)
    }

    update() {
        if (this.__action_count_down > 0) {
            this.__action_count_down -= 1
            this.setX(this.getX() + this.__moving_speed_x)
            this.setY(this.getY() + this.__moving_speed_y)
        } else {
            this.__moving_speed_x = 0
            this.__moving_speed_y = 0
            switch (getRandomIntInclusive(0, 4)) {
                case 0:
                    this.setCurrentAction("idle")
                    this.__action_count_down = getRandomIntInclusive(50, 200)
                    break
                // up
                case 1:
                    this.__moving_speed_y = -this.getMovingSpeed()
                    this.setCurrentAction("move")
                    this.__action_count_down = getRandomIntInclusive(50, 200)
                    break
                // down
                case 2:
                    this.__moving_speed_y = this.getMovingSpeed()
                    this.setCurrentAction("move")
                    this.__action_count_down = getRandomIntInclusive(50, 200)
                    break
                // left
                case 3:
                    this.__moving_speed_x = -this.getMovingSpeed()
                    this.setDirectionFacing("l")
                    this.setCurrentAction("move")
                    this.__action_count_down = getRandomIntInclusive(50, 200)
                    break
                // right
                case 4:
                    this.__moving_speed_x = this.getMovingSpeed()
                    this.setDirectionFacing("r")
                    this.setCurrentAction("move")
                    this.__action_count_down = getRandomIntInclusive(50, 200)
                    break
            }
        }
    };

    draw(ctx) {
        this.setX(Math.min(Math.max(this.getX(), 0), ctx.canvas.clientWidth))
        this.setY(Math.min(Math.max(this.getY(), 0), ctx.canvas.clientHeight))
        super.draw(ctx)
    };
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

