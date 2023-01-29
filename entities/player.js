class Player extends Character {
    constructor(name, x, y, mapRef) {
        super(name, "player", x, y, mapRef)
        this.setMovingSpeedX(5)
        this.setMovingSpeedY(5)
        this.setSize(this.getMapReference().getTileSize() * 1.5, this.getMapReference().getTileSize() * 1.5)
        this.isIdle = true
    }

    #checkNotLoopAnimation(key, action) {
        if (key === true) {
            this.setCurrentAction(action)
            this.isIdle = false
            return true
        } else {
            this.getAnimation(action + "_l").resetElapsedTime()
            this.getAnimation(action + "_r").resetElapsedTime()
            return false
        }
    }

    #checkSpecialAction() {
        return !this.#checkNotLoopAnimation(Controller.keys["KeyQ"], "water")
            && !this.#checkNotLoopAnimation(Controller.keys["KeyE"], "dig")
            && !this.#checkNotLoopAnimation(Controller.keys["KeyC"], "cut")
    }

    update() {
        this.isIdle = true
        this.setCurrentMovingSpeedX(0)
        this.setCurrentMovingSpeedY(0)
        // for dig action, try to convert grass to dirt
        if (this.isCurrentAction("dig") && this.getCurrentAnimation().currentFrame() === 1) {
            this.getMapReference().tryConvertTileToDirt(this.getBlockX(), this.getBlockY())
        } else if (this.isCurrentAction("water") && this.getCurrentAnimation().currentFrame() === 1) {
            this.getMapReference().tryConvertTileToWateredDirt(this.getBlockX(), this.getBlockY())
        }
        // check special action
        if (this.#checkSpecialAction()) {
            // move left or right
            if (Controller.left === true) {
                this.setDirectionFacing("l")
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedX(-this.getMovingSpeedX())
                this.isIdle = false
            } else if (Controller.right === true) {
                this.setDirectionFacing("r")
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedX(this.getMovingSpeedX())
                this.isIdle = false
            }
            // move up or down
            if (Controller.up === true) {
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedY(-this.getMovingSpeedY())
                this.isIdle = false
            } else if (Controller.down === true) {
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedY(this.getMovingSpeedY())
                this.isIdle = false
            }
        }
        if (this.isIdle) {
            this.setCurrentAction("idle")
        }
        super.update()
    };
}