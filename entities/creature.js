/* A Creature is a creature that can can move*/
class Creature extends Entity {
    #moving_speed_x
    #moving_speed_y
    #current_moving_speed_x
    #current_moving_speed_y
    #animations
    #current_action
    #direction_facing
    #mapRef = null

    constructor(category, type, subType, x, y, mapRef) {
        super(category, type, subType, x, y);
        this.#moving_speed_x = 1
        this.#moving_speed_y = 1
        this.#current_moving_speed_x = 0
        this.#current_moving_speed_y = 0
        this.#animations = {}
        this.#direction_facing = "r"
        this.#mapRef = mapRef
        console.assert(this.#mapRef != null)
        this.setCurrentAction("idle")
        for (const [key, value] of Object.entries(this.getJson()["animations"])) {
            this.setAnimation(key, value[0] * this.getWidth(), value[1] * this.getHeight(), value[2], 1 / value[2], true);
        }
    }

    getMovingSpeedX() {
        return this.#moving_speed_x
    }


    getMovingSpeedY() {
        return this.#moving_speed_y
    }

    setMovingSpeedX(speed) {
        this.#moving_speed_x = speed
    }

    setMovingSpeedY(speed) {
        this.#moving_speed_y = speed
    }

    getCurrentMovingSpeedX() {
        return this.#current_moving_speed_x
    }

    setCurrentMovingSpeedX(speed) {
        this.#current_moving_speed_x = Math.round(speed)
    }

    getCurrentMovingSpeedY() {
        return this.#current_moving_speed_y
    }

    setCurrentMovingSpeedY(speed) {
        this.#current_moving_speed_y = Math.round(speed)
    }

    setAnimation(name, xStart, yStart, frameCount, frameDuration, loop) {
        this.#animations[name] = new Animator(this.getSpriteSheet(), xStart, yStart, this.getTileWidth(), this.getTileHeight(), frameCount, frameDuration, 0, false, loop)
    }

    getAnimation(name) {
        return this.#animations[name];
    }

    getCurrentAnimation() {
        return this.getAnimation(this.getCurrentAction());
    }

    getDirectionFacing() {
        return this.#direction_facing;
    }

    setDirectionFacing(dirt) {
        this.#direction_facing = dirt;
    }

    getCurrentAction() {
        return this.#current_action;
    }

    setCurrentAction(action, widthDirectionFacing) {
        if (widthDirectionFacing === undefined || widthDirectionFacing === true) {
            this.#current_action = action + "_" + this.getDirectionFacing();
        } else {
            this.#current_action = action;
        }
    }

    update() {
        if (this.getCurrentMovingSpeedX() !== 0) {
            if (this.getCurrentMovingSpeedX() > 0) {
                for (let i = 0; i < Math.floor(this.getCurrentMovingSpeedX() / Level.getTileSize()); i++) {
                    this.setPixelX(this.getPixelX() + Level.getTileSize())
                    if (!this.#mapRef.canEnterTile(this.getBlockX(), this.getBlockY())) {
                        this.setBlockX(Math.floor(this.getBlockX()) - 0.01)
                    }
                }
                this.setPixelX(this.getPixelX() + this.getCurrentMovingSpeedX() % Level.getTileSize())
                if (!this.#mapRef.canEnterTile(this.getBlockX(), this.getBlockY())) {
                    this.setBlockX(Math.floor(this.getBlockX()) - 0.01)
                }
            } else {
                for (let i = 0; i < Math.floor((-this.getCurrentMovingSpeedX()) / Level.getTileSize()); i++) {
                    this.setPixelX(this.getPixelX() - Level.getTileSize())
                    if (!this.#mapRef.canEnterTile(this.getBlockX(), this.getBlockY())) {
                        this.setBlockX(Math.floor(this.getBlockX()) + 1)
                    }
                }
                this.setPixelX(this.getPixelX() + this.getCurrentMovingSpeedX() % Level.getTileSize())
                if (!this.#mapRef.canEnterTile(this.getBlockX(), this.getBlockY())) {
                    this.setBlockX(Math.floor(this.getBlockX()) + 1)
                }
            }

        }
        if (this.getCurrentMovingSpeedY() !== 0) {
            if (this.getCurrentMovingSpeedY() > 0) {
                for (let i = 0; i < Math.floor(this.getCurrentMovingSpeedY() / Level.getTileSize()); i++) {
                    this.setPixelY(this.getPixelY() + Level.getTileSize())
                    if (!this.#mapRef.canEnterTile(this.getBlockX(), this.getBlockY())) {
                        this.setBlockY(Math.floor(this.getBlockY()) - 0.01)
                    }
                }
                this.setPixelY(this.getPixelY() + this.getCurrentMovingSpeedY() % Level.getTileSize())
                if (!this.#mapRef.canEnterTile(this.getBlockX(), this.getBlockY())) {
                    this.setBlockY(Math.floor(this.getBlockY()) - 0.01)
                }
            } else {
                for (let i = 0; i < Math.floor((-this.getCurrentMovingSpeedY()) / Level.getTileSize()); i++) {
                    this.setPixelY(this.getPixelY() - Level.getTileSize())
                    if (!this.#mapRef.canEnterTile(this.getBlockX(), this.getBlockY())) {
                        this.setBlockY(Math.floor(this.getBlockY()) + 1)
                    }
                }
                this.setPixelY(this.getPixelY() + this.getCurrentMovingSpeedY() % Level.getTileSize())
                if (!this.#mapRef.canEnterTile(this.getBlockX(), this.getBlockY())) {
                    this.setBlockY(Math.floor(this.getBlockY()) + 1)
                }
            }

        }
    }

    display(ctx, offsetX, offsetY) {
        this.getCurrentAnimation().drawFrame(GAME_ENGINE.clockTick, ctx, this.getPixelX() + offsetX, this.getPixelY() + offsetY, this.getWidth(), this.getHeight())
    };
}