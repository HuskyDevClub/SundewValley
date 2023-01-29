/* A Creature is a creature that can can move*/
class Creature extends Entity {
    #moving_speed_x
    #moving_speed_y
    #current_moving_speed_x
    #current_moving_speed_y
    #animations
    #current_action
    #direction_facing

    constructor(category, type, subType, x, y, mapRef) {
        super(category, type, subType, x, y, mapRef);
        this.#moving_speed_x = 1
        this.#moving_speed_y = 1
        this.#current_moving_speed_x = 0
        this.#current_moving_speed_y = 0
        this.#animations = {}
        this.#direction_facing = "r"
        this.setCurrentAction("idle")
        for (const [key, value] of Object.entries(this.getJson()["animations"])) {
            this.setAnimation(key, value[0] * this.getWidth(), value[1] * this.getHeight(), value[2], 1 / value[2], value.length > 3 ? value[3] : true);
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

    isCurrentAction(action, addDirectionFacing = true) {
        return this.#current_action.localeCompare(addDirectionFacing ? action + "_" + this.getDirectionFacing() : action) === 0;
    }

    setCurrentAction(action, addDirectionFacing = true) {
        if (addDirectionFacing) {
            this.#current_action = action + "_" + this.getDirectionFacing();
        } else {
            this.#current_action = action;
        }
    }

    update() {
        if (this.getCurrentMovingSpeedX() !== 0) {
            if (this.getCurrentMovingSpeedX() > 0) {
                for (let i = 0; i < Math.floor(this.getCurrentMovingSpeedX() / this.getMapReference().getTileSize()); i++) {
                    this.setPixelX(this.getPixelX() + this.getMapReference().getTileSize())
                    if (!this.getMapReference().canEnterTile(this.getBlockX(), this.getBlockY())) {
                        this.setBlockX(Math.floor(this.getBlockX()) - 0.01)
                    }
                }
                this.setPixelX(this.getPixelX() + this.getCurrentMovingSpeedX() % this.getMapReference().getTileSize())
                if (!this.getMapReference().canEnterTile(this.getBlockX(), this.getBlockY())) {
                    this.setBlockX(Math.floor(this.getBlockX()) - 0.01)
                }
            } else {
                for (let i = 0; i < Math.floor((-this.getCurrentMovingSpeedX()) / this.getMapReference().getTileSize()); i++) {
                    this.setPixelX(this.getPixelX() - this.getMapReference().getTileSize())
                    if (!this.getMapReference().canEnterTile(this.getBlockX(), this.getBlockY())) {
                        this.setBlockX(Math.floor(this.getBlockX()) + 1)
                    }
                }
                this.setPixelX(this.getPixelX() + this.getCurrentMovingSpeedX() % this.getMapReference().getTileSize())
                if (!this.getMapReference().canEnterTile(this.getBlockX(), this.getBlockY())) {
                    this.setBlockX(Math.floor(this.getBlockX()) + 1)
                }
            }
        }
        if (this.getCurrentMovingSpeedY() !== 0) {
            if (this.getCurrentMovingSpeedY() > 0) {
                for (let i = 0; i < Math.floor(this.getCurrentMovingSpeedY() / this.getMapReference().getTileSize()); i++) {
                    this.setPixelY(this.getPixelY() + this.getMapReference().getTileSize())
                    if (!this.getMapReference().canEnterTile(this.getBlockX(), this.getBlockY())) {
                        this.setBlockY(Math.floor(this.getBlockY()) - 0.01)
                    }
                }
                this.setPixelY(this.getPixelY() + this.getCurrentMovingSpeedY() % this.getMapReference().getTileSize())
                if (!this.getMapReference().canEnterTile(this.getBlockX(), this.getBlockY())) {
                    this.setBlockY(Math.floor(this.getBlockY()) - 0.01)
                }
            } else {
                for (let i = 0; i < Math.floor((-this.getCurrentMovingSpeedY()) / this.getMapReference().getTileSize()); i++) {
                    this.setPixelY(this.getPixelY() - this.getMapReference().getTileSize())
                    if (!this.getMapReference().canEnterTile(this.getBlockX(), this.getBlockY())) {
                        this.setBlockY(Math.floor(this.getBlockY()) + 1)
                    }
                }
                this.setPixelY(this.getPixelY() + this.getCurrentMovingSpeedY() % this.getMapReference().getTileSize())
                if (!this.getMapReference().canEnterTile(this.getBlockX(), this.getBlockY())) {
                    this.setBlockY(Math.floor(this.getBlockY()) + 1)
                }
            }
        }
    }

    display(ctx, offsetX, offsetY) {
        if (this.getCurrentAnimation().isDone()) {
            this.setCurrentAction("idle")
        }
        this.getCurrentAnimation().drawFrame(GAME_ENGINE.clockTick, ctx, this.getPixelX() + offsetX, this.getPixelY() + offsetY, this.getWidth(), this.getHeight())
    };
}