class Player extends Character {
    constructor(x, y) {
        super("player", x, y)
        this.setMovingSpeed(5)
        this.setSize(Tile.getTileSize() * 1.5, Tile.getTileSize() * 1.5)
    }

    update() {
        let is_idle = true
        if (gameEngine.left === true) {
            this.setDirectionFacing("l")
            this.setCurrentAction("move")
            this.setPixelX(this.getPixelX() - this.getMovingSpeed())
            is_idle = false
        } else if (gameEngine.right === true) {
            this.setDirectionFacing("r")
            this.setCurrentAction("move")
            this.setPixelX(this.getPixelX() + this.getMovingSpeed())
            is_idle = false
        }
        if (gameEngine.up === true) {
            this.setCurrentAction("move")
            this.setPixelY(this.getPixelY() - this.getMovingSpeed())
            is_idle = false
        } else if (gameEngine.down === true) {
            this.setCurrentAction("move")
            this.setPixelY(this.getPixelY() + this.getMovingSpeed())
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
        this.setPixelX(Math.min(Math.max(this.getPixelX(), 0), ctx.canvas.clientWidth - this.getWidth()))
        this.setPixelY(Math.min(Math.max(this.getPixelY(), 0), ctx.canvas.clientHeight - this.getHeight()))
        super.draw(ctx)
    };
}