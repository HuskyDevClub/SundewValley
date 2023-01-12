class Player extends Character {
    constructor(x, y) {
        super("player", x, y)
        this.setMovingSpeedX(5)
        this.setMovingSpeedY(5)
        this.setSize(Tile.getTileSize() * 1.5, Tile.getTileSize() * 1.5)
    }

    update() {
        let is_idle = true
        this.setCurrentMovingSpeedX(0)
        this.setCurrentMovingSpeedY(0)
        // check special action
        if (gameEngine.Q === true) {
            this.setCurrentAction("water")
            is_idle = false
        } else if (gameEngine.E === true) {
            this.setCurrentAction("dig")
            is_idle = false
        } else {
            // move left or right
            if (gameEngine.left === true) {
                this.setDirectionFacing("l")
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedX(-this.getMovingSpeedX())
                is_idle = false
            } else if (gameEngine.right === true) {
                this.setDirectionFacing("r")
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedX(this.getMovingSpeedX())
                is_idle = false
            }
            // move up or down
            if (gameEngine.up === true) {
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedY(-this.getMovingSpeedY())
                is_idle = false
            } else if (gameEngine.down === true) {
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedY(this.getMovingSpeedY())
                is_idle = false
            }
        }
        if (is_idle) {
            this.setCurrentAction("idle")
        }
        super.update()
    };

    draw(ctx) {
        this.setPixelX(Math.min(Math.max(this.getPixelX(), 0), ctx.canvas.clientWidth - this.getWidth()))
        this.setPixelY(Math.min(Math.max(this.getPixelY(), 0), ctx.canvas.clientHeight - this.getHeight()))
        super.draw(ctx)
    };
}