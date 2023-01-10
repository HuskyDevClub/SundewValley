/* A Creature is a entity that can can move*/
class Creature extends Entity {
    #moving_speed
    #animations
    #current_action

    constructor(category, type, subType, x, y) {
        super(category, type, subType, x, y);
        this.#moving_speed = 1
        this.#animations = {}
        this.setCurrentAction("idle")
        for (const [key, value] of Object.entries(this.getJson()["animations"])) {
            this.setAnimation(key, value[0] * this.getWidth(), value[1] * this.getHeight(), value[2], 1 / value[2], true);
        }
    }

    getMovingSpeed() {
        return this.#moving_speed
    }

    setMovingSpeed(speed) {
        this.#moving_speed = speed
    }

    setAnimation(name, xStart, yStart, frameCount, frameDuration, loop) {
        this.#animations[name] = new Animator(this.getSpriteSheet(), xStart, yStart, this.getWidth(), this.getHeight(), frameCount, frameDuration, 0, false, loop)
    }

    getAnimation(name) {
        return this.#animations[name];
    }

    getCurrentAnimation() {
        return this.getAnimation(this.getCurrentAction());
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

    draw(ctx) {
        this.getCurrentAnimation().drawFrame(gameEngine.clockTick, ctx, this.getPixelX(), this.getPixelY(), this.getWidth(), this.getHeight())
    };
}