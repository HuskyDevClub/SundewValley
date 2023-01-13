/* A Creature is a entity that can can move*/
class Creature extends Entity {
    #moving_speed_x
    #moving_speed_y
    #current_moving_speed_x
    #current_moving_speed_y
    #animations
    #current_action
    #direction_facing

    constructor(category, type, subType, x, y) {
        super(category, type, subType, x, y);
        this.#moving_speed_x = 1
        this.#moving_speed_y = 1
        this.#current_moving_speed_x = 0
        this.#current_moving_speed_y = 0
        this.#animations = {}
        this.#direction_facing = "r"
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
        this.#current_moving_speed_x = speed
    }

    getCurrentMovingSpeedY() {
        return this.#current_moving_speed_y
    }

    setCurrentMovingSpeedY(speed) {
        this.#current_moving_speed_y = speed
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
        this.setPixelX(this.getPixelX() + this.getCurrentMovingSpeedX())
        this.setPixelY(this.getPixelY() + this.getCurrentMovingSpeedY())
    }

    draw(ctx) {
        this.getCurrentAnimation().drawFrame(gameEngine.clockTick, ctx, this.getPixelX(), this.getPixelY(), this.getWidth(), this.getHeight())
    };
}