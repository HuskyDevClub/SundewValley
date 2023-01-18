class Player extends Character {
    constructor(name, x, y) {
        super(name, "player", x, y)
        this.setMovingSpeedX(5)
        this.setMovingSpeedY(5)
        this.setSize(Tile.getTileSize() * 1.5, Tile.getTileSize() * 1.5)
    }

    update() {
        let is_idle = true
        this.setCurrentMovingSpeedX(0)
        this.setCurrentMovingSpeedY(0)
        // check special action
        if (GAME_ENGINE.Q === true) {
            this.setCurrentAction("water")
            is_idle = false
        } else if (GAME_ENGINE.E === true) {
            this.setCurrentAction("dig")
            is_idle = false
        } else {
            // move left or right
            if (GAME_ENGINE.left === true) {
                this.setDirectionFacing("l")
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedX(-this.getMovingSpeedX())
                is_idle = false
            } else if (GAME_ENGINE.right === true) {
                this.setDirectionFacing("r")
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedX(this.getMovingSpeedX())
                is_idle = false
            }
            // move up or down
            if (GAME_ENGINE.up === true) {
                this.setCurrentAction("move")
                this.setCurrentMovingSpeedY(-this.getMovingSpeedY())
                is_idle = false
            } else if (GAME_ENGINE.down === true) {
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