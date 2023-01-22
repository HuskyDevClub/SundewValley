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
        // check special action
        if (Controller.Q === true) {
            this.setCurrentAction("water")
            is_idle = false
        } else if (Controller.E === true) {
            this.setCurrentAction("dig")
            is_idle = false
        } else {
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
        if (is_idle) {
            this.setCurrentAction("idle")
        }
        super.update()
    };
}