class Player extends Character {
    constructor(name, x, y, mapRef) {
        super(name, "player", x, y, mapRef)
        this.setMovingSpeedX(5)
        this.setMovingSpeedY(5)
        this.setSize(Level.getTileSize() * 1.5, Level.getTileSize() * 1.5)
    }

    update() {
        let is_idle = true
        this.setCurrentMovingSpeedX(0)
        this.setCurrentMovingSpeedY(0)
        // for dig action, try to convert grass to dirt
        if (this.isCurrentAction("dig") && this.getCurrentAnimation().currentFrame() === 1) {
            this.getMapReference().tryConvertTileToDirt(this.getBlockX(), this.getBlockY())
        } else if (this.isCurrentAction("water") && this.getCurrentAnimation().currentFrame() === 1) {
            this.getMapReference().tryConvertTileToWateredDirt(this.getBlockX(), this.getBlockY())
        }
        // check special action
        if (Controller.Q === true) {
            this.setCurrentAction("water")
            is_idle = false
        } else {
            this.getAnimation("water_l").resetElapsedTime()
            this.getAnimation("water_r").resetElapsedTime()
            if (Controller.E === true) {
                this.setCurrentAction("dig")
                is_idle = false
            } else {
                this.getAnimation("dig_l").resetElapsedTime()
                this.getAnimation("dig_r").resetElapsedTime()
                if (Controller.C === true) {
                    this.setCurrentAction("cut")
                    is_idle = false
                } else {
                    this.getAnimation("cut_l").resetElapsedTime()
                    this.getAnimation("cut_r").resetElapsedTime()
                    // move left or right
                    if (Controller.left === true) {
                        this.setDirectionFacing("l")
                        this.setCurrentAction("move")
                        this.setCurrentMovingSpeedX(-this.getMovingSpeedX())
                        is_idle = false
                    } else if (Controller.right === true) {
                        this.setDirectionFacing("r")
                        this.setCurrentAction("move")
                        this.setCurrentMovingSpeedX(this.getMovingSpeedX())
                        is_idle = false
                    }
                    // move up or down
                    if (Controller.up === true) {
                        this.setCurrentAction("move")
                        this.setCurrentMovingSpeedY(-this.getMovingSpeedY())
                        is_idle = false
                    } else if (Controller.down === true) {
                        this.setCurrentAction("move")
                        this.setCurrentMovingSpeedY(this.getMovingSpeedY())
                        is_idle = false
                    }
                }
            }
        }
        if (is_idle) {
            this.setCurrentAction("idle")
        }
        super.update()
    };
}