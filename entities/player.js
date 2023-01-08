class Player extends Entity {
    constructor(x, y) {
        super("player", x, y)
        this.setMovingSpeed(5)
        this.setScale(4)
    }

    update() {
        let is_idle = true
        if (gameEngine.left === true) {
            this.setDirectionFacing("l")
            this.setCurrentAction("move")
            this.setX(this.getX() - this.getMovingSpeed())
            is_idle = false
        } else if (gameEngine.right === true) {
            this.setDirectionFacing("r")
            this.setCurrentAction("move")
            this.setX(this.getX() + this.getMovingSpeed())
            is_idle = false
        }
        if (gameEngine.up === true) {
            this.setCurrentAction("move")
            this.setY(this.getY() - this.getMovingSpeed())
            is_idle = false
        } else if (gameEngine.down === true) {
            this.setCurrentAction("move")
            this.setY(this.getY() + this.getMovingSpeed())
            is_idle = false
        }

        if (gameEngine.Q === true) {
            this.setCurrentAction("water")
            is_idle = false
        } else if (gameEngine.E === true) {
            this.setCurrentAction("dig")
            is_idle = false
        }

        if (is_idle) {
            this.setCurrentAction("idle")
        }
    };

    draw(ctx) {
        this.setX(Math.min(Math.max(this.getX(), 0), ctx.canvas.clientWidth - this.getWidth()))
        this.setY(Math.min(Math.max(this.getY(), 0), ctx.canvas.clientHeight - this.getHeight()))
        super.draw(ctx)
    };
}